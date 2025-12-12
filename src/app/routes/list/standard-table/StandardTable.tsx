import type { DeviceData } from './types';
import type { DeviceQueryParams } from '../../../queries/device';

import { useQueryParams } from '@laser-pro/router';
import { Button, Card, Checkbox, DialogService, Dropdown, Icon, Modal, Pagination, Select, Spinner } from '@laser-ui/components';
import { useImmer } from '@laser-ui/hooks';
import AddOutlined from '@material-design-icons/svg/outlined/add.svg?react';
import KeyboardArrowDownOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_down.svg?react';
import { keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { pick } from 'lodash';
import { useTranslation } from 'react-i18next';

import { AppDeviceModal } from './DeviceModal';
import { AppRouteHeader, AppStatusDot, AppTable, AppTableFilter } from '../../../components';
import { useAxios } from '../../../core';
import { DEVICES_QUERY_KEYS, useDevicesQuery } from '../../../queries/device';
import { useDeviceModelsQuery } from '../../../queries/device-model';
import { handleStandardResponse } from '../../../utils';

import styles from './StandardTable.module.scss';

const QUERY: DeviceQueryParams = {
  keyword: '',
  model: [],
  status: [],
  page: 1,
  pageSize: 10,
};

export default function StandardTable() {
  const { t } = useTranslation();
  const axios = useAxios();

  const queryParams = useQueryParams<DeviceQueryParams>(QUERY);
  const queryClient = useQueryClient();
  const { deviceModelsQuery } = useDeviceModelsQuery();
  const { devicesQuery } = useDevicesQuery(queryParams.saved, {}, { placeholderData: keepPreviousData });
  const deviceDeleteMutation = useMutation({
    mutationFn: (variables: any) =>
      axios({
        url: `/devices/${variables.id}`,
        method: 'delete',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEYS.all });
    },
  });

  const [selected, setSelected] = useImmer(new Set<number>());
  const allSelected = devicesQuery.isSuccess
    ? selected.size === 0
      ? false
      : selected.size === devicesQuery.data.resources.length
        ? true
        : 'mixed'
    : false;

  const openDeviceModal = (device?: DeviceData) => {
    DialogService.open(AppDeviceModal, {
      device,
    });
  };

  return (
    <>
      <AppRouteHeader>
        <AppRouteHeader.Breadcrumb
          list={[
            { id: '/list', title: t('List', { ns: 'title' }) },
            { id: '/list/standard-table', title: t('Standard table', { ns: 'title' }) },
          ]}
        />
        <AppRouteHeader.Header
          actions={[
            <Button
              icon={
                <Icon>
                  <AddOutlined />
                </Icon>
              }
              onClick={() => {
                openDeviceModal();
              }}
            >
              {t('Add')}
            </Button>,
          ]}
        />
      </AppRouteHeader>
      <div className={styles['app-standard-table']}>
        <Card className="mb-4">
          <Card.Content>
            <AppTableFilter
              filterList={[
                {
                  label: 'Status',
                  node: (
                    <Checkbox.Group
                      list={[0, 1, 2].map((n) => ({
                        label: n === 0 ? 'Normal' : n === 1 ? 'Failure' : 'Alarm',
                        value: n,
                      }))}
                      model={queryParams.value.status}
                      onModelChange={(value) => {
                        queryParams.update({ status: value });
                      }}
                    >
                      {(groupProps, optionProps, options) => (
                        <div {...groupProps} className="row g-2">
                          {options.map((opt) => (
                            <div key={opt.value} className="col-auto">
                              <Checkbox {...optionProps(opt)} />
                            </div>
                          ))}
                        </div>
                      )}
                    </Checkbox.Group>
                  ),
                  value: queryParams.value.status,
                },
                {
                  label: 'Model',
                  node: (
                    <Select
                      className="w-64 max-w-full"
                      list={
                        deviceModelsQuery.isSuccess
                          ? deviceModelsQuery.data.resources.map((model) => ({
                              label: model.name,
                              value: model.name,
                              disabled: model.disabled,
                            }))
                          : []
                      }
                      model={queryParams.value.model}
                      placeholder="Model"
                      loading={deviceModelsQuery.isPending}
                      multiple
                      clearable
                      onModelChange={(value) => {
                        queryParams.update({ model: value });
                      }}
                    />
                  ),
                  value: queryParams.value.model,
                },
              ]}
              searchValue={queryParams.value.keyword}
              searchPlaceholder="ID, Name"
              onSearchValueChange={(value) => {
                queryParams.update({ keyword: value });
              }}
              onSearchClick={() => {
                queryParams.update({ page: 1 }).saveToUrl();
                setSelected(new Set<number>());
              }}
              onResetClick={(change) => {
                if (change) {
                  queryParams.update({ page: 1, pageSize: queryParams.value.pageSize }, true).saveToUrl();
                  setSelected(new Set<number>());
                } else {
                  queryParams.update(pick(queryParams.value, ['page', 'pageSize']), true);
                }
              }}
            />
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Spinner visible={devicesQuery.isFetching}></Spinner>
            <AppTable
              list={devicesQuery.isSuccess ? devicesQuery.data.resources : []}
              columns={[
                {
                  th: 'NAME',
                  td: 'name',
                  asTitle: true,
                  copyable: true,
                },
                {
                  th: 'MODEL',
                  td: 'model',
                },
                {
                  th: 'PRICE',
                  td: 'price',
                },
                {
                  th: 'STATUS',
                  td: (data) => (
                    <AppStatusDot theme={data.status === 0 ? 'success' : data.status === 1 ? 'warning' : 'danger'} wave={data.status === 2}>
                      {data.status === 0 ? 'Normal' : data.status === 1 ? 'Failure' : 'Alarm'}
                    </AppStatusDot>
                  ),
                  nowrap: true,
                },
                {
                  th: 'CREATE TIME',
                  td: (data) => new Date(data.create_time).toLocaleString(),
                },
              ]}
              selectable={{
                all: allSelected,
                onAllChange: (checked) => {
                  if (devicesQuery.isSuccess) {
                    setSelected(new Set(checked ? devicesQuery.data.resources.map((data) => data.id) : []));
                  }
                },
                item: (data) => ({
                  checked: selected.has(data.id),
                  onChange: (checked) => {
                    setSelected((draft) => {
                      if (checked) {
                        draft.add(data.id);
                      } else {
                        draft.delete(data.id);
                      }
                    });
                  },
                }),
              }}
              actionOpts={{
                actions: (data) => [
                  { text: 'View', link: `/list/standard-table/${data.id}` },
                  {
                    text: 'Edit',
                    onclick: () => {
                      openDeviceModal(data);
                    },
                  },
                  {
                    text: 'Delete',
                    onclick: () => {
                      DialogService.open(Modal, {
                        alert: (
                          <Modal.Alert type="warning" title="Delete Device">
                            Are you sure you want to delete this?
                          </Modal.Alert>
                        ),
                        footer: (
                          <Modal.Footer
                            onOkClick={() =>
                              new Promise((r) => {
                                deviceDeleteMutation.mutate(data, {
                                  onSuccess: (res) => {
                                    handleStandardResponse(res, {
                                      success: () => {
                                        setSelected((draft) => {
                                          draft.delete(data.id);
                                        });
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
                        ),
                        maskClosable: false,
                      });
                    },
                  },
                ],
                width: 140,
              }}
              scroll={{ x: 1200 }}
              onRefresh={() => {
                devicesQuery.refetch();
              }}
            />
            <div className="app-table-footer">
              <div>
                <Button className="me-2" pattern="secondary" disabled={allSelected === false}>
                  Download
                </Button>
                <Dropdown
                  list={[
                    { id: 1, title: 'Action 1', type: 'item' },
                    { id: 2, title: 'Action 2', type: 'item' },
                  ]}
                  placement="bottom-right"
                >
                  {(dropdownProps) => (
                    <Button
                      {...dropdownProps}
                      pattern="secondary"
                      icon={
                        <Icon>
                          <KeyboardArrowDownOutlined />
                        </Icon>
                      }
                      iconRight
                      disabled={allSelected === false}
                    >
                      More
                    </Button>
                  )}
                </Dropdown>
              </div>
              <Pagination
                total={devicesQuery.isSuccess ? devicesQuery.data.metadata.total_size : 0}
                active={queryParams.value.page}
                pageSize={queryParams.value.pageSize}
                compose={['total', 'pages', 'page-size', 'jump']}
                onChange={(page, pageSize) => {
                  queryParams.update({ page, pageSize }).saveToUrl();
                  setSelected(new Set<number>());
                }}
              />
            </div>
          </Card.Content>
        </Card>
      </div>
    </>
  );
}
