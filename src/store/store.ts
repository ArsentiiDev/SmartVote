import {configureStore} from '@reduxjs/toolkit';
import dataSlice from './dataSlice';
import uiSlice from './uiSlice';

const store = configureStore({
    reducer: {
        data: dataSlice,
        main: uiSlice,
        ui: uiSlice
    }
})

export type RootState = ReturnType<typeof store.getState>

export default store;