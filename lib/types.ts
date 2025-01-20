export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type ColumnType = {
  id: TaskStatus;
  title: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};
