/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
import { Modal } from 'antd';
import Editor from 'react-simple-code-editor';
import jsxToString from 'react-element-to-jsx-string';
import SyntaxHighlighter from 'react-syntax-highlighter';
import atelierCaveDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atelier-cave-light';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-markup';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { _axios } from './request';
export const showCodeMode = ({
  render,
  title,
}: {
  render: any;
  title: any;
}) => {
  Modal.info({
    width: '70%',
    maskClosable: true,
    title: title,
    content: (
      <SyntaxHighlighter language="react" style={atelierCaveDark} wrapLongLines>
        {jsxToString(render)}
      </SyntaxHighlighter>
    ),
  });
};

require('prismjs/components/prism-jsx');

export const CodePreview = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Fira+Mono"
        rel="stylesheet"
      />
      {/* @ts-ignore */}
      <Editor
        disabled
        value={jsxToString(children)
          .replace('{`<', '<')
          .replace('`}', '')
          .replace('>;', '>')
          .replace('>`}', '>')}
        highlight={(code) => highlight(code, languages.jsx!, 'jsx')}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 13,
        }}
      />
    </>
  );
};

export const goToTop = () => {
  window.scrollTo(0, 0);
};

export function source(html: any, spacing: string = 'relative') {
  return `

    <link rel="stylesheet" href="${
      $cons.isNodeDev ? origin : origin + '/next-dev'
    }/tailwind-prod.css">

    <body class="${spacing}">
      ${renderToStaticMarkup(html)}
    </body>
  `;
}
