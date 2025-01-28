import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnType, INITIAL_COLUMNS } from './types';
import { queryClient } from './QueryClient';

const getColumns = (): Promise<ColumnType[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const sortedColumns = INITIAL_COLUMNS.map((column) => ({
        ...column,
        tasks: column.tasks.sort((a, b) => a.order - b.order),
      })).sort((a, b) => a.order - b.order);

      resolve(sortedColumns);
    }, 0);
  });

export const useGetColumnQuery = () =>
  useQuery({
    queryKey: ['columns'],
    queryFn: getColumns,
  });

const updateColumns = (updatedColumns: ColumnType[]) =>
  new Promise((resolve) => {
    setTimeout(() => {
      INITIAL_COLUMNS.splice(0, INITIAL_COLUMNS.length, ...updatedColumns);

      resolve(updatedColumns);
    }, 0);
  });

export const useUpdateColumnsMutation = () =>
  useMutation({
    mutationFn: updateColumns,
    onSuccess: (newColumns) => {
      queryClient.setQueryData(['columns'], newColumns);
    },
  });
