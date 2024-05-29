import { Checkbox, Icon } from '@laser-ui/components';
import { classNames } from '@laser-ui/utils';
import DragIndicatorOutlined from '@material-design-icons/svg/outlined/drag_indicator.svg?react';
import { forwardRef } from 'react';

interface ColConfigItemProps extends React.HTMLAttributes<HTMLDivElement> {
  hidden: boolean;
  disabled: boolean;
  listeners?: any;
  onHiddenChange: (hidden: boolean) => void;
}

export const ColConfigItem = forwardRef<HTMLDivElement, ColConfigItemProps>((props, ref): JSX.Element | null => {
  const {
    children,
    hidden,
    disabled,
    listeners,
    onHiddenChange,

    ...restProps
  } = props;

  return (
    <div {...restProps} ref={ref} className={classNames(restProps.className, 'app-table__col-config-item')}>
      <Icon {...listeners}>
        <DragIndicatorOutlined />
      </Icon>
      <Checkbox
        className="ms-1"
        model={!hidden}
        disabled={disabled}
        onModelChange={(checked) => {
          onHiddenChange(!checked);
        }}
      >
        {children}
      </Checkbox>
    </div>
  );
});
