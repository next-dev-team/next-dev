import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { AvatarDropdown, AvatarName, Footer, Question, SelectLang } from '@/components';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

const isDev = process.env.NODE_ENV === 'development';
const isDevOrTest = isDev || process.env.CI;
const loginPath = '/user/login';

const queryClient = new QueryClient();

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any>;
  view?: 'home' | 'dashboard';
}> {
  const fetchUserInfo = async () => {
    // Mock user info for development
    return {
      name: 'Admin',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXu0y%26F/avatar-20200506-104236.png',
      userid: '00000001',
      email: 'admin@example.com',
      signature: 'Tolerance is great',
      title: 'Interaction Expert',
      group: 'Ant Financial - Business Group - Platform Dept - Tech Dept - UED',
      tags: [
        { key: '0', label: 'Thoughtful' },
        { key: '1', label: 'Design Focus' },
        { key: '2', label: 'Spicy~' },
        { key: '3', label: 'Long Legs' },
        { key: '4', label: 'Sichuan Girl' },
        { key: '5', label: 'Inclusive' },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      access: 'admin',
      geographic: {
        province: { label: 'Zhejiang Province', key: '330000' },
        city: { label: 'Hangzhou City', key: '330100' },
      },
      address: 'No. 77 Gongzhuan Road, Xihu District',
      phone: '0752-268888888',
    };
  };
  // If it is not a login page, execute
  const { location } = history;
  if (![loginPath, '/user/register', '/user/register-result'].includes(location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
      view: 'home',
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
    view: 'home',
  };
}

const ViewMenu = ({ setView, view }: any) => {
  const getHeaderHeight = () => {
    const el =
      (document.querySelector('.ant-pro-global-header') as HTMLElement) ||
      (document.querySelector('.ant-pro-top-nav-header') as HTMLElement) ||
      (document.querySelector('.ant-layout-header') as HTMLElement);
    return el ? el.offsetHeight : undefined;
  };
  const switchToHome = async () => {
    setView('home');
    const headerHeight = getHeaderHeight();
    await (window as any).electronAPI?.setDashboardView({
      view: 'home',
      headerHeight,
    });
  };
  const openDashboard = async () => {
    setView('dashboard');
    const headerHeight = getHeaderHeight();
    await (window as any).electronAPI?.setDashboardView({
      view: 'dashboard',
      port: 42000,
      headerHeight,
    });
  };
  const reloadDashboard = async () => {
    setView('dashboard');
    const headerHeight = getHeaderHeight();
    await (window as any).electronAPI?.setDashboardView({
      view: 'dashboard',
      port: 42000,
      headerHeight,
      reload: true,
    });
  };
  useEffect(() => {
    (window as any).electronAPI?.pterm?.(['version', 'terminal']).catch(() => {});
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <button
        type="button"
        onClick={switchToHome}
        style={{
          padding: '0px 20px',
          background: 'transparent',
          border: 'none',
          borderBottom: view === 'home' ? '2px solid #111827' : '2px solid transparent',
          fontWeight: view === 'home' ? 600 : 400,
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Home
      </button>
      <button
        type="button"
        onClick={openDashboard}
        style={{
          padding: '0px 20px',
          background: 'transparent',
          border: 'none',
          borderBottom: view === 'dashboard' ? '2px solid #111827' : '2px solid transparent',
          fontWeight: view === 'dashboard' ? 600 : 400,
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Dashboard
      </button>
      {view === 'dashboard' && (
        <button
          type="button"
          onClick={reloadDashboard}
          title="Reload Dashboard"
          aria-label="Reload Dashboard"
          style={{
            padding: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '4px',
            opacity: 0.5,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.5';
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Reload</title>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ProLayout supported api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const isDashboardView = (initialState?.view || 'home') === 'dashboard';
  return {
    actionsRender: () => [
      <ViewMenu
        key="view-menu"
        setView={(v: 'home' | 'dashboard') =>
          setInitialState((prev: any) => ({ ...prev, view: v }))
        }
        view={initialState?.view || 'home'}
      />,
      <Question key="doc" />,
      <SelectLang key="SelectLang" />,
    ],
    menuRender: isDashboardView ? false : undefined,
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => <AvatarDropdown>{avatarChildren}</AvatarDropdown>,
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: isDashboardView ? undefined : () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // If not logged in, redirect to login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    bgLayoutImgList: isDashboardView
      ? []
      : [
          {
            src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
            left: 85,
            bottom: 100,
            height: '303px',
          },
          {
            src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
            bottom: -68,
            right: -45,
            height: '303px',
          },
          {
            src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
            bottom: 0,
            left: 0,
            width: '331px',
          },
        ],
    links: isDevOrTest
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI Docs</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // Custom 403 page
    // unAccessible: <div>unAccessible</div>,
    // Add a loading state
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      if (isDashboardView) {
        return <div style={{ width: '100%', height: '100%', background: '#fff' }} />;
      }
      return (
        <>
          {children}
          {isDevOrTest && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request configuration, can configure error handling
 * It is based on axios and ahooks' useRequest to provide a set of unified network request and error handling schemes.
 * @doc https://umijs.org/docs/max/request#configuration
 */
export const request: RequestConfig = {
  baseURL: isDev ? '' : 'https://proapi.azurewebsites.net',
  ...errorConfig,
};

export function rootContainer(container: ReactNode) {
  return <QueryClientProvider client={queryClient}>{container}</QueryClientProvider>;
}
