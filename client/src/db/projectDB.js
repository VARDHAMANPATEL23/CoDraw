import Dexie from 'dexie';
import { API_BASE } from '../utils/api';

export const db = new Dexie('CoDrawDB');

db.version(2).stores({
  projects: 'meta.projectId, meta.name, meta.updatedAt',
  syncQueue: '++id, projectId, timestamp',
});

export async function saveProjectToDB(projectJSON) {
  if (!projectJSON || !projectJSON.meta || !projectJSON.meta.projectId) return;
  await db.projects.put(projectJSON);

  // If offline or user is logged in, queue for sync
  const token = localStorage.getItem('codraw_token');
  if (token) {
    if (!navigator.onLine) {
      await db.syncQueue.put({
        projectId: projectJSON.meta.projectId,
        jsonBlob: projectJSON,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Synchronous background sync attempt
      try {
        await fetch(`${API_BASE}/projects/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId: projectJSON.meta.projectId,
            name: projectJSON.meta.name,
            jsonBlob: projectJSON,
            updatedAt: projectJSON.meta.updatedAt,
          }),
        });
      } catch (err) {
        // Fallback to queue if request fails
        await db.syncQueue.put({
          projectId: projectJSON.meta.projectId,
          jsonBlob: projectJSON,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }
}

export async function flushSyncQueue() {
  const token = localStorage.getItem('codraw_token');
  if (!token || !navigator.onLine) return;

  const queuedItems = await db.syncQueue.toArray();
  for (const item of queuedItems) {
    try {
      const res = await fetch(`${API_BASE}/projects/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: item.projectId,
          jsonBlob: item.jsonBlob,
          updatedAt: item.timestamp,
        }),
      });

      if (res.ok) {
        await db.syncQueue.delete(item.id);
      }
    } catch (err) {
      console.warn('Sync queue flush error for project', item.projectId, err);
    }
  }
}

export async function getProjectFromDB(projectId) {
  return await db.projects.get(projectId);
}

export async function getAllProjectsFromDB() {
  return await db.projects.toArray();
}

export async function deleteProjectFromDB(projectId) {
  await db.projects.delete(projectId);
  const token = localStorage.getItem('codraw_token');
  if (token && navigator.onLine) {
    try {
      await fetch(`${API_BASE}/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.warn('Cloud delete error:', err);
    }
  }
}
