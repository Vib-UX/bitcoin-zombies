import { Check, Circle } from "lucide-react";

interface Step {
  title: string;
  content: string;
}

interface LessonStepsProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function LessonSteps({
  steps,
  currentStep,
  onStepChange,
}: LessonStepsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Lesson Steps</h3>

      {steps.map((step, index) => (
        <div
          key={index}
          className={`lesson-step cursor-pointer transition-all ${
            index === currentStep
              ? "border-bitcoin-500 bg-gray-700"
              : "hover:bg-gray-750"
          }`}
          onClick={() => onStepChange(index)}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {index < currentStep ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : index === currentStep ? (
                <Circle className="h-5 w-5 text-bitcoin-500 fill-current" />
              ) : (
                <Circle className="h-5 w-5 text-gray-500" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-medium mb-2 text-sm">
                Step {index + 1}: {step.title}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.content}
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <h4 className="font-medium text-blue-300 mb-2">💡 Tip</h4>
        <p className="text-blue-200 text-sm">
          Click on any step above to jump to that part of the lesson. Take your
          time to understand each concept before moving forward.
        </p>
      </div>
    </div>
  );
}
