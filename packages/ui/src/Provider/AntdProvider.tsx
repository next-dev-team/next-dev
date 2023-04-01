import { ConfigProvider } from "antd";
import enUS from 'antd/lib/locale/en_US'; // import
import React from 'react';

const AntdProvider = ({ children }:{children:React.ReactNode}) => {
  return (
    <ConfigProvider locale={enUS}>
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
