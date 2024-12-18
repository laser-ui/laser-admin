import type { DeviceData } from './types';
import type { SelectItem } from '@laser-ui/components/select/types';

import { useQuery } from '@laser-pro/router';
import { Button, Card, Checkbox, DialogService, Dropdown, Icon, Modal, Pagination, Select, Spinner } from '@laser-ui/components';
import { useImmer, useMount } from '@laser-ui/hooks';
import AddOutlined from '@material-design-icons/svg/outlined/add.svg?react';
import KeyboardArrowDownOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_down.svg?react';
import { isUndefined, pick } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppDeviceModal } from './DeviceModal';
import { AppRouteHeader, AppStatusDot, AppTable, AppTableFilter } from '../../../components';
import { useHttp } from '../../../core';
import { checkEmpty, handleStandardResponse } from '../../../utils';

import styles from './StandardTable.module.scss';

interface QueryParams {
  keyword: string;
  model: string[];
  status: number[];
  page: number;
  pageSize: number;
}
const QUERY: QueryParams = {
  keyword: '',
  model: [],
  status: [],
  page: 1,
  pageSize: 10,
};

export default function StandardTable() {
  const { t } = useTranslation();
  const http = useHttp();

  const [query, updateQuery] = useQuery<QueryParams>(QUERY);
  const [table, setTable] = useImmer({
    loading: true,
    list: [] as DeviceData[],
    totalSize: 0,
    selected: new Set<number>(),
  });
  const allSelected = table.selected.size === 0 ? false : table.selected.size === table.list.length ? true : 'mixed';

  const [modelList, setModelList] = useState<SelectItem<string>[]>();

  const requestTable = (updateParams?: Partial<QueryParams>, options?: { clear?: boolean }) => {
    let params = query;
    if (updateParams) {
      params = updateQuery(updateParams, { clear: options?.clear, navigateOptions: {} });
    }
    setTable((draft) => {
      draft.loading = true;
    });
    const reqParams: AppStandardRequest.Params = {
      page: params.page,
      page_size: params.pageSize,
    };
    if (!checkEmpty(params.keyword)) {
      reqParams['keyword'] = params.keyword;
    }
    if (!checkEmpty(params.model)) {
      reqParams['filter[model:in]'] = params.model.join();
    }
    if (!checkEmpty(params.status)) {
      reqParams['filter[status:in]'] = params.status.join();
    }
    http<AppStandardResponse.List<AppDocs.Device>>({
      url: '/device',
      method: 'get',
      params: reqParams,
    }).then((res) => {
      updateQuery({ page: res.metadata.page }, { navigateOptions: {} });
      setTable({
        loading: false,
        list: res.resources,
        totalSize: res.metadata.total_size,
        selected: new Set(),
      });
    });
  };

  useMount(() => {
    requestTable();

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

  const openDeviceModal = (device?: DeviceData) => {
    DialogService.open(AppDeviceModal, {
      device,
      onSuccess: () => {
        requestTable();
      },
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
        <Card className="mb-3">
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
                      model={query.status}
                      onModelChange={(value) => {
                        updateQuery({ status: value });
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
                  value: query.status,
                },
                {
                  label: 'Model',
                  node: (
                    <Select
                      style={{ width: '16em', maxWidth: '100%' }}
                      list={modelList ?? []}
                      model={query.model}
                      placeholder="Model"
                      loading={isUndefined(modelList)}
                      multiple
                      clearable
                      onModelChange={(value) => {
                        updateQuery({ model: value });
                      }}
                    />
                  ),
                  value: query.model,
                },
              ]}
              searchValue={query.keyword}
              searchPlaceholder="ID, Name"
              onSearchValueChange={(value) => {
                updateQuery({ keyword: value });
              }}
              onSearchClick={() => {
                requestTable({ page: 1 });
              }}
              onResetClick={(change) => {
                (change ? requestTable : updateQuery)(pick(query, ['pageSize']), { clear: true });
              }}
            />
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Spinner visible={table.loading}></Spinner>
            <AppTable
              list={table.list}
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
                  setTable((draft) => {
                    draft.selected = new Set(checked ? draft.list.map((data) => data.id) : []);
                  });
                },
                item: (data) => ({
                  checked: table.selected.has(data.id),
                  onChange: (checked) => {
                    setTable((draft) => {
                      if (checked) {
                        draft.selected.add(data.id);
                      } else {
                        draft.selected.delete(data.id);
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
                                http({
                                  url: `/device/${data.id}`,
                                  method: 'delete',
                                }).then((res) => {
                                  handleStandardResponse(res, {
                                    success: () => {
                                      requestTable();
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
                requestTable();
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
                total={table.totalSize}
                active={query.page}
                pageSize={query.pageSize}
                compose={['total', 'pages', 'page-size', 'jump']}
                onChange={(page, pageSize) => {
                  requestTable({ page, pageSize });
                }}
              />
            </div>
          </Card.Content>
        </Card>
      </div>
    </>
  );
}
