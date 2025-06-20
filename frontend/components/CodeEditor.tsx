import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readonly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language = "rust",
  height = "300px",
  readonly = false,
}: CodeEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  return (
    <div className="code-editor">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily:
            "Fira Code, Monaco, Cascadia Code, Ubuntu Mono, monospace",
          lineNumbers: "on",
          wordWrap: "on",
          automaticLayout: true,
          readOnly: readonly,
          contextmenu: false,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorStyle: "line",
          renderLineHighlight: "line",
          selectOnLineNumbers: true,
          roundedSelection: false,
          matchBrackets: "always",
          folding: true,
          foldingHighlight: true,
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </div>
  );
}
