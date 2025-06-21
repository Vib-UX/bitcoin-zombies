import Link from "next/link";
import { Lock, ArrowRight, CheckCircle } from "lucide-react";

export interface ProtocolTrack {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  lessonsCount: number;
  isUnlocked: boolean;
  comingSoon?: boolean;
  href?: string;
  completedLessons?: number;
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface ProtocolTrackCardProps {
  track: ProtocolTrack;
}

export default function ProtocolTrackCard({ track }: ProtocolTrackCardProps) {
  const isAccessible = track.isUnlocked && !track.comingSoon;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isAccessible && track.href) {
      return (
        <Link href={track.href} className="block group">
          {children}
        </Link>
      );
    }
    return <div className="group">{children}</div>;
  };

  return (
    <CardWrapper>
      <div
        className={`
          relative p-6 rounded-xl border-2 transition-all duration-300
          ${
            isAccessible
              ? `border-gray-700 hover:border-${track.color.primary} hover:shadow-lg hover:shadow-${track.color.primary}/20 cursor-pointer group-hover:scale-[1.02]`
              : "border-gray-800 opacity-60 cursor-not-allowed"
          }
          bg-gradient-to-br from-gray-900 to-gray-800
        `}
      >
        {/* Lock overlay for inaccessible tracks */}
        {!isAccessible && (
          <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Lock className="h-8 w-8 mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-500 font-medium">
                {track.comingSoon ? "Coming Soon" : "Locked"}
              </p>
            </div>
          </div>
        )}

        {/* Track Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${track.color.secondary} ${track.color.accent}`}
            >
              <track.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-bitcoin-400 transition-colors">
                {track.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs rounded font-medium ${
                    track.difficulty === "Beginner"
                      ? "bg-green-600 text-white"
                      : track.difficulty === "Intermediate"
                      ? "bg-yellow-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {track.difficulty}
                </span>
                <span className="px-2 py-1 text-xs bg-gray-600 text-white rounded">
                  {track.estimatedTime}
                </span>
              </div>
            </div>
          </div>

          {isAccessible && (
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-bitcoin-400 group-hover:translate-x-1 transition-all" />
          )}
        </div>

        {/* Track Description */}
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          {track.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>
              {track.completedLessons || 0}/{track.lessonsCount} lessons
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 bg-gradient-to-r ${track.color.secondary} ${track.color.accent}`}
              style={{
                width: `${
                  ((track.completedLessons || 0) / track.lessonsCount) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Track Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{track.lessonsCount} lessons</span>
          {track.completedLessons === track.lessonsCount && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="h-3 w-3" />
              <span>Completed</span>
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}
