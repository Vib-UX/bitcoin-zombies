import Link from "next/link";
import { BookOpen, Code, Zap } from "lucide-react";

export default function Home() {
  const lessons = [
    {
      id: 1,
      title: "Hello World",
      description:
        "Learn the basics of Arch programming with your first program",
      difficulty: "Beginner",
      duration: "15 min",
      href: "/lesson1",
    },
    // More lessons can be added here
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-bitcoin-400 to-bitcoin-600 bg-clip-text text-transparent">
            Bitcoin Zombies
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Learn Arch blockchain programming through interactive lessons. Build
            your first Bitcoin programs step by step.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <Code className="h-12 w-12 mx-auto mb-4 text-bitcoin-500" />
            <h3 className="text-xl font-semibold mb-2">Interactive Coding</h3>
            <p className="text-gray-400">
              Write and test Arch programs directly in your browser
            </p>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-bitcoin-500" />
            <h3 className="text-xl font-semibold mb-2">
              Step-by-Step Learning
            </h3>
            <p className="text-gray-400">
              Guided lessons that build your knowledge progressively
            </p>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <Zap className="h-12 w-12 mx-auto mb-4 text-bitcoin-500" />
            <h3 className="text-xl font-semibold mb-2">Real-time Feedback</h3>
            <p className="text-gray-400">
              See your code results instantly with our integrated runner
            </p>
          </div>
        </div>

        {/* Lessons */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Available Lessons
          </h2>
          <div className="grid gap-6">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={lesson.href}
                className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-bitcoin-500 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold group-hover:text-bitcoin-400 transition-colors">
                    Lesson {lesson.id}: {lesson.title}
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs bg-green-600 text-white rounded">
                      {lesson.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-600 text-white rounded">
                      {lesson.duration}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400">{lesson.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p>Built with Next.js, Rust, and Arch blockchain technology</p>
        </div>
      </div>
    </div>
  );
}
