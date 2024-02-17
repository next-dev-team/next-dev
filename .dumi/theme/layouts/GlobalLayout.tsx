import { config } from '@my/config'
import { CustomToast, TamaguiProvider, TamaguiProviderProps, ToastProvider } from '@next-dev/rn-ui'
import { ConfigProvider } from '@next-dev/ui'
import enUS from 'antd/locale/en_US'
import { useOutlet } from 'dumi'
import { type FC } from 'react'

export function TamaguiAllProvider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  return (
    <TamaguiProvider config={config} {...rest}>
      <ToastProvider swipeDirection="horizontal" duration={6000}>
        {children}
        <CustomToast />
      </ToastProvider>
    </TamaguiProvider>
  )
}

const GlobalLayout: FC = () => {
  const outlet = useOutlet()

  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        token: {
          // Seed Token
          // colorPrimary: '#00b96b',
        },
      }}
    >
      <TamaguiAllProvider>{outlet}</TamaguiAllProvider>
    </ConfigProvider>
  )
}

export default GlobalLayout
