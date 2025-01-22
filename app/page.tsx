'use client';

import { Column } from '@/components/Column';
import { ColumnType, Task, TaskStatus } from '@/lib/types';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import React, { useState } from 'react';
import { TaskCard } from '@/components/TaskCard';

const COLUMNS: ColumnType[] = [
  { id: TaskStatus.TODO, title: 'To do' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
  { id: TaskStatus.DONE, title: 'Done' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Learn React',
    description: 'Learn React basics.',
    status: TaskStatus.TODO,
  },
  {
    id: '2',
    title: 'Wash the car',
    description: 'Wash the car at 5 PM.',
    status: TaskStatus.TODO,
  },
  {
    id: '3',
    title: 'Buy groceries',
    description: 'Buy milk and bread.',
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: '4',
    title: 'Reply to emails',
    description: 'Check email inbox.',
    status: TaskStatus.DONE,
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [columns, setColumns] = useState<ColumnType[]>(COLUMNS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const draggedTask = tasks.find((task) => task.id === active.id);
    if (draggedTask) {
      setActiveTask(draggedTask);
      return;
    }

    const draggedColumn = columns.find((column) => column.id === active.id);
    if (draggedColumn) {
      setActiveColumn(draggedColumn);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    setActiveColumn(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    if (Object.values(TaskStatus).includes(taskId as TaskStatus)) {
      handleColumnDragEnd(event);
      return;
    }

    const draggedTask = tasks.find((task) => task.id === taskId);
    if (!draggedTask) return;

    const oldColumnId = draggedTask.status;
    const newColumnId = Object.values(TaskStatus).includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : draggedTask.status;

    if (oldColumnId !== newColumnId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newColumnId } : task,
        ),
      );
    } else {
      const columnTasks = tasks.filter((task) => task.status === newColumnId);
      const oldIndex = columnTasks.findIndex((task) => task.id === taskId);
      const newIndex = columnTasks.findIndex((task) => task.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        if (oldIndex === newIndex) return;
        const sortedTasks = arrayMove(columnTasks, oldIndex, newIndex);
        setTasks((prevTasks) =>
          prevTasks
            .filter((task) => task.status !== newColumnId)
            .concat(sortedTasks),
        );
      }
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((task) => task.id === activeId);
    const overTask = tasks.find((task) => task.id === overId);

    if (!activeTask) return;

    const oldColumnId = activeTask.status;
    const newColumnId = overTask ? overTask.status : (overId as TaskStatus);

    if (oldColumnId !== newColumnId) {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.id !== activeId);
        const targetIndex = overTask
          ? prevTasks.findIndex((task) => task.id === overId)
          : -1;

        return [
          ...updatedTasks.slice(0, targetIndex),
          { ...activeTask, status: newColumnId },
          ...updatedTasks.slice(targetIndex),
        ];
      });
    }
  }

  function handleColumnDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = columns.findIndex((col) => col.id === active.id);
    const newIndex = columns.findIndex((col) => col.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      setColumns(arrayMove(columns, oldIndex, newIndex));
    }
  }

  return (
    <div className="p-10">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext items={columns.map((column) => column.id)}>
          <div className="flex gap-8">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}

          {activeColumn ? (
            <Column
              column={activeColumn}
              tasks={tasks.filter((task) => task.status === activeColumn.id)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
