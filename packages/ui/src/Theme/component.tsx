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
    <button className="rounded-xl bg-gradient-to-br from-primary to-[#FF5555] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#6025F5]/50">
    Button 16
    </button>
  );
}
