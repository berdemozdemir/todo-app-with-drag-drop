export type TaskType = {
  id: number;
  title: string;
  description: string;
  order: number;
};

export type ColumnType = {
  id: number;
  title: string;
  order: number;
  tasks: TaskType[];
};

export const INITIAL_COLUMNS: ColumnType[] = [
  {
    id: 1,
    title: 'To Do',
    order: 1,
    tasks: [
      {
        id: 11,
        title: 'Learn React',
        order: 1,
        description: 'Learn React basics.',
      },
      {
        id: 12,
        order: 2,
        title: 'Setup Project',
        description: 'Initialize new project.',
      },
    ],
  },
  {
    id: 2,
    title: 'In Progress',
    order: 2,
    tasks: [
      {
        id: 12,
        title: 'Fix Bugs',
        order: 1,
        description: 'Resolve reported issues.',
      },
    ],
  },
  {
    id: 3,
    title: 'Done',
    order: 1,
    tasks: [],
  },
];
