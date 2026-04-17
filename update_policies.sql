-- Run this in your Supabase SQL Editor to allow the analyzer to delete old analytics before inserting the new ones!

CREATE POLICY "Allow public delete access" ON overview_metrics FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON feature_sentiment FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON sentiment_over_time FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON critical_issues FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON positive_highlights FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON recommendations FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON flagged_reviews FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON sample_reviews FOR DELETE USING (true);

-- We can also delete the duplicate rows that were left behind during your test upload:
DELETE FROM overview_metrics;
DELETE FROM feature_sentiment;
DELETE FROM sentiment_over_time;
DELETE FROM critical_issues;
DELETE FROM positive_highlights;
DELETE FROM recommendations;
DELETE FROM flagged_reviews;
DELETE FROM sample_reviews;
