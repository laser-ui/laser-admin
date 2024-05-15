import { Validators } from '@laser-ui/components';

export function checkEmpty(value: any) {
  const required = Validators.required({ value } as any);
  return required ? true : false;
}
