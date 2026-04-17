import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Helper to fetch data
const fetchFromTable = async <T>(table: string): Promise<T[]> => {
  const { data, error } = await supabase.from(table).select('*');
  if (error) throw error;
  return data as T[];
};

export const useOverviewMetrics = () => {
  return useQuery({
    queryKey: ['overview_metrics'],
    queryFn: async () => {
      const data = await fetchFromTable<any>('overview_metrics');
      return data[0]; // Assuming one row holds the project metrics
    }
  });
};

export const useFeatureSentiment = () => {
  return useQuery({
    queryKey: ['feature_sentiment'],
    queryFn: () => fetchFromTable<any>('feature_sentiment')
  });
};

export const useSentimentOverTime = () => {
  return useQuery({
    queryKey: ['sentiment_over_time'],
    queryFn: () => fetchFromTable<any>('sentiment_over_time')
  });
};

export const useCriticalIssues = () => {
  return useQuery({
    queryKey: ['critical_issues'],
    queryFn: () => fetchFromTable<any>('critical_issues')
  });
};

export const usePositiveHighlights = () => {
  return useQuery({
    queryKey: ['positive_highlights'],
    queryFn: () => fetchFromTable<any>('positive_highlights')
  });
};

export const useRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const data = await fetchFromTable<any>('recommendations');
      // Format back to legacy mockData shape + AI signals
      const result = {
        product: data.filter(d => d.category === 'product').map(d => d.suggestion),
        marketing: data.filter(d => d.category === 'marketing').map(d => d.suggestion),
        operations: data.filter(d => d.category === 'operations').map(d => d.suggestion),
        signals: {
          emerging: data.filter(d => d.category === 'signal_emerging').map(d => d.suggestion),
          improving: data.filter(d => d.category === 'signal_improving').map(d => d.suggestion),
          anomalies: data.filter(d => d.category === 'signal_anomaly').map(d => d.suggestion)
        }
      };
      return result;
    }
  });
};

export const useFlaggedReviews = () => {
  return useQuery({
    queryKey: ['flagged_reviews'],
    queryFn: () => fetchFromTable<any>('flagged_reviews')
  });
};
