import DumiGrid from '../../../../.dumi/components/Grid'
import BlogCard from './BlogCard'
import BlogCard1 from './BlogCard1'
import CardBorderGradient from './CardBorderGradient'

export default function Demo() {
  return (
    <DumiGrid
      item={[
        {
          col: {
            span: 24,
            children: <BlogCard1 />,
          },
        },
        {
          col: {
            children: <BlogCard />,
          },
        },
        {
          col: {
            children: <CardBorderGradient />,
          },
        },
      ]}
    />
  )
}
