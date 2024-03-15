import * as monaco from 'monaco-editor';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type CodeEditorProps = React.HTMLAttributes<HTMLDivElement> & {
  editorConfig?: monaco.editor.IStandaloneEditorConstructionOptions;
};

export type ICodeEditor = monaco.editor.IStandaloneCodeEditor;

type CodeEditorRef = {
  editor: monaco.editor.IStandaloneCodeEditor;
};

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(
  ({ editorConfig, className, ...rest }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const editorInstanceRef = useRef<ICodeEditor | null>(null);

    useImperativeHandle(ref, () => ({
      get editor() {
        return editorInstanceRef.current!;
      },
    }));

    useEffect(() => {
      const editorElement = editorRef.current;
      if (editorElement) {
        const editor = monaco.editor.create(editorElement, {
          language: 'typescript',
          ...editorConfig,
        });
        editorInstanceRef.current = editor;
      }
    }, []);

    return <div className="min-h-[400px]" ref={editorRef} {...rest}></div>;
  },
);

export default CodeEditor;
