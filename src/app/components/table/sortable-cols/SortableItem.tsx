import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@laser-ui/components';
import DragIndicatorOutlined from '@material-design-icons/svg/outlined/drag_indicator.svg?react';
import { createContext, use, useMemo } from 'react';

interface SortableItemProps {
  children: React.ReactNode;
  id: UniqueIdentifier;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref: (node: HTMLElement | null) => void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ref: () => {},
});

export function SortableItem(props: SortableItemProps) {
  const { children, id } = props;

  const { attributes, isDragging, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li
        className="app-table-sortable-cols__item"
        ref={(instance) => {
          setNodeRef(instance);
          return () => {
            setNodeRef(null);
          };
        }}
        style={style}
      >
        {children}
      </li>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = use(SortableItemContext);

  return (
    <div
      className="app-table-sortable-cols__drag-indicator"
      {...attributes}
      {...listeners}
      ref={(instance) => {
        ref(instance);
        return () => {
          ref(null);
        };
      }}
    >
      <Icon>
        <DragIndicatorOutlined />
      </Icon>
    </div>
  );
}
