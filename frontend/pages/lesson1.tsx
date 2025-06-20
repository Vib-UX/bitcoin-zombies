import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import ConsoleOutput from "../components/ConsoleOutput";
import LessonSteps from "../components/LessonSteps";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";

const initialCode = `use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello, Arch World!");
    Ok(())
}`;

export default function Lesson1() {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running your Arch program...\n");

    try {
      const response = await fetch("/api/run-arch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      setOutput(result.output || result.error || "No output received");
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput("");
  };

  const steps = [
    {
      title: "Understanding the Arch Program Structure",
      content:
        "Every Arch program starts with these essential imports and the entrypoint macro. The entrypoint defines the main function that gets called when your program runs on the blockchain.",
    },
    {
      title: "The Process Instruction Function",
      content:
        "This is where your program logic lives. It receives the program ID, accounts, and instruction data. For now, we'll just print a message.",
    },
    {
      title: "Using the msg! Macro",
      content:
        "The msg! macro is how you output messages from your Arch program. This is essential for debugging and understanding what your program is doing.",
    },
    {
      title: "Run Your First Program",
      content:
        "Click the Run button to compile and execute your Hello World program. You should see the message appear in the console output.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-bitcoin-500 hover:text-bitcoin-400">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold">Lesson 1: Hello World</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetCode}
              className="flex items-center gap-2 btn-secondary"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 btn-primary disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              {isRunning ? "Running..." : "Run"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Instructions */}
          <div className="lg:col-span-1">
            <LessonSteps
              steps={steps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />
          </div>

          {/* Right: Code Editor and Output */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Code Editor</h3>
              <CodeEditor
                value={code}
                onChange={setCode}
                language="rust"
                height="400px"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Console Output</h3>
              <ConsoleOutput output={output} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
