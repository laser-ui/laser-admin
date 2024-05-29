import type { AppCopyProps } from './types';

import { Icon } from '@laser-ui/components';
import { useAsync } from '@laser-ui/hooks';
import { classNames, copy } from '@laser-ui/utils';
import CheckOutlined from '@material-design-icons/svg/outlined/check.svg?react';
import ContentCopyOutlined from '@material-design-icons/svg/outlined/content_copy.svg?react';
import { useState } from 'react';

export function AppCopy(props: AppCopyProps): JSX.Element | null {
  const { children, value, size } = props;

  const async = useAsync();

  const [copyed, setCopyed] = useState(false);

  return (
    <div className="app-copy">
      {children}
      <Icon
        className={classNames('app-copy__icon', {
          'is-active': copyed,
        })}
        size={size}
        onClick={() => {
          if (!copyed) {
            copy(value ?? (children as string));

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
