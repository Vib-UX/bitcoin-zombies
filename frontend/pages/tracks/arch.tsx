import Link from "next/link";
import { ArrowLeft, Play, CheckCircle, Lock, Code2 } from "lucide-react";

interface ArchLesson {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  href: string;
  isCompleted: boolean;
  isUnlocked: boolean;
}

const archLessons: ArchLesson[] = [
  {
    id: 1,
    title: "Hello World",
    description:
      "Learn the basics of Arch programming with your first program. Understand the fundamental structure and entry points.",
    difficulty: "Beginner",
    duration: "15 min",
    href: "/tracks/arch/lesson1",
    isCompleted: false,
    isUnlocked: true,
  },
  {
    id: 2,
    title: "Variables & Data Types",
    description:
      "Master Arch data types, variable declarations, and memory management in blockchain programs.",
    difficulty: "Beginner",
    duration: "20 min",
    href: "/tracks/arch/lesson2",
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 3,
    title: "Account Management",
    description:
      "Learn to work with accounts, read account data, and manage state in your Arch programs.",
    difficulty: "Beginner",
    duration: "25 min",
    href: "/tracks/arch/lesson3",
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 4,
    title: "Instruction Processing",
    description:
      "Deep dive into instruction data processing, serialization, and program logic flow.",
    difficulty: "Intermediate",
    duration: "30 min",
    href: "/tracks/arch/lesson4",
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 5,
    title: "Program Derived Addresses",
    description:
      "Master PDAs, cross-program invocations, and advanced account management techniques.",
    difficulty: "Intermediate",
    duration: "35 min",
    href: "/tracks/arch/lesson5",
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 6,
    title: "Token Operations",
    description:
      "Learn to create, mint, and transfer tokens using Arch's token program interfaces.",
    difficulty: "Intermediate",
    duration: "40 min",
    href: "/tracks/arch/lesson6",
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 7,
    title: "Smart Contract Interactions",
    description:
      "Build complex smart contracts that interact with other programs and external data.",
    difficulty: "Advanced",
    duration: "45 min",
    href: "/tracks/arch/lesson7",
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 8,
    title: "DeFi Protocol Development",
    description:
      "Create a complete DeFi protocol with swaps, liquidity pools, and yield farming mechanics.",
    difficulty: "Advanced",
    duration: "60 min",
    href: "/tracks/arch/lesson8",
    isCompleted: false,
    isUnlocked: false,
  },
];

export default function ArchTrack() {
  const completedLessons = archLessons.filter(
    (lesson) => lesson.isCompleted
  ).length;
  const unlockedLessons = archLessons.filter(
    (lesson) => lesson.isUnlocked
  ).length;
  const progressPercentage = (completedLessons / archLessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-bitcoin-500 hover:text-bitcoin-400">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-bitcoin-500 to-bitcoin-600">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Arch Network Track
                </h1>
                <p className="text-gray-400">
                  Master decentralized application development
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400">Progress</div>
            <div className="text-xl font-bold text-bitcoin-500">
              {completedLessons}/{archLessons.length} lessons
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="grid md:grid-cols-4 gap-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-bitcoin-500 mb-1">
                {completedLessons}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">
                {unlockedLessons}
              </div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">
                {archLessons.length - unlockedLessons}
              </div>
              <div className="text-sm text-gray-400">Locked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-gray-400">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-bitcoin-500 to-bitcoin-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {archLessons.map((lesson) => {
              const LessonWrapper = ({
                children,
              }: {
                children: React.ReactNode;
              }) => {
                if (lesson.isUnlocked) {
                  return (
                    <Link href={lesson.href} className="block group">
                      {children}
                    </Link>
                  );
                }
                return <div className="group">{children}</div>;
              };

              return (
                <LessonWrapper key={lesson.id}>
                  <div
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-300
                      ${
                        lesson.isUnlocked
                          ? "border-gray-700 hover:border-bitcoin-500 hover:shadow-lg hover:shadow-bitcoin-500/20 cursor-pointer group-hover:scale-[1.02]"
                          : "border-gray-800 opacity-60"
                      }
                      bg-gradient-to-br from-gray-900 to-gray-800
                    `}
                  >
                    {/* Lock overlay for locked lessons */}
                    {!lesson.isUnlocked && (
                      <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                          <Lock className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                          <p className="text-xs text-gray-500 font-medium">
                            Complete previous lessons
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Lesson Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bitcoin-500 flex items-center justify-center text-white font-bold text-sm">
                          {lesson.id}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-bitcoin-400 transition-colors">
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-1 text-xs rounded font-medium ${
                                lesson.difficulty === "Beginner"
                                  ? "bg-green-600 text-white"
                                  : lesson.difficulty === "Intermediate"
                                  ? "bg-yellow-600 text-white"
                                  : "bg-red-600 text-white"
                              }`}
                            >
                              {lesson.difficulty}
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-600 text-white rounded">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {lesson.isCompleted && (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      )}
                      {lesson.isUnlocked && !lesson.isCompleted && (
                        <Play className="h-5 w-5 text-bitcoin-400 group-hover:text-bitcoin-300 transition-colors" />
                      )}
                    </div>

                    {/* Lesson Description */}
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>
                </LessonWrapper>
              );
            })}
          </div>
        </div>

        {/* Track Completion Message */}
        {completedLessons === archLessons.length && (
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-green-800 to-green-900 rounded-xl border border-green-700">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Congratulations!
            </h2>
            <p className="text-green-200 mb-4">
              You've completed the Arch Network track!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-bitcoin-600 hover:bg-bitcoin-700 text-white rounded-lg transition-colors"
            >
              Unlock Next Track
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
