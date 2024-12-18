import type { AppMenuItem } from '../configs/menu';
import type { MenuItem } from '@laser-ui/components/menu/types';

import { useACL } from '@laser-pro/acl';
import { Icon } from '@laser-ui/components';
import { useMount } from '@laser-ui/hooks';
import { isObject, isUndefined } from 'lodash';
import { useStore } from 'rcl-store';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { GlobalStore } from './store';
import { MENU } from '../configs/menu';

export function useMenu() {
  const acl = useACL();
  const { t } = useTranslation();
  const location = useLocation();
  const [{ appMenu }, { appMenu: setAppMenu }] = useStore(GlobalStore, ['appMenu']);

  const res: {
    active?: { path: string; parentSub: AppMenuItem[] };
    firstCanActive?: { path: string; parentSub: AppMenuItem[] };
    secondCanActive?: { path: string; parentSub: AppMenuItem[] };
  } = {};
  const reduceMenu = (arr: AppMenuItem[], parentSub: AppMenuItem[]): MenuItem<string>[] => {
    const newArr: MenuItem<string>[] = [];
    for (const item of arr) {
      if (item.acl) {
        const params =
          isObject(item.acl) && 'control' in item.acl
            ? item.acl
            : {
                control: item.acl,
              };
        if (!acl.can(params.control, params.mode)) {
          continue;
        }
      }

      const { title: _title, titleI18n } = item;
      const title = _title ?? (isUndefined(titleI18n) ? undefined : t(titleI18n as any, { ns: 'title' }));
      const IconFC = item.icon;
      const obj: MenuItem<string> = {
        id: item.path,
        title:
          item.type === 'item' ? (
            <Link className="app-menu-link" tabIndex={-1} to={item.path}>
              {title}
            </Link>
          ) : (
            title
          ),
        icon: IconFC ? (
          <Icon>
            <IconFC />
          </Icon>
        ) : undefined,
        type: item.type,
      };

      if (item.children) {
        obj.children = reduceMenu(item.children, parentSub.concat(item.type === 'sub' ? [item] : []));
        if (obj.children.length > 0) {
          newArr.push(obj);
        }
      } else {
        newArr.push(obj);
        if (item.path === location.pathname || (item.greedyMatch && location.pathname.startsWith(item.path + '/'))) {
          res.active = {
            path: item.path,
            parentSub,
          };
        }
        if (!item.disabled) {
          if (isUndefined(res.firstCanActive)) {
            res.firstCanActive = {
              path: item.path,
              parentSub,
            };
          } else if (isUndefined(res.secondCanActive)) {
            res.secondCanActive = {
              path: item.path,
              parentSub,
            };
          }
        }
      }
    }
    return newArr;
  };
  const menu = reduceMenu(MENU, []);
  const getDefaultExpands = () =>
    (location.pathname === '/' ? res.firstCanActive?.parentSub : res.active?.parentSub)?.map((item) => item.path);

  useMount(() => {
    if (isUndefined(appMenu.expands)) {
      setAppMenu((draft) => {
        draft.expands = getDefaultExpands();
      });
    }
  });

  return [
    {
      menu,
      active: location.pathname === '/' ? res.firstCanActive : res.active,
      firstCanActive: res.firstCanActive,
      secondCanActive: res.secondCanActive,
      expands: appMenu.expands ?? getDefaultExpands(),
    },
    setAppMenu,
  ] as const;
}
