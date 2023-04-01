
import { lorem } from '../_devLorem';
import { ICardBlog1Props } from './component';



export const mockCardBlog1 = (
  item?: ICardBlog1Props['dataItems'],
  isLongContent?: boolean,
): ICardBlog1Props['dataItems'] => {
  return {
    description: lorem.generateSentences(isLongContent ? 4 : 1),
    title: lorem.generateWords(5),
    date: new Date().toISOString(),
    cover:
      'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    linkText: 'Read more',
    link: 'https://nextjs.org/blog',
    linkTarget: '_blank',
    onClickLink: () => {
      alert('Read more');
    },
    ...item,
  };
};
