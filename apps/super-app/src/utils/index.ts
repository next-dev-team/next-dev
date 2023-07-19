/**
 * register auto import
 */
export { allTranslation } from '@/locales/translation/_all'
export {
  SettingDrawer as PSettingDrawer, PageContainer as PageContainer, PageLoading,
  ProCard,
  ProForm,
  ProFormDigitRange,
  ProFormText,
  StatisticCard, getMenuData
} from '@ant-design/pro-components'
export { default as Marquee } from 'react-fast-marquee'
export * from '../../config/defaultSettings'; // default settings
export { default as routesUmi } from '../../config/routes'
import theme from 'antd/es/theme'
export const useToken = theme.useToken
