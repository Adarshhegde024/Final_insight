import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useDataset } from '@/context/DatasetContext';

// Helper to fetch data
const fetchFromTable = async <T>(table: string, datasetId: string): Promise<T[]> => {
  const { data, error } = await supabase.from(table).select('*').eq('dataset_id', datasetId);
  if (error) throw error;
  return data as T[];
};

export const useOverviewMetrics = () => {
  const { activeDataset } = useDataset();
  return useQuery({
    queryKey: ['overview_metrics', activeDataset?.id],
    queryFn: async () => {
      if (!activeDataset?.id) return null;
      const data = await fetchFromTable<any>('overview_metrics', activeDataset.id);
      return data[0] || null;
    },
    enabled: !!activeDataset?.id
  });
};

export const useFeatureSentiment = () => {
  const { activeDataset } = useDataset();
  return useQuery({
    queryKey: ['feature_sentiment', activeDataset?.id],
    queryFn: () => fetchFromTable<any>('feature_sentiment', activeDataset.id),
    enabled: !!activeDataset?.id
  });
};

export const useSentimentOverTime = () => {
  const { activeDataset } = useDataset();
  return useQuery({
    queryKey: ['sentiment_over_time', activeDataset?.id],
    queryFn: () => fetchFromTable<any>('sentiment_over_time', activeDataset.id),
    enabled: !!activeDataset?.id
  });
};

export const useCriticalIssues = () => {
  const { activeDataset } = useDataset();
  return useQuery({
    queryKey: ['critical_issues', activeDataset?.id],
    queryFn: () => fetchFromTable<any>('critical_issues', activeDataset.id),
    enabled: !!activeDataset?.id
  });
};

export const usePositiveHighlights = () => {
  const { activeDataset } = useDataset();
  return useQuery({
    queryKey: ['positive_highlights', activeDataset?.id],
    queryFn: () => fetchFromTable<any>('positive_highlights', activeDataset.id),
    enabled: !!activeDataset?.id
  });
};

export const useRecommendations = () => {
  const { activeDataset } = useDataset();
  return useQuery({
    queryKey: ['recommendations', activeDataset?.id],
    queryFn: async () => {
      if (!activeDataset?.id) return null;
      const data = await fetchFromTable<any>('recommendations', activeDataset.id);
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
    },
    enabled: !!activeDataset?.id
  });
};

export const useFlaggedReviews = () => {
  const { activeDataset } = useDataset();
  return useQuery({
    queryKey: ['flagged_reviews', activeDataset?.id],
    queryFn: () => fetchFromTable<any>('flagged_reviews', activeDataset.id),
    enabled: !!activeDataset?.id
  });
};
