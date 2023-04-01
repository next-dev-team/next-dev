import { Button, Space } from 'antd';
import React from 'react';

/**
 * @see https://www.hyperui.dev/components/marketing/blog-cards
 * @returns
 */

export type ICardBlog1Props = {
  dataItems: {
    title?: string;
    description?: string;
    date?: string;
    cover?: string;
    alt?: string;
    /**
     * active when no onClickLink is provided
     */
    link?: string;
    onClickLink?: React.MouseEventHandler<HTMLAnchorElement>;
    linkText?: string;
    linkTarget?: React.HTMLAttributeAnchorTarget;
  };
};
export default function Components(props: ICardBlog1Props) {
  const { dataItems = {} } = props;

  return (
   <Space>
     <button className="bg-primary text-white py-xs px-md rounded-md font-bold hover:bg-primary-hover active:bg-primary-active">
    Primary Antd Tw
  </button>
  <Button type='primary'>Primary Antd</Button>
   </Space>
  );
}
