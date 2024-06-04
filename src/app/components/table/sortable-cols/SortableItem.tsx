import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import type { CSSProperties } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@laser-ui/components';
import DragIndicatorOutlined from '@material-design-icons/svg/outlined/drag_indicator.svg?react';
import { createContext, useContext, useMemo } from 'react';

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
  ref() {},
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
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li className="app-table-sortable-cols__item" ref={setNodeRef} style={style}>
        {children}
      </li>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <div className="app-table-sortable-cols__drag-indicator" {...attributes} {...listeners} ref={ref}>
      <Icon>
        <DragIndicatorOutlined />
      </Icon>
    </div>
  );
}
