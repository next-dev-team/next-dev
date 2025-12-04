/**
 * @name umi's routing configuration
 * @description Only supports path, component, routes, redirect, wrappers, name, icon configuration
 * @param path path only supports two placeholder configurations, the first is the dynamic parameter :id form, the second is the * wildcard, and the wildcard can only appear at the end of the route string.
 * @param component Configure the React component path used for rendering after location and path match. It can be an absolute path or a relative path. If it is a relative path, it will start from src/pages.
 * @param routes Configure sub-routes, usually used when adding layout components for multiple paths.
 * @param redirect Configure route redirection
 * @param wrappers Configure the wrapper component of the route component. Through the wrapper component, more functions can be combined into the current route component. For example, it can be used for route-level permission verification
 * @param name Configure the title of the route, default to read the value of menu.xxxx in the internationalization file menu.ts. If name is configured as login, the value of menu.login in menu.ts is read as the title
 * @param icon Configure the icon of the route, refer to the value https://ant.design/components/icon-cn, pay attention to remove the style suffix and case, such as wanting to configure the icon as <StepBackwardOutlined />, the value should be stepBackward or StepBackward, such as wanting to configure the icon as <UserOutlined />, the value should be user or User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/login',
    component: './Login',
    layout: false,
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
    wrappers: ['@/wrappers/auth'],
  },
  {
    path: '/posts',
    name: 'Posts',
    icon: 'profile',
    component: './Posts',
    wrappers: ['@/wrappers/auth'],
  },
  {
    path: '/users',
    name: 'Users',
    icon: 'user',
    component: './Users',
    wrappers: ['@/wrappers/auth'],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
];
