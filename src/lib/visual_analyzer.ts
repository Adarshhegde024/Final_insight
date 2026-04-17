import { supabase } from "./supabase";
import { generateVisualInsights, VisualInsights } from "./ai";

export const analyzeImagesLocally = async (files: File[], datasetId: string): Promise<void> => {
  if (files.length === 0) throw new Error("No images provided for analysis.");

  let totalProcessed = 0;
  let defectsFound = 0;
  let passedInspection = 0;

  const defectCounts: Record<string, number> = {};
  const flaggedImages: any[] = [];

  for (const file of files) {
    try {
      // 1. Upload to Supabase Storage Bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${datasetId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('visual_reviews')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        continue;
      }

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('visual_reviews')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // 3. Process via Groq / Llama 3.2 90b Vision
      const insight: VisualInsights = await generateVisualInsights(publicUrl, file.name);

      totalProcessed++;

      if (insight.passed_inspection) {
        passedInspection++;
      } else {
        defectsFound++;
        
        // Track defect types
        const type = insight.defect_type || "Unknown Defect";
        defectCounts[type] = (defectCounts[type] || 0) + 1;

        // Flag the image if confidence is high or severity is critical
        if (insight.confidence > 0.75 || insight.severity === 'high') {
          flaggedImages.push({
            dataset_id: datasetId,
            image_url: publicUrl,
            defect_description: insight.description,
            confidence: insight.confidence
          });
        }
      }
    } catch (err) {
      console.error(`Failed resolving image ${file.name}`, err);
    }
  }

  if (totalProcessed === 0) {
    throw new Error("Failed to process any images. Ensure you are uploading valid jpegs/pngs.");
  }

  // 4. Update Database
  const defectPercent = Math.round((defectsFound / totalProcessed) * 100);
  const passedPercent = Math.round((passedInspection / totalProcessed) * 100);

  // Clear old data for append behavior (if needed, but for images we'll just overwrite dashboard aggregates)
  const emptyTable = async (t: string) => { await supabase.from(t).delete().eq("dataset_id", datasetId); };
  await Promise.all([
    emptyTable('visual_metrics'),
    emptyTable('visual_defects'),
    emptyTable('flagged_images')
  ]);

  // Insert Metrics
  await supabase.from("visual_metrics").insert({
    dataset_id: datasetId,
    total_images: totalProcessed,
    defect_percent: defectPercent,
    passed_percent: passedPercent
  });

  // Insert Defect Breakdown
  const defectRows = Object.entries(defectCounts).map(([type, count]) => ({
    dataset_id: datasetId,
    defect_type: type,
    severity: "high", // simplified
    count: count
  }));
  
  if (defectRows.length > 0) {
    await supabase.from("visual_defects").insert(defectRows);
  }

  // Insert Flagged
  if (flaggedImages.length > 0) {
    await supabase.from("flagged_images").insert(flaggedImages);
  }
};
