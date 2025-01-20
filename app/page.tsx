'use client';

import { Column } from '@/components/Column';
import { ColumnType, Task, TaskStatus } from '@/lib/types';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import React, { useState } from 'react';

const COLUMNS: ColumnType[] = [
  { id: TaskStatus.TODO, title: 'To do' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
  { id: TaskStatus.DONE, title: 'Done' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Learn React',
    description: 'Due to create user-friendly interfaces, learn React.',
    status: TaskStatus.TODO,
  },
  {
    id: '2',
    title: 'Wash the car',
    description: 'This task came from father :)',
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: '3',
    title: 'Call mom',
    description: 'Someone take care of your nephew.',
    status: TaskStatus.DONE,
  },
  {
    id: '4',
    title: 'Read a book',
    description: 'Read 30 pages from a self-improvement book.',
    status: TaskStatus.TODO,
  },
  {
    id: '5',
    title: 'Workout',
    description: 'Go to the gym and complete a full-body workout.',
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: '6',
    title: 'Grocery shopping',
    description: 'Buy vegetables, milk, and other essentials.',
    status: TaskStatus.DONE,
  },
  {
    id: '7',
    title: 'Complete project report',
    description: 'Prepare the final version of the project report.',
    status: TaskStatus.TODO,
  },
  {
    id: '8',
    title: 'Fix website bugs',
    description: 'Debug and fix UI issues on the landing page.',
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: '9',
    title: 'Plan weekend trip',
    description: 'Search for locations and book a hotel.',
    status: TaskStatus.TODO,
  },
  {
    id: '10',
    title: 'Reply to emails',
    description: 'Check inbox and respond to important emails.',
    status: TaskStatus.DONE,
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    setTasks(() =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  }

  return (
    <div className="p-4">
      <div className="flex gap-8">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
