import type { DeviceData } from './types';
import type { ModalProps } from '@laser-ui/components/modal';

import { useForm, FormGroup, FormControl, Validators, Modal, Form, FormGroupContext, Input, Select } from '@laser-ui/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '../../../core';
import { DEVICES_QUERY_KEYS } from '../../../queries/device';
import { useDeviceModelsQuery } from '../../../queries/device-model';
import { handleStandardResponse } from '../../../utils';

export interface AppDeviceModalProps extends ModalProps {
  device: DeviceData | undefined;
}

export function AppDeviceModal(props: AppDeviceModalProps): React.ReactElement | null {
  const {
    device,

    ...restProps
  } = props;

  const axios = useAxios();

  const queryClient = useQueryClient();
  const { deviceModelsQuery } = useDeviceModelsQuery();
  const deviceMutation = useMutation({
    mutationFn: (variables: any) =>
      axios<AppStandardResponse.Action<AppDocs.Device>>({
        url: '/devices' + (device ? `/${device.id}` : ''),
        method: device ? 'patch' : 'post',
        data: variables,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEYS.all });
    },
  });

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

  return (
    <Modal
      {...restProps}
      header={`${device ? 'Edit' : 'Add'} Device`}
      footer={
        <Modal.Footer
          okProps={{ disabled: !form.valid }}
          onOkClick={() =>
            new Promise((r) => {
              deviceMutation.mutate(form.value, {
                onSuccess: (res) => {
                  handleStandardResponse(res, {
                    success: () => {
                      r(true);
                    },
                    error: () => {
                      r(false);
                    },
                  });
                },
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
            {({ name }) => <Input formControl={name} className="w-full" placeholder="Name" />}
          </Form.Item>
          <Form.Item formControls={{ model: 'Please select model!' }} label="Model">
            {({ model }) => (
              <Select
                formControl={model}
                className="w-full"
                list={
                  deviceModelsQuery.isSuccess
                    ? deviceModelsQuery.data.resources.map((model) => ({
                        label: model.name,
                        value: model.name,
                        disabled: model.disabled,
                      }))
                    : []
                }
                placeholder="Model"
                loading={deviceModelsQuery.isPending}
                clearable
              />
            )}
          </Form.Item>
        </FormGroupContext.Provider>
      </Form>
    </Modal>
  );
}
