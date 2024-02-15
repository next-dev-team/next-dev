import DumiGrid from '../../../../.dumi/components/Grid'
import CardBorderGradient from './CardBorderGradient'

export default function Demo() {
  return <DumiGrid item={[{ col: { children: <CardBorderGradient /> } }]} />
}
