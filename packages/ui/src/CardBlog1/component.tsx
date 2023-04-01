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
    <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
      <img
        alt="Office"
        src={dataItems?.cover}
        className="h-56 w-full object-cover"
      />

      <div className="bg-white p-4 sm:p-6">
        <time className="block text-xs text-gray-500">{dataItems?.date}</time>

        <h3 className="mt-0.5 text-lg text-gray-900">{dataItems?.title}</h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3">
          {dataItems?.description}
        </p>

        {dataItems?.onClickLink && (
          <a
            href={dataItems?.link}
            {...{
              target: dataItems?.linkTarget,
              rel: 'noreferrer',
            }}
            className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 cursor-pointer"
          >
            {dataItems?.linkText}
            <span
              aria-hidden="true"
              className="block transition group-hover:translate-x-0.5"
            >
              &rarr;
            </span>
          </a>
        )}
      </div>
    </article>
  );
}
