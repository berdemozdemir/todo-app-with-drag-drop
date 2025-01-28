import { TaskType } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type TaskCardProps = {
  task: TaskType;
  isOverlay?: boolean;
};

export function TaskCard({ task, isOverlay = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: task.id,
      data: {
        type: 'Task',
        task,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 200ms ease',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isOverlay ? 50 : 'auto',
    position: isOverlay ? 'fixed' : 'relative',
    width: '100%',
  } as const;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab touch-none rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
      style={style}
    >
      <h3 className="font-medium text-neutral-100">{task.title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
    </div>
  );
}
