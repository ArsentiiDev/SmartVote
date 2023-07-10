import { IExpert, IHeuristic, IObject, IVoting } from "@/Types/Interfaces";
import { Tab } from "@/components/Main";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface sidebar  {
    activeVotingIndex: string | null
}

interface UiSlice extends sidebar {
    activeTab: Tab | null,
    selectedMethod: string | null,
    openedTooltipIndex: string | null,
    isAddVotingModalOpen: boolean,
    isAddObjectModalOpen: boolean,
    isAddExpertModalOpen: boolean,
    isAddHeuristicModalOpen: boolean,
    isVotingModalOpen: boolean,
    editingObject: any,
    selectedCriteria: string | null
}

const initialState:UiSlice = {
    activeTab: 0,
    selectedCriteria: null,
    selectedMethod: null,
    openedTooltipIndex: null,
    isAddVotingModalOpen: false,
    isAddObjectModalOpen: false,
    isAddExpertModalOpen: false,
    isAddHeuristicModalOpen: false,
    editingObject: null,
    isVotingModalOpen: false,
    activeVotingIndex: null
}


const uiSlice = createSlice({
    name: 'main',
    initialState: initialState,
    reducers: {
        switchActiveTab: (state, action: PayloadAction<Tab>) => {
            state.activeTab = action.payload
        },
        switchCriteria: (state, action: PayloadAction<string>) => {
            state.selectedCriteria = action.payload
        },
        switchMethod: (state, action: PayloadAction<string>) => {
            state.selectedMethod = action.payload
        },
        toggleTooltip: (state, action: PayloadAction<string | null>) => {
            state.openedTooltipIndex = action.payload
        },
        toggleAddVotingModal: (state) => {
            state.isAddVotingModalOpen = !state.isAddVotingModalOpen
        },
        toggleAddObjectModal: (state) => {
            state.isAddObjectModalOpen = !state.isAddObjectModalOpen
        },
        toggleAddExpertModal: (state) => {
            state.isAddExpertModalOpen = !state.isAddExpertModalOpen
        },
        toggleAddHeuristicModal: (state) => {
            state.isAddHeuristicModalOpen = !state.isAddHeuristicModalOpen
        },
        setEditingObject: (state, action: PayloadAction<IObject | IExpert | IHeuristic | null>) => {
            state.editingObject = action.payload
        },
        clearEditingObject: (state) => {
            state.editingObject = null
        },
        switchActiveVote: (state, action: PayloadAction<string | null>) => {
            const selectedId = action.payload
            if (selectedId) {
                state.activeVotingIndex = selectedId
            }
        },
        toggleVotingDropdown: (state) => {
            state.isVotingModalOpen = !state.isVotingModalOpen
        },
        clearData: (state) => {
            state.selectedCriteria = null;
            state.selectedMethod = null;
        }
    }
})

export const {
    switchActiveTab, 
    switchCriteria, 
    switchMethod, 
    toggleTooltip, 
    toggleAddVotingModal, 
    toggleAddObjectModal, 
    toggleAddExpertModal, 
    toggleAddHeuristicModal,
    setEditingObject,
    clearEditingObject,
    switchActiveVote,
    toggleVotingDropdown,
    clearData} = uiSlice.actions;

export default uiSlice.reducer;