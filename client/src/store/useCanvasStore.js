import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const MAX_HISTORY = 50;

export const useCanvasStore = create((set, get) => ({
  meta: {
    projectId: 'default_project',
    name: 'Untitled Project',
    version: '1.0',
    framework: 'react-cra',
    language: 'js',
    stylingSystem: 'tailwind',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  components: [],
  selectedId: null,
  past: [],
  future: [],
  zoomLevel: 70,
  isolatedZoomLevel: 100,
  showGrid: true,
  isSplitView: false,
  isolatedComponentId: null,
  activeCanvas: 'main',
  
  setActiveCanvas: (canvasName) => set({ activeCanvas: canvasName }),
  toggleSplitView: () => set((state) => ({ isSplitView: !state.isSplitView })),
  isolateComponent: (id) => set({ isolatedComponentId: id, isSplitView: true, activeCanvas: 'isolated' }),
  exitIsolation: () => set({ isolatedComponentId: null, isSplitView: false, activeCanvas: 'main' }),

  recordHistory: () => {
    const { components, past } = get();
    const nextPast = [...past, JSON.parse(JSON.stringify(components))];
    if (nextPast.length > MAX_HISTORY) nextPast.shift();
    return nextPast;
  },

  setProjectMeta: (metaUpdates) => set((state) => ({
    meta: { ...state.meta, ...metaUpdates, updatedAt: new Date().toISOString() },
  })),

  setSelectedId: (id) => set({ selectedId: id }),

  setZoomLevel: (zoomOrUpdater) => set((state) => {
    const newZoom = typeof zoomOrUpdater === 'function' ? zoomOrUpdater(state.zoomLevel) : zoomOrUpdater;
    return { zoomLevel: Math.min(Math.max(newZoom, 30), 200) };
  }),
  zoomIn: () => set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 10, 200) })),
  zoomOut: () => set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 10, 30) })),
  resetZoom: () => set({ zoomLevel: 70 }),

  setIsolatedZoomLevel: (zoomOrUpdater) => set((state) => {
    const newZoom = typeof zoomOrUpdater === 'function' ? zoomOrUpdater(state.isolatedZoomLevel) : zoomOrUpdater;
    return { isolatedZoomLevel: Math.min(Math.max(newZoom, 30), 200) };
  }),
  zoomInIsolated: () => set((state) => ({ isolatedZoomLevel: Math.min(state.isolatedZoomLevel + 10, 200) })),
  zoomOutIsolated: () => set((state) => ({ isolatedZoomLevel: Math.max(state.isolatedZoomLevel - 10, 30) })),
  resetIsolatedZoom: () => set({ isolatedZoomLevel: 100 }),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  addComponent: (component) => set((state) => {
    const newPast = get().recordHistory();
    const newComponents = [...state.components, { ...component, order: state.components.length }];
    return {
      components: newComponents,
      selectedId: component.id,
      past: newPast,
      future: [],
    };
  }),

  updateComponent: (id, newProps) => set((state) => {
    const newPast = get().recordHistory();
    const newComponents = state.components.map((comp) =>
      comp.id === id ? { ...comp, props: { ...comp.props, ...newProps } } : comp
    );
    return {
      components: newComponents,
      past: newPast,
      future: [],
    };
  }),

  duplicateComponent: (id) => set((state) => {
    const compToDup = state.components.find((c) => c.id === id);
    if (!compToDup) return state;
    const newPast = get().recordHistory();
    const duplicated = {
      ...JSON.parse(JSON.stringify(compToDup)),
      id: `comp_${uuidv4().substring(0, 8)}`,
      order: state.components.length,
    };
    return {
      components: [...state.components, duplicated],
      selectedId: duplicated.id,
      past: newPast,
      future: [],
    };
  }),

  removeComponent: (id) => set((state) => {
    const newPast = get().recordHistory();
    const filtered = state.components.filter((comp) => comp.id !== id);
    const reordered = filtered.map((comp, idx) => ({ ...comp, order: idx }));
    return {
      components: reordered,
      selectedId: state.selectedId === id ? null : state.selectedId,
      past: newPast,
      future: [],
    };
  }),

  reorderComponents: (startIndex, endIndex) => set((state) => {
    const newPast = get().recordHistory();
    const result = Array.from(state.components);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const reordered = result.map((comp, idx) => ({ ...comp, order: idx }));
    return {
      components: reordered,
      past: newPast,
      future: [],
    };
  }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    return {
      components: previous,
      past: newPast,
      future: [state.components, ...state.future],
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      components: next,
      past: [...state.past, state.components],
      future: newFuture,
    };
  }),
}));
