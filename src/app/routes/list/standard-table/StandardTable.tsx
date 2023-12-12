import type { DeviceData } from './types';
import type { SelectItem } from '@laser-ui/components/select/types';

import { Button, Card, Checkbox, DialogService, Dropdown, Icon, Modal, Pagination, Select, Spinner } from '@laser-ui/components';
import { useImmer, useMount } from '@laser-ui/hooks';
import AddOutlined from '@material-design-icons/svg/outlined/add.svg?react';
import KeyboardArrowDownOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_down.svg?react';
import { isUndefined } from 'lodash';
import { Children, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppDeviceModal } from './DeviceModal';
import { AppRouteHeader, AppStatusDot, AppTable, AppTableFilter } from '../../../components';
import { useHttp } from '../../../core';
import { useSaveQuery } from '../../../hooks';
import { handleStandardResponse } from '../../../utils';

import styles from './StandardTable.module.scss';

interface QueryParams {
  sort: 'id' | '-id' | null;
  keyword: string;
  model: string[];
  status: number[];
  page: number;
  pageSize: number;
}
const QUERY: QueryParams = {
  sort: '-id',
  keyword: '',
  model: [],
  status: [],
  page: 1,
  pageSize: 10,
};

export default function StandardTable() {
  const { t } = useTranslation();
  const http = useHttp();

  const [initialQuery = QUERY, saveQueryParams] = useSaveQuery<QueryParams>();
  const [query, setQuery] = useImmer(initialQuery);
  const isQueryEmpty = useMemo(() => {
    const empty = {
      keyword: query.keyword.length === 0,
      model: query.keyword.length === 0,
      status: query.status.length === 0,
    };
    return Object.assign(empty, { __value: Object.values(empty).every((isEmpty) => isEmpty) });
  }, [query]);

  const [table, setTable] = useImmer({
    loading: true,
    list: [] as DeviceData[],
    totalSize: 0,
    selected: new Set<number>(),
    isQueryEmpty: true,
  });
  const allSelected = table.selected.size === 0 ? false : table.selected.size === table.list.length ? true : 'mixed';

  const [modelList, setModelList] = useState<SelectItem<string>[]>();

  useMount(() => {
    http<AppStandardResponse.List<AppDocs.DeviceModel>>({
      url: '/device/model',
      method: 'get',
    })[0].then((res) => {
      setModelList(
        res.resources.map((model) => ({
          label: model.name,
          value: model.name,
          disabled: model.disabled,
        })),
      );
    });
  });

  const [updateTable, setUpdateTable] = useState(0);
  useEffect(() => {
    saveQueryParams(query);
    setTable((draft) => {
      draft.loading = true;
      draft.isQueryEmpty = isQueryEmpty.__value;
    });
    const reqParams: AppStandardRequest.Params = {
      page: query.page,
      page_size: query.pageSize,
    };
    if (!isQueryEmpty.keyword) {
      reqParams['keyword'] = query.keyword;
    }
    if (!isQueryEmpty.model) {
      reqParams['filter[model:in]'] = query.model.join();
    }
    if (!isQueryEmpty.status) {
      reqParams['filter[status:in]'] = query.status.join();
    }
    http<AppStandardResponse.List<AppDocs.Device>>({
      url: '/device',
      params: reqParams,
      method: 'get',
    })[0].then((res) => {
      setQuery((draft) => {
        draft.page = res.metadata.page;
        draft.pageSize = res.metadata.page_size;
      });
      setTable((draft) => {
        draft.loading = false;
        draft.list = res.resources;
        draft.totalSize = res.metadata.total_size;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTable]);

  const openDeviceModal = (device?: DeviceData) => {
    DialogService.open(AppDeviceModal, {
      device,
      onSuccess: () => {
        setUpdateTable((n) => n + 1);
      },
    });
  };

  return (
    <>
      <AppRouteHeader>
        <AppRouteHeader.Breadcrumb
          list={[
            { id: '/list', title: t('List', { ns: 'title' }) },
            { id: '/list/standard-table', title: t('Standard Table', { ns: 'title' }) },
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
        <Card>
          <Card.Content>
            <Spinner visible={table.loading}></Spinner>
            <AppTableFilter
              className="mb-3"
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
                        setQuery((draft) => {
                          draft.status = value;
                        });
                      }}
                    >
                      {(nodes) => (
                        <div className="row g-2">
                          {Children.map(nodes, (node) => (
                            <div className="col-auto">{node}</div>
                          ))}
                        </div>
                      )}
                    </Checkbox.Group>
                  ),
                  isEmpty: isQueryEmpty.status,
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
                        setQuery((draft) => {
                          draft.model = value;
                        });
                      }}
                    />
                  ),
                  isEmpty: isQueryEmpty.model,
                },
              ]}
              searchValue={query.keyword}
              searchPlaceholder="ID, Name"
              onSearchValueChange={(value) => {
                setQuery((draft) => {
                  draft.keyword = value;
                });
              }}
              onSearchClick={() => {
                setQuery({ ...query, page: 1 });
                setUpdateTable((n) => n + 1);
              }}
              onResetClick={() => {
                setQuery({
                  ...query,
                  keyword: '',
                  model: [],
                  status: [],
                });

                if (!table.isQueryEmpty) {
                  setUpdateTable((n) => n + 1);
                }
              }}
            />
            <AppTable
              list={table.list}
              columns={[
                {
                  th: (
                    <Checkbox
                      model={allSelected === true}
                      indeterminate={allSelected === 'mixed'}
                      onModelChange={(checked) => {
                        setTable((draft) => {
                          draft.selected = new Set(checked ? draft.list.map((data) => data.id) : []);
                        });
                      }}
                    />
                  ),
                  td: (data) => (
                    <Checkbox
                      model={table.selected.has(data.id)}
                      onModelChange={(checked) => {
                        setTable((draft) => {
                          if (checked) {
                            draft.selected.add(data.id);
                          } else {
                            draft.selected.delete(data.id);
                          }
                        });
                      }}
                    />
                  ),
                  width: 60,
                  align: 'center',
                  checkbox: true,
                },
                {
                  th: 'NAME',
                  td: 'name',
                  title: true,
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
                                })[0].then((res) => {
                                  handleStandardResponse(res, {
                                    success: () => {
                                      setUpdateTable((n) => n + 1);
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
                  <Button
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
                </Dropdown>
              </div>
              <Pagination
                total={table.totalSize}
                active={query.page}
                pageSize={query.pageSize}
                compose={['total', 'pages', 'page-size', 'jump']}
                onChange={(page, pageSize) => {
                  setQuery({
                    ...query,
                    page,
                    pageSize,
                  });
                  setUpdateTable((n) => n + 1);
                }}
              />
            </div>
          </Card.Content>
        </Card>
      </div>
    </>
  );
}
