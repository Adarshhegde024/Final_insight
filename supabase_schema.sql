-- Run this entire script in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS overview_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_reviews int,
  positive_percent int,
  negative_percent int,
  neutral_percent int,
  spam_count int,
  duplicate_count int
);

CREATE TABLE IF NOT EXISTS feature_sentiment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature text,
  positive int,
  negative int,
  neutral int
);

CREATE TABLE IF NOT EXISTS sentiment_over_time (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month text,
  positive int,
  negative int,
  neutral int
);

CREATE TABLE IF NOT EXISTS critical_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue text,
  severity text,
  count int
);

CREATE TABLE IF NOT EXISTS positive_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  highlight text,
  count int
);

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text, -- 'product', 'marketing', 'operations'
  suggestion text
);

CREATE TABLE IF NOT EXISTS flagged_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text,
  type text,
  confidence float
);

CREATE TABLE IF NOT EXISTS sample_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text,
  sentiment text,
  date date
);

-- Turn on Public Read Access (for demo purposes)
ALTER TABLE overview_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_sentiment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentiment_over_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE critical_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE positive_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE flagged_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON overview_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON feature_sentiment FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON sentiment_over_time FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON critical_issues FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON positive_highlights FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON flagged_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON sample_reviews FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON overview_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON feature_sentiment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON sentiment_over_time FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON critical_issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON positive_highlights FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON flagged_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON sample_reviews FOR INSERT WITH CHECK (true);
