import type { AppDetailViewProps } from './types';

import { useIsomorphicLayoutEffect } from '@laser-ui/hooks';
import { classNames } from '@laser-ui/utils';
import { isArray, isNull, isNumber, isString, isUndefined } from 'lodash';
import { useRef } from 'react';

export function AppDetailView(props: AppDetailViewProps): React.ReactElement | null {
  const {
    list,
    col: _col = { xs: 12, md: 6, lg: 4, '2xl': 3 },
    gutter,
    labelAlign = 'left',
    labelWidth = 'auto',
    empty = '-',
    vertical = false,

    ...restProps
  } = props;

  const detailViewRef = useRef<HTMLDivElement>(null);

  const [gutterY, gutterX] = isArray(gutter) ? gutter : [gutter, gutter];
  const col = (() => {
    if (_col === true) {
      return 'col';
    }
    if (isNumber(_col)) {
      return `col-${_col}`;
    }

    const classNames: string[] = [];
    Object.entries(_col).forEach(([breakpoint, col]) => {
      const className: (string | number)[] = ['col'];
      if (breakpoint !== 'xs') {
        className.push(breakpoint);
      }
      if (col !== true) {
        className.push(col);
      }
      classNames.push(className.join('-'));
    });
    return classNames.join(' ');
  })();

  useIsomorphicLayoutEffect(() => {
    if (detailViewRef.current) {
      let maxWidth = 0;
      detailViewRef.current.querySelectorAll('[data-app-detail-view-label]').forEach((el) => {
        maxWidth = Math.max((el as HTMLElement).offsetWidth, maxWidth);
      });
      detailViewRef.current.style.setProperty('--label-width', `${maxWidth}px`);
    }
  });

  return (
    <div
      {...restProps}
      ref={(instance) => {
        detailViewRef.current = instance;
        return () => {
          detailViewRef.current = null;
        };
      }}
      className={classNames(restProps.className, 'app-detail-view', 'row', {
        'app-detail-view--vertical': vertical,
      })}
      style={
        Object.assign(
          isNumber(gutterX) ? { '--gutter-x': gutterX * 0.25 + 'rem' } : {},
          isNumber(gutterY) ? { '--gutter-y': gutterY * 0.25 + 'rem' } : {},
        ) as any
      }
    >
      {list.map(({ label, content: _content, isEmpty: _isEmpty, center }, index) => {
        const isEmpty = isUndefined(_isEmpty)
          ? (isString(_content) && _content.length === 0) || isUndefined(_content) || isNull(_content)
          : _isEmpty;
        const content = isEmpty ? empty : _content;

        return (
          <div
            key={label || index}
            className={classNames('app-detail-view__item', col, {
              'app-detail-view__item--center': !vertical && center,
            })}
          >
            <div
              className="app-detail-view__item-label-wrapper"
              style={{
                width: vertical ? undefined : labelWidth === 'auto' ? 'var(--label-width)' : labelWidth,
                textAlign: labelAlign,
              }}
            >
              <div
                className={classNames('app-detail-view__item-label', {
                  'app-detail-view__item-label--colon': !vertical && label,
                })}
                data-app-detail-view-label
              >
                {label}
              </div>
            </div>
            <div className="app-detail-view__item-content">{content}</div>
          </div>
        );
      })}
    </div>
  );
}
