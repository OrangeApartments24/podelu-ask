import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

// Define a type for the slice state
interface CounterState {
    value: number;
    isLogin: boolean;
}

// Define the initial state using that type
const initialState: CounterState = {
    value: 0,
    isLogin: false,
};

export const counterSlice = createSlice({
    name: 'counter',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        signIn: (state) => {
            state.isLogin = true;
        },
    },
});

export const { signIn } = counterSlice.actions;

export default counterSlice.reducer;
