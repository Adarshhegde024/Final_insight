import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useVisualDataset } from '@/context/VisualDatasetContext';

const fetchFromTable = async <T>(table: string, datasetId: string): Promise<T[]> => {
  const { data, error } = await supabase.from(table).select('*').eq('dataset_id', datasetId);
  if (error) throw error;
  return data as T[];
};

export const useVisualMetrics = () => {
  const { activeVisualDataset } = useVisualDataset();
  return useQuery({
    queryKey: ['visual_metrics', activeVisualDataset?.id],
    queryFn: async () => {
      if (!activeVisualDataset?.id) return null;
      const data = await fetchFromTable<any>('visual_metrics', activeVisualDataset.id);
      return data[0] || null;
    },
    enabled: !!activeVisualDataset?.id
  });
};

export const useVisualDefects = () => {
  const { activeVisualDataset } = useVisualDataset();
  return useQuery({
    queryKey: ['visual_defects', activeVisualDataset?.id],
    queryFn: () => fetchFromTable<any>('visual_defects', activeVisualDataset.id),
    enabled: !!activeVisualDataset?.id
  });
};

export const useFlaggedImages = () => {
  const { activeVisualDataset } = useVisualDataset();
  return useQuery({
    queryKey: ['flagged_images', activeVisualDataset?.id],
    queryFn: () => fetchFromTable<any>('flagged_images', activeVisualDataset.id),
    enabled: !!activeVisualDataset?.id
  });
};
