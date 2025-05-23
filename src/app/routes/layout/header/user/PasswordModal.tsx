import type { ModalProps } from '@laser-ui/components/modal';

import { Form, FormControl, FormGroup, FormGroupContext, Input, Modal, Validators, useForm } from '@laser-ui/components';
import { useStore } from 'rcl-store';
import { useTranslation } from 'react-i18next';

import { GlobalStore, useHttp } from '../../../../core';
import { handleStandardResponse } from '../../../../utils';

export function AppPasswordModal(props: ModalProps): React.ReactElement | null {
  const [{ appUser }] = useStore(GlobalStore, ['appUser']);
  const { t } = useTranslation();
  const http = useHttp();

  const [form] = useForm(
    () =>
      new FormGroup({
        password: new FormControl('', Validators.required),
      }),
  );

  return (
    <Modal
      {...props}
      header={t('routes.layout.Change password')}
      footer={
        <Modal.Footer
          okProps={{ disabled: !form.valid }}
          onOkClick={() =>
            new Promise((r) => {
              const data: any = {
                password: form.get('password').value,
              };
              http({
                url: `/user/${appUser.id}`,
                method: 'patch',
                data,
              }).then((res) => {
                handleStandardResponse(res, {
                  success: () => {
                    r(true);
                  },
                  error: () => {
                    r(false);
                  },
                });
              });
            })
          }
        />
      }
      maskClosable={false}
    >
      <Form vertical>
        <FormGroupContext.Provider value={form}>
          <Form.Item formControls={{ password: t('routes.layout.Please enter a new password') }} label={t('routes.layout.New password')}>
            {({ password }) => <Input formControl={password} className="w-full" />}
          </Form.Item>
        </FormGroupContext.Provider>
      </Form>
    </Modal>
  );
}
