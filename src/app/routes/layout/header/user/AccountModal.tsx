import type { ModalProps } from '@laser-ui/components/modal';
import type { UploadFile } from '@laser-ui/components/upload/types';

import { Form, FormControl, FormGroup, FormGroupContext, Input, Modal, Upload, Validators, useForm } from '@laser-ui/components';
import { useStore } from 'rcl-store';
import { useTranslation } from 'react-i18next';

import { GlobalStore, useHttp } from '../../../../core';
import { handleStandardResponse } from '../../../../utils';

export function AppAccountModal(props: ModalProps): JSX.Element | null {
  const [{ appUser }, { appUser: setAppUser }] = useStore(GlobalStore, ['appUser']);
  const { t } = useTranslation();
  const http = useHttp();

  const [form] = useForm(
    () =>
      new FormGroup({
        name: new FormControl(appUser.name, Validators.required),
        avatar: new FormControl<UploadFile[]>(
          appUser.avatar
            ? [
                {
                  uid: appUser.avatar.id,
                  name: t('Avatar'),
                  state: 'load',
                  url: appUser.avatar.path,
                  thumbUrl: appUser.avatar.path,
                },
              ]
            : [],
        ),
      }),
  );

  return (
    <Modal
      {...props}
      header={t('routes.layout.Account Settings')}
      footer={
        <Modal.Footer
          okProps={{ disabled: !form.valid }}
          onOkClick={() =>
            new Promise((r) => {
              const avatar = form.get('avatar').value[0];
              const data: any = {
                name: form.get('name').value,
              };
              if (avatar) {
                data.avatar = avatar.uid;
              } else {
                data.$unset = { avatar: '' };
              }
              http({
                url: `/user/${appUser.id}`,
                method: 'patch',
                data,
              }).then((res) => {
                handleStandardResponse(res, {
                  success: () => {
                    setAppUser((draft) => {
                      draft.name = form.get('name').value;
                      draft.avatar = avatar
                        ? ({
                            id: avatar.uid,
                            name: avatar.name,
                            path: avatar.url,
                          } as any)
                        : null;
                    });
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
          <Form.Item formControls={{ name: t('routes.layout.Please enter a name') }} label={t('routes.layout.Name')}>
            {({ name }) => <Input formControl={name} style={{ width: '100%' }} />}
          </Form.Item>
          <Form.Item formControls={{ avatar: '' }} label={t('Avatar')}>
            {({ avatar }) => (
              <Upload formControl={avatar} accept="image/*" max={1}>
                {(render) => (
                  <Upload.Picture actions={() => [<Upload.Action preset="remove" />]}>{render(<Upload.Button />)}</Upload.Picture>
                )}
              </Upload>
            )}
          </Form.Item>
        </FormGroupContext.Provider>
      </Form>
    </Modal>
  );
}
