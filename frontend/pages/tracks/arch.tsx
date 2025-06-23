import Link from "next/link";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Lock,
  Code2,
  Target,
  BookOpen,
} from "lucide-react";
import { archLessonsData } from "../../utils/archLessonsData";

export default function ArchTrack() {
  const completedLessons = archLessonsData.filter(
    (lesson) => lesson.isCompleted
  ).length;
  const unlockedLessons = archLessonsData.filter(
    (lesson) => lesson.isUnlocked
  ).length;
  const progressPercentage = (completedLessons / archLessonsData.length) * 100;

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
                  Master decentralized application development with hands-on
                  examples
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href="https://github.com/Arch-Network/arch-examples"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    📚 Based on official Arch examples
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400">Progress</div>
            <div className="text-xl font-bold text-bitcoin-500">
              {completedLessons}/{archLessonsData.length} lessons
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
                {archLessonsData.length - unlockedLessons}
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
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {archLessonsData.map((lesson) => {
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
                          ? "border-gray-700 hover:border-bitcoin-500 hover:shadow-lg hover:shadow-bitcoin-500/20 cursor-pointer group-hover:scale-[1.01]"
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
                        <div className="w-10 h-10 rounded-full bg-bitcoin-500 flex items-center justify-center text-white font-bold text-sm">
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
                            {lesson.exampleSource && (
                              <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                                Official Example
                              </span>
                            )}
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
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {lesson.description}
                    </p>

                    {/* Learning Objectives */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Target className="h-4 w-4 text-bitcoin-400" />
                        <span className="text-xs font-medium text-bitcoin-400">
                          Learning Objectives
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {lesson.objectives
                          .slice(0, 2)
                          .map((objective, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span className="text-xs text-gray-400">
                                {objective}
                              </span>
                            </div>
                          ))}
                        {lesson.objectives.length > 2 && (
                          <span className="text-xs text-gray-500 ml-3">
                            +{lesson.objectives.length - 2} more objectives
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Key Concepts */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1 mb-2">
                        <BookOpen className="h-4 w-4 text-purple-400" />
                        <span className="text-xs font-medium text-purple-400">
                          Key Concepts
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {lesson.concepts.slice(0, 4).map((concept, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                          >
                            {concept}
                          </span>
                        ))}
                        {lesson.concepts.length > 4 && (
                          <span className="px-2 py-1 text-xs bg-gray-800 text-gray-500 rounded">
                            +{lesson.concepts.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </LessonWrapper>
              );
            })}
          </div>
        </div>

        {/* Track Completion Message */}
        {completedLessons === archLessonsData.length && (
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-green-800 to-green-900 rounded-xl border border-green-700">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Congratulations!
            </h2>
            <p className="text-green-200 mb-4">
              You've completed the Arch Network track! You're now ready to build
              sophisticated blockchain applications.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-bitcoin-600 hover:bg-bitcoin-700 text-white rounded-lg transition-colors"
            >
              Unlock Next Track
            </Link>
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-12 p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-center">
            📚 Additional Learning Resources
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="https://github.com/Arch-Network/arch-examples"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <h4 className="font-medium text-white mb-2">Arch Examples</h4>
              <p className="text-sm text-gray-300">
                Official examples and reference implementations
              </p>
            </a>
            <a
              href="https://github.com/Arch-Network/book"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <h4 className="font-medium text-white mb-2">The Arch Book</h4>
              <p className="text-sm text-gray-300">
                Comprehensive documentation and guides
              </p>
            </a>
            <a
              href="https://github.com/Arch-Network/arch-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <h4 className="font-medium text-white mb-2">Arch CLI</h4>
              <p className="text-sm text-gray-300">
                Command-line tools for development
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
