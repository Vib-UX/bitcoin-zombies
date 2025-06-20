import { useEffect, useRef } from "react";

interface ConsoleOutputProps {
  output: string;
  height?: string;
}

export default function ConsoleOutput({
  output,
  height = "200px",
}: ConsoleOutputProps) {
  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="console-output" style={{ height }}>
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span>Console Output</span>
      </div>
      <pre
        ref={outputRef}
        className="whitespace-pre-wrap text-sm leading-relaxed overflow-auto"
        style={{ maxHeight: `calc(${height} - 2rem)` }}
      >
        {output || "No output yet. Run your code to see results here."}
      </pre>
    </div>
  );
}
