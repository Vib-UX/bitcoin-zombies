import { Code2, Layers, Bitcoin, Cpu, Zap, Database, Info } from "lucide-react";
import { useEffect, useState } from "react";
import ProtocolTrackCard, { ProtocolTrack } from "./ProtocolTrackCard";
import { protocolManager } from "../utils/protocolManager";

const protocolDefinitions: Omit<
  ProtocolTrack,
  "isUnlocked" | "completedLessons"
>[] = [
  {
    id: "arch",
    name: "Arch Network",
    description:
      "Learn to build decentralized applications on Arch Network. Master the fundamentals of Arch programming and smart contract development.",
    icon: Code2,
    difficulty: "Beginner",
    estimatedTime: "2-3 hours",
    lessonsCount: 8,
    href: "/tracks/arch",
    color: {
      primary: "bitcoin-500",
      secondary: "from-bitcoin-500",
      accent: "to-bitcoin-600",
    },
  },
  {
    id: "alkanes",
    name: "Alkanes Protocol",
    description:
      "Explore Alkanes, a powerful metaprotocol for Bitcoin. Learn to create and manage alkane tokens and advanced Bitcoin scripts.",
    icon: Layers,
    difficulty: "Intermediate",
    estimatedTime: "4-5 hours",
    lessonsCount: 12,
    comingSoon: true,
    color: {
      primary: "purple-500",
      secondary: "from-purple-500",
      accent: "to-purple-600",
    },
  },
  {
    id: "ordinals",
    name: "Bitcoin Ordinals",
    description:
      "Dive into Bitcoin Ordinals and inscriptions. Learn to create, transfer, and manage digital artifacts on the Bitcoin blockchain.",
    icon: Bitcoin,
    difficulty: "Intermediate",
    estimatedTime: "3-4 hours",
    lessonsCount: 10,
    comingSoon: true,
    color: {
      primary: "orange-500",
      secondary: "from-orange-500",
      accent: "to-orange-600",
    },
  },
  {
    id: "runes",
    name: "Bitcoin Runes",
    description:
      "Master Bitcoin Runes protocol for fungible tokens. Learn to create, mint, and transfer rune tokens on Bitcoin.",
    icon: Zap,
    difficulty: "Advanced",
    estimatedTime: "5-6 hours",
    lessonsCount: 15,
    comingSoon: true,
    color: {
      primary: "red-500",
      secondary: "from-red-500",
      accent: "to-red-600",
    },
  },
  {
    id: "scripts",
    name: "Bitcoin Scripts",
    description:
      "Deep dive into Bitcoin Script language. Learn to write custom scripts, understand opcodes, and build complex Bitcoin transactions.",
    icon: Cpu,
    difficulty: "Advanced",
    estimatedTime: "6-8 hours",
    lessonsCount: 20,
    comingSoon: true,
    color: {
      primary: "green-500",
      secondary: "from-green-500",
      accent: "to-green-600",
    },
  },
  {
    id: "taproot",
    name: "Taproot & Tapscript",
    description:
      "Explore Taproot's advanced features and Tapscript programming. Learn to build privacy-preserving and efficient Bitcoin applications.",
    icon: Database,
    difficulty: "Advanced",
    estimatedTime: "7-9 hours",
    lessonsCount: 18,
    comingSoon: true,
    color: {
      primary: "indigo-500",
      secondary: "from-indigo-500",
      accent: "to-indigo-600",
    },
  },
];

export default function ProtocolSelector() {
  const [protocolTracks, setProtocolTracks] = useState<ProtocolTrack[]>([]);
  const [progress, setProgress] = useState(protocolManager.getProgress());

  useEffect(() => {
    // Build protocol tracks with current progress
    const tracks = protocolDefinitions.map((def) => {
      const protocolProgress = protocolManager.getProtocolProgress(def.id);
      const unlockReqs = protocolManager.getUnlockRequirements(def.id);

      return {
        ...def,
        isUnlocked: protocolProgress?.isUnlocked || false,
        completedLessons: protocolProgress?.completedLessons || 0,
      };
    });

    setProtocolTracks(tracks);
  }, [progress]);

  const unlockedTracks = protocolTracks.filter((track) => track.isUnlocked);
  const lockedTracks = protocolTracks.filter((track) => !track.isUnlocked);

  const getUnlockHint = (protocolId: string): string => {
    const requirements = protocolManager.getUnlockRequirements(protocolId);

    if (requirements.requiredProtocols.length === 0) return "";

    const missingProtocols = requirements.requiredProtocols.filter((reqId) => {
      const protocol = protocolManager.getProtocolProgress(reqId);
      return !protocol || protocol.completedLessons < protocol.totalLessons;
    });

    if (missingProtocols.length > 0) {
      return `Complete ${missingProtocols.join(", ")} track${
        missingProtocols.length > 1 ? "s" : ""
      }`;
    }

    const remaining =
      requirements.requiredCompletedLessons - requirements.currentProgress;
    if (remaining > 0) {
      return `Complete ${remaining} more lesson${
        remaining > 1 ? "s" : ""
      } in required tracks`;
    }

    return "Requirements met - will unlock soon!";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-bitcoin-400 to-bitcoin-600 bg-clip-text text-transparent">
          Choose Your Learning Path
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Master Bitcoin and its ecosystem through hands-on programming. Start
          with Arch Network and unlock advanced metaprotocols as you progress.
        </p>
      </div>

      {/* Available Tracks */}
      {unlockedTracks.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-green-400">
            🚀 Available Now
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedTracks.map((track) => (
              <ProtocolTrackCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon / Locked Tracks */}
      {lockedTracks.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-400">
            🔮 Locked Tracks
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedTracks.map((track) => (
              <div key={track.id} className="relative">
                <ProtocolTrackCard track={track} />
                {/* Unlock hint */}
                <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-blue-400 mb-1">
                        Unlock Requirements:
                      </p>
                      <p className="text-xs text-gray-300">
                        {getUnlockHint(track.id)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <div className="mt-16 p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Your Learning Journey
        </h3>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-bitcoin-500 mb-2">
              {progress.globalProgress.unlockedProtocols.length}
            </div>
            <div className="text-sm text-gray-400">Tracks Unlocked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-500 mb-2">
              {progress.globalProgress.totalCompletedLessons}
            </div>
            <div className="text-sm text-gray-400">Lessons Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {progress.globalProgress.totalAvailableLessons}
            </div>
            <div className="text-sm text-gray-400">Lessons Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {Math.round(
                (progress.globalProgress.totalCompletedLessons /
                  progress.globalProgress.totalAvailableLessons) *
                  100
              ) || 0}
              %
            </div>
            <div className="text-sm text-gray-400">Overall Progress</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-bitcoin-500 to-bitcoin-600 transition-all duration-500"
              style={{
                width: `${
                  (progress.globalProgress.totalCompletedLessons /
                    progress.globalProgress.totalAvailableLessons) *
                    100 || 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { protocolDefinitions };
