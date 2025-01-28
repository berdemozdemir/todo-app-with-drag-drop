'use client';

import { Column } from '@/components/Column';
import { ColumnType, TaskType } from '@/lib/types';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import React, { useState } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { useGetColumnQuery, useUpdateColumnsMutation } from '@/lib/services';

export default function Home() {
  const { data, isLoading, isError } = useGetColumnQuery();
  const updateColumnsMutation = useUpdateColumnsMutation();

  const columns = Array.isArray(data) ? data : [];

  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task);
    } else if (active.data.current?.type === 'Column') {
      setActiveColumn(active.data.current.column);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || !columns) return;

    const activeId = active.id;
    const overId = over.id;

    let updatedColumns: typeof columns = JSON.parse(JSON.stringify(columns));

    const activeColumnIndex = updatedColumns.findIndex((col) =>
      col.tasks.some((task) => task.id === activeId),
    );

    const overColumnIndex = updatedColumns.findIndex(
      (col) =>
        col.id === overId || col.tasks.some((task) => task.id === overId),
    );

    if (activeColumnIndex === -1 || overColumnIndex === -1) return;

    const activeTask = updatedColumns[activeColumnIndex].tasks.find(
      (task) => task.id === activeId,
    );

    if (!activeTask) return;

    if (activeColumnIndex === overColumnIndex) {
      const overTaskIndex = updatedColumns[overColumnIndex].tasks.findIndex(
        (task) => task.id === overId,
      );

      const activeTaskIndex = updatedColumns[activeColumnIndex].tasks.findIndex(
        (task) => task.id === activeId,
      );

      if (activeTaskIndex === overTaskIndex) return; // 🔹 Sonsuz döngüyü önle

      updatedColumns[overColumnIndex].tasks = arrayMove(
        updatedColumns[overColumnIndex].tasks,
        activeTaskIndex,
        overTaskIndex,
      );
    } else {
      updatedColumns[activeColumnIndex].tasks = updatedColumns[
        activeColumnIndex
      ].tasks.filter((t) => t.id !== activeId);

      const overTaskIndex = updatedColumns[overColumnIndex].tasks.findIndex(
        (task) => task.id === overId,
      );

      if (overTaskIndex !== -1) {
        updatedColumns[overColumnIndex].tasks.splice(
          overTaskIndex,
          0,
          activeTask,
        );
      } else {
        updatedColumns[overColumnIndex].tasks.push(activeTask);
      }
    }

    updatedColumns[overColumnIndex].tasks = updatedColumns[
      overColumnIndex
    ].tasks.map((task, index) => ({ ...task, order: index + 1 }));

    const prevColumns = JSON.stringify(columns);
    const newColumns = JSON.stringify(updatedColumns);

    if (prevColumns !== newColumns) {
      updateColumnsMutation.mutate(updatedColumns);
    }
  }

  function handleDragColumnEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const updatedColumns: typeof columns = JSON.parse(JSON.stringify(columns));

    const oldColumnIndex = updatedColumns.findIndex(
      (column) => column.id === activeId,
    );

    const NewColumnIndex = updatedColumns.findIndex(
      (column) => column.id === overId,
    );

    if (oldColumnIndex !== -1 && NewColumnIndex !== -1) {
      const newColumns = arrayMove(columns, oldColumnIndex, NewColumnIndex).map(
        (col, index) => ({ ...col, order: index + 1 }),
      );

      updateColumnsMutation.mutate(newColumns);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveTask(null);
    setActiveColumn(null);

    if (!over || !columns) return;

    const activeId = active.id;
    const overId = over.id;

    if (active.data.current?.type === 'Column') {
      handleDragColumnEnd(event);
      return;
    }

    if (active.data.current?.type === 'Task') {
      const activeColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === activeId),
      );

      if (!activeColumn) return;

      let overColumn: ColumnType | undefined;
      let overTask: TaskType | undefined;

      if (over.data.current?.type === 'Column') {
        overColumn = columns.find((col) => col.id === overId);
      } else {
        overColumn = columns.find((col) =>
          col.tasks.some((task) => task.id === overId),
        );
        overTask = overColumn?.tasks.find((task) => task.id === overId);
      }

      if (!overColumn) return;

      let updatedColumns: typeof columns = JSON.parse(JSON.stringify(columns));

      if (activeColumn.id === overColumn.id) {
        if (!overTask) return;

        const activeColumnIndex = updatedColumns.findIndex(
          (d) => d.id === activeColumn.id,
        );

        const activeTaskIndex = updatedColumns[
          activeColumnIndex
        ].tasks.findIndex((d) => d.id === activeId);

        const overTaskIndex = overColumn.tasks.indexOf(overTask);

        const activeTask = {
          ...updatedColumns[activeColumnIndex].tasks[activeTaskIndex],
        };

        updatedColumns[activeColumnIndex].tasks.splice(activeTaskIndex, 1);
        updatedColumns[activeColumnIndex].tasks.splice(
          overTaskIndex,
          0,
          activeTask,
        );

        updatedColumns = updatedColumns.map((d, i) => ({
          ...d,
          order: i + 1,
          tasks: d.tasks.map((task, taskIndex) => ({
            ...task,
            order: taskIndex + 1,
          })),
        }));

        updateColumnsMutation.mutate(updatedColumns);
      } else {
        const activeColumnIndex = updatedColumns.findIndex(
          (column) => column.id === activeColumn.id,
        );

        if (activeColumnIndex === -1) return;

        const activeTaskIndex = updatedColumns[
          activeColumnIndex
        ].tasks.findIndex((task) => task.id === activeId);

        if (activeTaskIndex === -1) return;

        const activeTask =
          updatedColumns[activeColumnIndex].tasks[activeTaskIndex];

        updatedColumns[activeColumnIndex].tasks.splice(activeTaskIndex, 1);

        const overColumnIndex = updatedColumns.findIndex(
          (d) => d.id === overColumn?.id,
        );

        if (overColumnIndex === -1) return;

        updatedColumns[overColumnIndex].tasks.push(activeTask);

        updatedColumns[overColumnIndex].tasks = updatedColumns[
          overColumnIndex
        ].tasks.map((task, taskIndex) => ({ ...task, order: taskIndex + 1 }));

        updateColumnsMutation.mutate(updatedColumns);
      }
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  if (!columns || columns.length === 0) return <div>No Columns yet!</div>;

  return (
    <div className="p-10">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={columns.map((column) => column.id)}>
          <div className="flex gap-8">
            {columns.map((column) => (
              <Column key={column.id} column={column} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
          {activeColumn ? <Column column={activeColumn} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
