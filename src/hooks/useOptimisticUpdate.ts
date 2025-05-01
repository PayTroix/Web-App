import { useState } from 'react';

export function useOptimisticUpdate<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<T>[]>([]);

  const optimisticUpdate = async (
    updateFn: () => Promise<T>,
    optimisticData: Partial<T>
  ) => {
    setPendingUpdates(prev => [...prev, optimisticData]);
    setData(prev => ({ ...prev, ...optimisticData }));

    try {
      const result = await updateFn();
      setData(result);
      return result;
    } catch (error) {
      // Rollback on error
      setPendingUpdates(prev => prev.filter(update => update !== optimisticData));
      setData(initialData);
      throw error;
    } finally {
      setPendingUpdates(prev => prev.filter(update => update !== optimisticData));
    }
  };

  return { data, pendingUpdates, optimisticUpdate };
}