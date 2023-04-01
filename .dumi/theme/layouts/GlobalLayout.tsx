import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeConfig } from 'antd/es/config-provider/context';
import { useOutlet } from 'dumi';
import React, { useLayoutEffect, type FC } from 'react';

const ANT_DESIGN_SITE_THEME = 'antd-site-theme';

const getAlgorithm = (theme: string) => {
  if (theme === 'dark') {
    return antdTheme.darkAlgorithm;
  }
  if (theme === 'compact') {
    return antdTheme.compactAlgorithm;
  }
  return antdTheme.defaultAlgorithm;
};

const getThemeString = (algorithm: typeof antdTheme.defaultAlgorithm) => {
  if (algorithm === antdTheme.darkAlgorithm) {
    return 'dark';
  }
  if (algorithm === antdTheme.compactAlgorithm) {
    return 'compact';
  }
  return 'light';
};

const GlobalLayout: FC = () => {
  const outlet = useOutlet();

  const [theme, setTheme] = React.useState<ThemeConfig>({
    algorithm: [antdTheme.defaultAlgorithm],
  });

  const handleThemeChange = (
    newTheme: ThemeConfig,
    ignoreAlgorithm: boolean = true,
  ) => {
    const nextTheme = { ...newTheme };
    if (ignoreAlgorithm) {
      nextTheme.algorithm = theme.algorithm;
    }
    setTheme(nextTheme);
    localStorage.setItem(
      ANT_DESIGN_SITE_THEME,
      JSON.stringify(nextTheme, (key, value) => {
        if (key === 'algorithm') {
          return Array.isArray(value)
            ? value.map((item) => getThemeString(item))
            : ['light'];
        }
        return value;
      }),
    );
  };

  useLayoutEffect(() => {
    const localTheme = localStorage.getItem(ANT_DESIGN_SITE_THEME);
    if (localTheme) {
      try {
        const themeConfig = JSON.parse(localTheme);
        if (themeConfig.algorithm) {
          themeConfig.algorithm = themeConfig.algorithm.map((item: string) =>
            getAlgorithm(item),
          );
        } else {
          themeConfig.algorithm = [antdTheme.defaultAlgorithm];
        }
        setTheme(themeConfig);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <ConfigProvider
      componentSize="large"
      theme={{
        ...theme,
      }}
    >
      {outlet}
    </ConfigProvider>
  );
};

export default GlobalLayout;
