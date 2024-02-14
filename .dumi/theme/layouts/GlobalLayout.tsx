import { config } from '@my/config'
import { CustomToast, TamaguiProviderProps, ToastProvider } from '@next-dev/rn-ui'
import { ConfigProvider } from 'antd'
import { useOutlet } from 'dumi'
import { type FC } from 'react'
import { TamaguiProvider } from 'tamagui'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  return (
    <TamaguiProvider config={config} disableInjectCSS {...rest}>
      <ToastProvider
        swipeDirection="horizontal"
        duration={6000}
        native={
          [
            /* uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go */
            // 'mobile'
          ]
        }
      >
        {children}

        <CustomToast />
      </ToastProvider>
    </TamaguiProvider>
  )
}

const GlobalLayout: FC = () => {
  const outlet = useOutlet()

  return (
    <ConfigProvider>
      <Provider>{outlet}</Provider>
    </ConfigProvider>
  )
}

export default GlobalLayout
