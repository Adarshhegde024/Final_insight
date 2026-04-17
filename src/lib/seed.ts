import { supabase } from "./supabase";
import * as mockData from "@/data/mockData";

export const seedDatabase = async () => {
  try {
    // 1. Overview metrics
    const { data: existingMetrics } = await supabase.from('overview_metrics').select('id').limit(1);
    
    if (!existingMetrics || existingMetrics.length === 0) {
      await supabase.from('overview_metrics').insert({
        total_reviews: mockData.overviewMetrics.totalReviews,
        positive_percent: mockData.overviewMetrics.positivePercent,
        negative_percent: mockData.overviewMetrics.negativePercent,
        neutral_percent: mockData.overviewMetrics.neutralPercent,
        spam_count: mockData.overviewMetrics.spamCount,
        duplicate_count: mockData.overviewMetrics.duplicateCount
      });
    }

    // 2. Feature sentiment
    const { data: existingFS } = await supabase.from('feature_sentiment').select('id').limit(1);
    if (!existingFS || existingFS.length === 0) {
      await supabase.from('feature_sentiment').insert(mockData.featureSentiment);
    }

    // 3. Sentiment over time
    const { data: existingST } = await supabase.from('sentiment_over_time').select('id').limit(1);
    if (!existingST || existingST.length === 0) {
      await supabase.from('sentiment_over_time').insert(mockData.sentimentOverTime);
    }

    // 4. Critical issues
    const { data: existingCI } = await supabase.from('critical_issues').select('id').limit(1);
    if (!existingCI || existingCI.length === 0) {
      await supabase.from('critical_issues').insert(mockData.criticalIssues.map(c => ({
        issue: c.issue, severity: c.severity, count: c.count
      })));
    }

    // 5. Positive highlights
    const { data: existingPH } = await supabase.from('positive_highlights').select('id').limit(1);
    if (!existingPH || existingPH.length === 0) {
      await supabase.from('positive_highlights').insert(mockData.positiveHighlights.map(p => ({
        highlight: p.highlight, count: p.count
      })));
    }

    // 6. Recommendations
    const { data: existingRec } = await supabase.from('recommendations').select('id').limit(1);
    if (!existingRec || existingRec.length === 0) {
      const recs = [];
      mockData.recommendations.product.forEach(r => recs.push({ category: 'product', suggestion: r }));
      mockData.recommendations.marketing.forEach(r => recs.push({ category: 'marketing', suggestion: r }));
      mockData.recommendations.operations.forEach(r => recs.push({ category: 'operations', suggestion: r }));
      await supabase.from('recommendations').insert(recs);
    }

    // 7. Flagged reviews
    const { data: existingFR } = await supabase.from('flagged_reviews').select('id').limit(1);
    if (!existingFR || existingFR.length === 0) {
      await supabase.from('flagged_reviews').insert(mockData.flaggedReviews.map(f => ({
        text: f.text, type: f.type, confidence: f.confidence
      })));
    }

    // 8. Sample reviews
    const { data: existingSR } = await supabase.from('sample_reviews').select('id').limit(1);
    if (!existingSR || existingSR.length === 0) {
      await supabase.from('sample_reviews').insert(mockData.sampleReviews.map(s => ({
        text: s.text, sentiment: s.sentiment, date: s.date
      })));
    }

    return true;
  } catch (err) {
    console.error("Error seeding database:", err);
    return false;
  }
};
