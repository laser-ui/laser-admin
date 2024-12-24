import { useIsomorphicLayoutEffect } from '@laser-ui/hooks';
import { useCallback, useSyncExternalStore } from 'react';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

let mediaQueryList = {
  up: {
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false,
  },
  down: {
    sm: true,
    md: true,
    lg: true,
    xl: true,
    '2xl': true,
  },
};

let listeners: (() => void)[] = [];
function subscribe(onChange: () => void) {
  listeners = listeners.concat([onChange]);
  return () => {
    listeners = listeners.filter((f) => f !== onChange);
  };
}
function getSnapshot() {
  return mediaQueryList;
}
function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

let createMediaQueryList = () => {
  if (window) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    createMediaQueryList = () => {};
    Object.entries(breakpoints).forEach(([breakpoint, width]) => {
      ['up', 'down'].forEach((key) => {
        const mql = window.matchMedia(`(${key === 'up' ? 'min' : 'max'}-width: ${key === 'up' ? width : width - 0.02}px)`);
        const update = () => {
          (mediaQueryList as any)[key][breakpoint] = mql.matches;
          mediaQueryList = Object.assign({}, mediaQueryList);
          emitChange();
        };
        update();
        mql.addEventListener('change', update);
      });
    });
  }
};
createMediaQueryList();

export function useMatchMedia() {
  const mediaQueryList = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useIsomorphicLayoutEffect(() => {
    createMediaQueryList();
  }, []);

  const mediaBreakpointUp = useCallback(
    (breakpoint: keyof typeof breakpoints) => {
      return mediaQueryList.up[breakpoint];
    },
    [mediaQueryList],
  );
  const mediaBreakpointDown = useCallback(
    (breakpoint: keyof typeof breakpoints) => {
      return mediaQueryList.down[breakpoint];
    },
    [mediaQueryList],
  );

  return { mediaBreakpointUp, mediaBreakpointDown };
}
