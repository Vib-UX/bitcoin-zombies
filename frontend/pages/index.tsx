import { BookOpen, Code, Zap } from "lucide-react";
import ProtocolSelector from "../components/ProtocolSelector";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-bitcoin-400 to-bitcoin-600 bg-clip-text text-transparent">
            Bitcoin Zombies
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Master Bitcoin and its metaprotocols through interactive programming
            lessons. Build real applications step by step.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <Code className="h-12 w-12 mx-auto mb-4 text-bitcoin-500" />
            <h3 className="text-xl font-semibold mb-2">Interactive Coding</h3>
            <p className="text-gray-400">
              Write and test Bitcoin programs directly in your browser with
              real-time feedback
            </p>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-bitcoin-500" />
            <h3 className="text-xl font-semibold mb-2">
              Multi-Protocol Learning
            </h3>
            <p className="text-gray-400">
              Learn Arch, Alkanes, Ordinals, Runes, and more Bitcoin
              metaprotocols
            </p>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <Zap className="h-12 w-12 mx-auto mb-4 text-bitcoin-500" />
            <h3 className="text-xl font-semibold mb-2">
              Progressive Unlocking
            </h3>
            <p className="text-gray-400">
              Start with basics and unlock advanced metaprotocols as you
              progress
            </p>
          </div>
        </div>

        {/* Protocol Selector */}
        <ProtocolSelector />

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p>Built with Next.js, Rust, and Bitcoin metaprotocol technologies</p>
        </div>
      </div>
    </div>
  );
}
