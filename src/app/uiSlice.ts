import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  sidebarCollapsed: boolean;
  activeAssociationId: string | null;
  activeModal: string | null;
  modalPayload: any;
  searchQuery: string;
  unreadNotifications: number;
  pageHeader: {
    title: string | null;
    description: string | null;
  };
}

const initialState: UiState = {
  sidebarCollapsed: false,
  activeAssociationId: null,
  activeModal: null,
  modalPayload: null,
  searchQuery: "",
  unreadNotifications: 0,
  pageHeader: {
    title: null,
    description: null,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setActiveAssociationId: (state, action: PayloadAction<string | null>) => {
      state.activeAssociationId = action.payload;
    },
    openModal: (
      state,
      action: PayloadAction<{ modal: string; payload?: any }>
    ) => {
      state.activeModal = action.payload.modal;
      state.modalPayload = action.payload.payload || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalPayload = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setUnreadNotifications: (state, action: PayloadAction<number>) => {
      state.unreadNotifications = action.payload;
    },
    setPageHeader: (
      state,
      action: PayloadAction<{ title?: string | null; description?: string | null }>
    ) => {
      state.pageHeader = {
        title: action.payload.title ?? null,
        description: action.payload.description ?? null,
      };
    },
    clearPageHeader: (state) => {
      state.pageHeader = {
        title: null,
        description: null,
      };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setActiveAssociationId,
  openModal,
  closeModal,
  setSearchQuery,
  setUnreadNotifications,
  setPageHeader,
  clearPageHeader,
} = uiSlice.actions;

export default uiSlice.reducer;
