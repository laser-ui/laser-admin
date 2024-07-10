import type { AppCopyProps } from './types';

import { Icon } from '@laser-ui/components';
import { useAsync } from '@laser-ui/hooks';
import { classNames, copy } from '@laser-ui/utils';
import CheckOutlined from '@material-design-icons/svg/outlined/check.svg?react';
import ContentCopyOutlined from '@material-design-icons/svg/outlined/content_copy.svg?react';
import { isNumber, isString } from 'lodash';
import { useState } from 'react';

export function AppCopy(props: AppCopyProps): JSX.Element | null {
  const {
    children,
    value,
    size,

    ...restProps
  } = props;

  const async = useAsync();

  const [copyed, setCopyed] = useState(false);

  let str: any = value ?? children;
  if (isNumber(str)) {
    str = str.toString();
  }

  if (!isString(str) || str.length === 0) {
    return children as any;
  }

  return (
    <div {...restProps} className={classNames(restProps.className, 'app-copy')}>
      {children}
      <Icon
        className={classNames('app-copy__icon', {
          'is-active': copyed,
        })}
        size={size}
        onClick={() => {
          if (!copyed) {
            copy(str);

            setCopyed(true);
            async.setTimeout(() => {
              setCopyed(false);
            }, 2000);
          }
        }}
      >
        {copyed ? <CheckOutlined /> : <ContentCopyOutlined />}
      </Icon>
    </div>
  );
}
