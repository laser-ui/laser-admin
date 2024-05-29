import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ColConfigItem } from './ColConfigItem';

interface SortableColConfigItemProps {
  id: string;
  text: string;
  hidden: boolean;
  disabled: boolean;
  onHiddenChange: (hidden: boolean) => void;
}

export function SortableColConfigItem(props: SortableColConfigItemProps) {
  const { id, text, hidden, disabled, onHiddenChange } = props;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <ColConfigItem
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        visibility: isDragging ? 'hidden' : undefined,
      }}
      {...attributes}
      hidden={hidden}
      disabled={disabled}
      listeners={listeners}
      onHiddenChange={onHiddenChange}
    >
      {text}
    </ColConfigItem>
  );
}
