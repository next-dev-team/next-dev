import CardBlog1 from '.';
import { mockCardBlog1 } from './mock';

export default function Demo() {
  return (
    <CardBlog1
      {...{
        dataItems: mockCardBlog1(
          {
            cover:
              'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          },
          true,
        ),
      }}
    />
  );
}
