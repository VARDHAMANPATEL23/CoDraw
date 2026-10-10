import { useState, useEffect } from 'react';
import { flushSyncQueue, getAllProjectsFromDB, saveProjectToDB } from '../db/projectDB';
import { useAuthStore } from '../store/useAuthStore';
import { API_BASE } from '../utils/api';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushSyncQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial flush if online
    if (navigator.onLine) {
      flushSyncQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [token]);

  const mergeCloudProjects = async () => {
    if (!isAuthenticated || !token || !navigator.onLine) {
      return await getAllProjectsFromDB();
    }

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return await getAllProjectsFromDB();

      const { projects: cloudProjects } = await res.json();
      const localProjects = await getAllProjectsFromDB();

      const mergedMap = new Map();

      // Populate with local projects
      localProjects.forEach((p) => {
        mergedMap.set(p.meta.projectId, p);
      });

      // Merge cloud projects (last-write-wins)
      for (const cloudP of cloudProjects) {
        const cloudBlob = cloudP.jsonBlob;
        const existingLocal = mergedMap.get(cloudP.projectId);

        if (!existingLocal) {
          mergedMap.set(cloudP.projectId, cloudBlob);
          await saveProjectToDB(cloudBlob);
        } else {
          const localTime = new Date(existingLocal.meta.updatedAt).getTime();
          const cloudTime = new Date(cloudP.updatedAt || cloudBlob.meta.updatedAt).getTime();

          if (cloudTime > localTime) {
            mergedMap.set(cloudP.projectId, cloudBlob);
            await saveProjectToDB(cloudBlob);
          }
        }
      }

      return Array.from(mergedMap.values());
    } catch (err) {
      console.warn('Failed to merge cloud projects:', err);
      return await getAllProjectsFromDB();
    }
  };

  return { isOnline, mergeCloudProjects };
}
