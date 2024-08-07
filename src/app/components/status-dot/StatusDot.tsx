import type { AppStatusDotProps } from './types';

import { checkNodeExist, classNames } from '@laser-ui/utils';

export function AppStatusDot(props: AppStatusDotProps): JSX.Element | null {
  const {
    children,
    theme,
    color,
    size,
    wave = false,

    ...restProps
  } = props;

  return (
    <div
      {...restProps}
      className={classNames(restProps.className, 'app-status-dot', {
        [`t-${theme}`]: theme,
        'app-status-dot--wave': wave,
      })}
      style={{
        ...restProps.style,
        ...(color
          ? {
              [`--app-status-dot-color`]: color,
            }
          : {}),
      }}
    >
      <div
        className="app-status-dot__dot"
        style={{
          width: size,
          height: size,
        }}
      />
      {checkNodeExist(children) && <div className="app-status-dot__content">{children}</div>}
    </div>
  );
}
