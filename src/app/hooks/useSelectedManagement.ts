import { useEventCallback, useIsomorphicLayoutEffect } from '@laser-ui/hooks';
import { useState } from 'react';

function checkSelectAll(selectedLength: number, allLength: number) {
  return selectedLength === 0 ? false : selectedLength === allLength ? true : 'mixed';
}

export function useSelectedManagement<K = any>(data: any, getAllIds: () => K[]) {
  const [management, setManagement] = useState<{ ids: K[]; all: boolean | 'mixed' }>({ ids: [], all: false });

  useIsomorphicLayoutEffect(() => {
    if (data) {
      setManagement((prev) => {
        const allIds = getAllIds();
        const cleaned = prev.ids.filter((id) => allIds.includes(id));

        if (cleaned.length !== prev.ids.length) {
          return { ids: cleaned, all: checkSelectAll(cleaned.length, allIds.length) };
        }
        return prev;
      });
    }
  }, [data]);

  const select = useEventCallback((id: K) => {
    setManagement((prev) => {
      const newIds = prev.ids.includes(id) ? prev.ids.filter((itemId) => itemId !== id) : [id].concat(prev.ids);
      return { ids: newIds, all: checkSelectAll(newIds.length, getAllIds().length) };
    });
  });

  const selectAll = useEventCallback(() => {
    setManagement((prev) => {
      const allIds = getAllIds();
      const newIds = prev.ids.length === allIds.length ? [] : allIds;
      return { ids: newIds, all: checkSelectAll(newIds.length, allIds.length) };
    });
  });

  return {
    ids: management.ids,
    all: management.all,
    select,
    selectAll,
  };
}
