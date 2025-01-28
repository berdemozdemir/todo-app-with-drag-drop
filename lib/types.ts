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

export let INITIAL_COLUMNS: ColumnType[] = [
  {
    id: 1,
    title: 'To Do',
    order: 1,
    tasks: [
      {
        id: 11,
        title: 'Learn React',
        order: 2,
        description: 'Learn React basics.',
      },
      {
        id: 12,
        order: 1,
        title: 'Setup Project',
        description: 'Initialize new project.',
      },
      {
        id: 332,
        order: 3,
        title: 'Y Project',
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
        id: 13,
        title: 'Fix Bugs',
        order: 1,
        description: 'Resolve reported issues.',
      },
    ],
  },
  {
    id: 3,
    title: 'Done',
    order: 3,
    tasks: [],
  },
];
