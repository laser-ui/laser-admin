import type { DropAnimation } from '@dnd-kit/core';

import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

interface SortableOverlayProps {
  children: React.ReactNode;
}

export function SortableOverlay(props: SortableOverlayProps) {
  return <DragOverlay dropAnimation={dropAnimationConfig}>{props.children}</DragOverlay>;
}
