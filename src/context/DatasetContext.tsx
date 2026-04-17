import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface Dataset {
  id: string;
  name: string;
  category: string;
  user_id: string;
}

interface DatasetContextType {
  datasets: Dataset[];
  activeDataset: Dataset | null;
  setActiveDatasetId: (id: string) => void;
  refreshDatasets: () => Promise<void>;
  isLoading: boolean;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshDatasets = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setDatasets(data || []);
      
      // Auto-select latest dataset if none active
      if (data && data.length > 0) {
        if (!activeDatasetId || !data.find(d => d.id === activeDatasetId)) {
          setActiveDatasetId(data[0].id);
        }
      } else {
        setActiveDatasetId(null);
      }
    } catch (error: any) {
      console.error('Error fetching datasets:', error.message);
      toast.error('Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize datasets when user logs in
  useEffect(() => {
    if (session) {
      refreshDatasets();
    } else {
      setDatasets([]);
      setActiveDatasetId(null);
    }
  }, [session]);

  const activeDataset = datasets.find(d => d.id === activeDatasetId) || null;

  return (
    <DatasetContext.Provider value={{ datasets, activeDataset, setActiveDatasetId, refreshDatasets, isLoading }}>
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
};
