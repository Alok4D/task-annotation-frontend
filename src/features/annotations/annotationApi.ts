import { baseApi } from '@/services/baseApi';
import { ImageModel, Annotation } from '@/types/annotation';

const apiWithTags = baseApi.enhanceEndpoints({ addTagTypes: ['Image', 'Annotation'] });

export const annotationApi = apiWithTags.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query<ImageModel[], void>({
      query: () => 'annotations/images/',
      providesTags: ['Image'],
    }),
    uploadImage: builder.mutation<ImageModel, FormData>({
      query: (formData) => ({
        url: 'annotations/images/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Image'],
    }),
    deleteImage: builder.mutation<void, number>({
      query: (id) => ({
        url: `annotations/images/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Image'],
    }),
    // We fetch all annotations and will filter them by imageId on the frontend just to be safe
    getAnnotations: builder.query<Annotation[], void>({
      query: () => 'annotations/annotations/',
      providesTags: ['Annotation'],
    }),
    saveAnnotation: builder.mutation<Annotation, Partial<Annotation>>({
      query: (body) => ({
        url: 'annotations/annotations/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Annotation'],
    }),
    updateAnnotation: builder.mutation<Annotation, { id: number; body: Partial<Annotation> }>({
      query: ({ id, body }) => ({
        url: `annotations/annotations/${id}/`,
        method: 'PATCH',
        body,
      }),
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          annotationApi.util.updateQueryData('getAnnotations', undefined, (draft) => {
            const index = draft.findIndex((a) => a.id === id);
            if (index !== -1) {
              Object.assign(draft[index], body);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Annotation'],
    }),
    deleteAnnotation: builder.mutation<void, number>({
      query: (id) => ({
        url: `annotations/annotations/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Annotation'],
    }),
  }),
});

export const {
  useGetImagesQuery,
  useUploadImageMutation,
  useGetAnnotationsQuery,
  useSaveAnnotationMutation,
  useUpdateAnnotationMutation,
  useDeleteAnnotationMutation,
  useDeleteImageMutation,
} = annotationApi;
