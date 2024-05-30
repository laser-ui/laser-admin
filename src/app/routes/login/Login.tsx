import type { PREV_ROUTE_KEY } from '../../configs/router';
import type { AppUser } from '../../types';

import { useStorage } from '@laser-pro/storage';
import {
  Button,
  Checkbox,
  DialogService,
  Form,
  FormControl,
  FormGroup,
  FormGroupContext,
  Icon,
  Input,
  Tabs,
  Toast,
  Validators,
  useForm,
} from '@laser-ui/components';
import { classNames } from '@laser-ui/utils';
import LockOutlined from '@material-design-icons/svg/outlined/lock.svg?react';
import PersonOutlined from '@material-design-icons/svg/outlined/person.svg?react';
import { isString } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppLanguage } from '../../components';
import { APP_NAME } from '../../configs/app';
import { LOGIN_PATH } from '../../configs/router';
import { STORAGE } from '../../configs/storage';
import { URLS } from '../../configs/urls';
import { TOKEN, initUser, useHttp } from '../../core';
import { rememberToken } from '../../core/token';

import styles from './Login.module.scss';

export default function Login(): JSX.Element | null {
  const { t } = useTranslation();
  const http = useHttp();
  const [loginloading, setLoginLoading] = useState(false);
  const location = useLocation();
  const from = (location.state as null | { [PREV_ROUTE_KEY]?: Location })?.from?.pathname;
  const navigate = useNavigate();

  const rememberStorage = useStorage(...STORAGE.remember);

  const [accountForm] = useForm(
    () =>
      new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
      }),
  );

  const handleSubmit = () => {
    setLoginLoading(true);
    http<{ user: AppUser; token: string }>({
      url: '/auth/login',
      method: 'post',
      data: {
        username: accountForm.get('username').value,
        password: accountForm.get('password').value,
      },
    })
      .then((res) => {
        TOKEN.set(res.token);
        rememberToken(rememberStorage.value === '1');

        initUser(res.user);
        navigate(isString(from) && from !== LOGIN_PATH ? from : '/', { replace: true });
      })
      .catch((err) => {
        DialogService.open(Toast, {
          children: err,
          type: 'error',
        });
      })
      .finally(() => {
        setLoginLoading(false);
      });
  };

  return (
    <div className={styles['app-login']}>
      <AppLanguage className={styles['app-login__lang']} />
      <div>
        <img className={classNames(styles['app-login__bg'], 'd-none d-lg-inline')} src={URLS['/login.bg.png']} alt="bg" />
        <div className={styles['app-login__login-container']}>
          <div className={styles['app-login__title-container']}>
            <img className={styles['app-login__logo']} src={URLS['/logo.png']} alt="Logo" />
            <span>{APP_NAME}</span>
          </div>
          <div className={styles['app-login__description']}>
            {APP_NAME} {t('routes.login.description')}
          </div>
          <Tabs
            className={styles['app-login__tabs']}
            list={[
              {
                id: 'account',
                title: t('routes.login.Account Login'),
                panel: (
                  <Form onSubmit={handleSubmit}>
                    <FormGroupContext.Provider value={accountForm}>
                      <Form.Item formControls={{ username: t('routes.login.Please enter your name') }}>
                        {({ username }) => (
                          <Input
                            formControl={username}
                            style={{ width: '100%' }}
                            placeholder={t('routes.login.Username')}
                            prefix={
                              <Icon>
                                <PersonOutlined />
                              </Icon>
                            }
                          />
                        )}
                      </Form.Item>
                      <Form.Item formControls={{ password: t('routes.login.Please enter your password') }}>
                        {({ password }) => (
                          <Input
                            formControl={password}
                            style={{ width: '100%' }}
                            placeholder={t('routes.login.Password')}
                            type="password"
                            prefix={
                              <Icon>
                                <LockOutlined />
                              </Icon>
                            }
                          />
                        )}
                      </Form.Item>
                      <div className="d-flex align-items-center justify-content-between mb-2" style={{ width: '100%' }}>
                        <Checkbox
                          model={rememberStorage.value === '1'}
                          onModelChange={(checked) => {
                            rememberStorage.set(checked ? '1' : '0');
                          }}
                        >
                          {t('routes.login.Remember me')}
                        </Checkbox>
                        <a className="app-link" style={{ marginLeft: 'auto' }}>
                          {t('routes.login.Forgot Password')}
                        </a>
                      </div>
                      <Form.Item>
                        <Button type="submit" loading={loginloading} disabled={!accountForm.valid} block>
                          {t('routes.login.Login')}
                        </Button>
                      </Form.Item>
                    </FormGroupContext.Provider>
                  </Form>
                ),
              },
            ]}
          />
        </div>
      </div>
      <footer className={styles['app-login__footer']}>
        <div>
          <span>© {new Date().getFullYear()} </span>
          <a className="app-link" href="https://github.com/laser-ui" target="_blank" rel="noreferrer">
            Laser UI
          </a>
          <span>, Inc.</span>
        </div>
        <div className={styles['app-login__link-container']}>
          <a className="app-link">{t('routes.login.Terms')}</a>
          <a className="app-link">{t('routes.login.Privacy')}</a>
        </div>
      </footer>
    </div>
  );
}
