import type { DeviceData } from './types';
import type { ModalProps } from '@laser-ui/components/modal';
import type { SelectItem } from '@laser-ui/components/select/types';

import { useForm, FormGroup, FormControl, Validators, Modal, Form, FormGroupContext, Input, Select } from '@laser-ui/components';
import { useMount } from '@laser-ui/hooks';
import { isUndefined } from 'lodash';
import { useState } from 'react';

import { useHttp } from '../../../core';
import { handleStandardResponse } from '../../../utils';

export interface AppDeviceModalProps extends ModalProps {
  device: DeviceData | undefined;
  onSuccess: () => void;
}

export function AppDeviceModal(props: AppDeviceModalProps): React.ReactElement | null {
  const {
    device,
    onSuccess,

    ...restProps
  } = props;

  const http = useHttp();

  const [form] = useForm(() => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required),
      model: new FormControl<string | null>(null, Validators.required),
    });
    if (device) {
      form.reset({
        name: device.name,
        model: device.model,
      });
    }
    return form;
  });

  const [modelList, setModelList] = useState<SelectItem<string>[]>();

  useMount(() => {
    http<AppStandardResponse.List<AppDocs.DeviceModel>>({
      url: '/device/model',
      method: 'get',
    }).then((res) => {
      setModelList(
        res.resources.map((model) => ({
          label: model.name,
          value: model.name,
          disabled: model.disabled,
        })),
      );
    });
  });

  return (
    <Modal
      {...restProps}
      header={`${device ? 'Edit' : 'Add'} Device`}
      footer={
        <Modal.Footer
          okProps={{ disabled: !form.valid }}
          onOkClick={() =>
            new Promise((r) => {
              http({
                url: '/device' + (device ? `/${device.id}` : ''),
                method: device ? 'patch' : 'post',
                data: form.value,
              }).then((res) => {
                handleStandardResponse(res, {
                  success: () => {
                    onSuccess();
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
          <Form.Item formControls={{ name: 'Please enter name!' }} label="Name">
            {({ name }) => <Input formControl={name} style={{ width: '100%' }} placeholder="Name" />}
          </Form.Item>
          <Form.Item formControls={{ model: 'Please select model!' }} label="Model">
            {({ model }) => (
              <Select
                formControl={model}
                style={{ width: '100%' }}
                list={modelList ?? []}
                placeholder="Model"
                loading={isUndefined(modelList)}
                clearable
              />
            )}
          </Form.Item>
        </FormGroupContext.Provider>
      </Form>
    </Modal>
  );
}
