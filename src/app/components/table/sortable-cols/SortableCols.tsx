import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import type { ReactNode } from 'react';

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Fragment, useState } from 'react';

import { DragHandle, SortableItem } from './SortableItem';
import { SortableOverlay } from './SortableOverlay';

interface SortableColsProps<T extends UniqueIdentifier> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T) => ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
}

export function SortableCols<T extends UniqueIdentifier>(props: SortableColsProps<T>) {
  const { items, onChange, renderItem, onDragStart, onDragEnd } = props;

  const [active, setActive] = useState<T | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e) => {
        onDragStart?.(e);

        const { active } = e;

        setActive(active.id as T);
      }}
      onDragEnd={(e) => {
        onDragEnd?.(e);

        const { active, over } = e;
        if (over && active.id !== over?.id) {
          const oldIndex = items.indexOf(active.id as T);
          const newIndex = items.indexOf(over.id as T);

          onChange(arrayMove(items, oldIndex, newIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        <ul className="app-table-sortable-cols" role="application">
          {items.map((item) => (
            <Fragment key={item}>{renderItem(item)}</Fragment>
          ))}
        </ul>
      </SortableContext>
      <SortableOverlay>{active ? renderItem(active) : null}</SortableOverlay>
    </DndContext>
  );
}

SortableCols.Item = SortableItem;
SortableCols.DragHandle = DragHandle;
