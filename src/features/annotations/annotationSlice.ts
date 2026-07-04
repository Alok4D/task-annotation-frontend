import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnnotationState {
  selectedImageId: number | null;
}

const initialState: AnnotationState = {
  selectedImageId: null,
};

const annotationSlice = createSlice({
  name: 'annotations',
  initialState,
  reducers: {
    setSelectedImageId: (state, action: PayloadAction<number | null>) => {
      state.selectedImageId = action.payload;
    },
  },
});

export const { setSelectedImageId } = annotationSlice.actions;
export default annotationSlice.reducer;
