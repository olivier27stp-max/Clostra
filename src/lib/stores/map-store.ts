import { create } from 'zustand';

type ViewMode = 'pins' | 'heatmap' | 'coverage';

interface MapFilters {
  status: string[];
  repId: string[];
  teamId: string[];
  dateRange: { from: string; to: string } | null;
}

interface MapState {
  selectedLeadId: string | null;
  selectedTerritoryId: string | null;
  selectedRepId: string | null;
  filters: MapFilters;
  viewMode: ViewMode;
  showLiveTracking: boolean;
  setSelectedLead: (id: string | null) => void;
  setSelectedTerritory: (id: string | null) => void;
  setSelectedRep: (id: string | null) => void;
  setFilters: (filters: Partial<MapFilters>) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleLiveTracking: () => void;
  clearSelection: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedLeadId: null,
  selectedTerritoryId: null,
  selectedRepId: null,
  filters: {
    status: [],
    repId: [],
    teamId: [],
    dateRange: null,
  },
  viewMode: 'pins',
  showLiveTracking: false,

  setSelectedLead: (id) => set({ selectedLeadId: id }),

  setSelectedTerritory: (id) => set({ selectedTerritoryId: id }),

  setSelectedRep: (id) => set({ selectedRepId: id }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleLiveTracking: () =>
    set((state) => ({ showLiveTracking: !state.showLiveTracking })),

  clearSelection: () =>
    set({
      selectedLeadId: null,
      selectedTerritoryId: null,
      selectedRepId: null,
    }),
}));
