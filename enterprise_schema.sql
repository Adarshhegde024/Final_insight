-- =========================================================================
-- ENTERPRISE MULTI-TENANT SCHEMA: FULL WIPEOUT & REBUILD
-- RUN THIS ENTIRE SCRIPT IN YOUR SUPABASE SQL EDITOR
-- =========================================================================

-- 1. DROP ALL PRE-EXISTING TABLES (Clears dummy data and old schemas)
DROP TABLE IF EXISTS overview_metrics CASCADE;
DROP TABLE IF EXISTS feature_sentiment CASCADE;
DROP TABLE IF EXISTS sentiment_over_time CASCADE;
DROP TABLE IF EXISTS critical_issues CASCADE;
DROP TABLE IF EXISTS positive_highlights CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS flagged_reviews CASCADE;
DROP TABLE IF EXISTS sample_reviews CASCADE;
DROP TABLE IF EXISTS datasets CASCADE;

-- 2. CREATE WORKSPACES ENGINE (Datasets)
CREATE TABLE datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  created_at timestamp DEFAULT now()
);
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON datasets FOR ALL USING (auth.uid() = user_id);

-- 3. REBUILD ANALYTICS ENGINE WITH MULTI-TENANT LINKS
CREATE TABLE overview_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  total_reviews int,
  positive_percent int,
  negative_percent int,
  neutral_percent int,
  spam_count int,
  duplicate_count int
);

CREATE TABLE feature_sentiment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  feature text,
  positive int,
  negative int,
  neutral int
);

CREATE TABLE sentiment_over_time (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  month text,
  positive int,
  negative int,
  neutral int
);

CREATE TABLE critical_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  issue text,
  severity text,
  count int
);

CREATE TABLE positive_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  highlight text,
  count int
);

CREATE TABLE recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  category text,
  suggestion text
);

CREATE TABLE flagged_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  text text,
  type text,
  confidence float
);

CREATE TABLE sample_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  text text,
  sentiment text,
  date date
);

-- 4. ENABLE ROW LEVEL SECURITY & HARDCODE AUTH ISOLATION
-- This prevents any users from reading, deleting, or injecting rows that belong to someone else.
ALTER TABLE overview_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON overview_metrics FOR ALL USING (auth.uid() = user_id);

ALTER TABLE feature_sentiment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON feature_sentiment FOR ALL USING (auth.uid() = user_id);

ALTER TABLE sentiment_over_time ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON sentiment_over_time FOR ALL USING (auth.uid() = user_id);

ALTER TABLE critical_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON critical_issues FOR ALL USING (auth.uid() = user_id);

ALTER TABLE positive_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON positive_highlights FOR ALL USING (auth.uid() = user_id);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON recommendations FOR ALL USING (auth.uid() = user_id);

ALTER TABLE flagged_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON flagged_reviews FOR ALL USING (auth.uid() = user_id);

ALTER TABLE sample_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON sample_reviews FOR ALL USING (auth.uid() = user_id);
