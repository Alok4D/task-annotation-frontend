import { baseApi } from '@/services/baseApi';
import { Task } from '@/types/task';

const apiWithTags = baseApi.enhanceEndpoints({ addTagTypes: ['Task'] });

export const taskApi = apiWithTags.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], string>({
      query: (selectedDate) => `tasks/?selected_date=${selectedDate}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Task' as const, id })), { type: 'Task', id: 'LIST' }]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    getAllTasks: builder.query<Task[], void>({
      query: () => `tasks/`,
      providesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: 'tasks/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation<Task, Partial<Task> & Pick<Task, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `tasks/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }, { type: 'Task', id: 'LIST' }],
    }),
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `tasks/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Task', id }, { type: 'Task', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetAllTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
