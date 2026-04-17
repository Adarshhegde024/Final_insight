import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface VisualDataset {
  id: string;
  name: string;
  created_at: string;
}

interface VisualDatasetContextType {
  visualDatasets: VisualDataset[];
  activeVisualDataset: VisualDataset | null;
  setActiveVisualDataset: (dataset: VisualDataset | null) => void;
  refreshVisualDatasets: () => Promise<void>;
  loading: boolean;
}

const VisualDatasetContext = createContext<VisualDatasetContextType | undefined>(undefined);

export const VisualDatasetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [visualDatasets, setVisualDatasets] = useState<VisualDataset[]>([]);
  const [activeVisualDataset, setActiveVisualDataset] = useState<VisualDataset | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshVisualDatasets = async () => {
    if (!session?.user?.id) return;
    try {
      const { data, error } = await supabase
        .from('visual_datasets')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVisualDatasets(data || []);
      
      if (data && data.length > 0 && !activeVisualDataset) {
        setActiveVisualDataset(data[0]);
      } else if (data && data.length === 0) {
        setActiveVisualDataset(null);
      }
    } catch (err) {
      console.error('Error fetching visual datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      refreshVisualDatasets();
    } else {
      setVisualDatasets([]);
      setActiveVisualDataset(null);
      setLoading(false);
    }
  }, [session]);

  return (
    <VisualDatasetContext.Provider value={{ visualDatasets, activeVisualDataset, setActiveVisualDataset, refreshVisualDatasets, loading }}>
      {children}
    </VisualDatasetContext.Provider>
  );
};

export const useVisualDataset = () => {
  const context = useContext(VisualDatasetContext);
  if (context === undefined) {
    throw new Error('useVisualDataset must be used within a VisualDatasetProvider');
  }
  return context;
};
