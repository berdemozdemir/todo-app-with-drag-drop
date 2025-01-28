import { ColumnType } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ColumnProps = {
  column: ColumnType;
};

export function Column({ column }: ColumnProps) {
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const combinedRef = (element: HTMLElement | null) => {
    setDroppableRef(element);
    setSortableRef(element);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={combinedRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex w-full flex-col rounded-lg bg-neutral-800 p-4 sm:w-80"
    >
      <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>

      <div className="flex flex-1 flex-col gap-4">
        <SortableContext items={column.tasks.map((task) => task.id)}>
          {column.tasks.length > 0 ? (
            column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <p className="text-neutral-400">No tasks yet!</p>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
