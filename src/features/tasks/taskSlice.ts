import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskState {
  selectedDate: string;
}

const initialState: TaskState = {
  selectedDate: new Date().toISOString().split('T')[0],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { setSelectedDate } = taskSlice.actions;
export default taskSlice.reducer;
