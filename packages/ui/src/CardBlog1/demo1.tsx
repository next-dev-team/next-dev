import CardBlog1 from '.';
import { mockCardBlog1 } from './mock';

export default function Demo() {
  return <CardBlog1 {...{ dataItems: mockCardBlog1() }} />;
}
