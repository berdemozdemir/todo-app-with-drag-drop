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

const INITIAL_TASKS: Task[] = [
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
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // for mobile
  const sensors = useSensors(
    // distance means you need to move the “Task” by at least 5 pixels to make a drag
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const draggedTask = tasks.find((task) => task.id === active.id);
    setActiveTask(draggedTask || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

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
    const activeId = active.id as string;
    const overId = over?.id as string;

    const activeTask = tasks.find((task) => task.id === activeId);
    const overTask = tasks.find((task) => task.id === overId);

    if (!activeTask || !overTask) return;

    const oldColumnId = activeTask.status;
    const newColumnId = overTask.status;

    if (oldColumnId !== newColumnId) {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.id !== activeId);
        const targetIndex = prevTasks.findIndex((task) => task.id === overId);

        return [
          ...updatedTasks.slice(0, targetIndex),
          { ...activeTask, status: newColumnId },
          ...updatedTasks.slice(targetIndex),
        ];
      });
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
        <SortableContext items={tasks.map((task) => task.id)}>
          <div className="flex gap-8">
            {COLUMNS.map((column) => (
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
        </DragOverlay>
      </DndContext>
    </div>
  );
}
