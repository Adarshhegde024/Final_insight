-- =========================================================================
-- VISUAL ANALYTICS SCHEMA: MULTI-TENANT ISOLATED ENGINE
-- Run this in your Supabase SQL Editor to enable Image Processing.
-- =========================================================================

-- 1. DROP PRE-EXISTING VISUAL TABLES (If any exist)
DROP TABLE IF EXISTS visual_metrics CASCADE;
DROP TABLE IF EXISTS visual_defects CASCADE;
DROP TABLE IF EXISTS flagged_images CASCADE;
DROP TABLE IF EXISTS visual_datasets CASCADE;

-- 2. CREATE WORKSPACES ENGINE FOR IMAGES
CREATE TABLE visual_datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  created_at timestamp DEFAULT now()
);
ALTER TABLE visual_datasets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON visual_datasets FOR ALL USING (auth.uid() = user_id);

-- 3. ANALYTICS ENGINE WITH MULTI-TENANT LINKS
CREATE TABLE visual_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES visual_datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  total_images int,
  defect_percent int,
  passed_percent int
);

CREATE TABLE visual_defects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES visual_datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  defect_type text,
  severity text,
  count int
);

CREATE TABLE flagged_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES visual_datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  image_url text,
  defect_description text,
  confidence float
);

-- 4. ENABLE ROW LEVEL SECURITY
ALTER TABLE visual_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON visual_metrics FOR ALL USING (auth.uid() = user_id);

ALTER TABLE visual_defects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON visual_defects FOR ALL USING (auth.uid() = user_id);

ALTER TABLE flagged_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON flagged_images FOR ALL USING (auth.uid() = user_id);

-- 5. SUPABASE CLOUD STORAGE BUCKET CONFIGURATION
-- This creates a public bucket named "visual_reviews" to store the physical images.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('visual_reviews', 'visual_reviews', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy allowing authenticated users to upload new images.
CREATE POLICY "Allow authenticated block uploads" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'visual_reviews');

-- Storage Policy allowing anyone to view the images (since the URL is required for Dashboard rendering & API calls)
CREATE POLICY "Allow public image viewing" 
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'visual_reviews');

-- Storage Policy allowing authenticated users to delete their own uploaded test images.
CREATE POLICY "Allow authenticated deletion" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'visual_reviews');
