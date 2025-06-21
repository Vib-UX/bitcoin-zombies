export interface Protocol {
  id: string;
  name: string;
  isUnlocked: boolean;
  completedLessons: number;
  totalLessons: number;
}

export interface UserProgress {
  protocols: Record<string, Protocol>;
  globalProgress: {
    totalCompletedLessons: number;
    totalAvailableLessons: number;
    unlockedProtocols: string[];
  };
}

// Unlock conditions for different protocols
export const PROTOCOL_UNLOCK_CONDITIONS = {
  arch: {
    requiredProtocols: [],
    requiredCompletedLessons: 0,
  },
  alkanes: {
    requiredProtocols: ["arch"],
    requiredCompletedLessons: 4, // Need to complete first 4 Arch lessons
  },
  ordinals: {
    requiredProtocols: ["arch"],
    requiredCompletedLessons: 3,
  },
  runes: {
    requiredProtocols: ["arch", "alkanes"],
    requiredCompletedLessons: 8,
  },
  scripts: {
    requiredProtocols: ["arch", "ordinals"],
    requiredCompletedLessons: 6,
  },
  taproot: {
    requiredProtocols: ["arch", "scripts"],
    requiredCompletedLessons: 12,
  },
};

export class ProtocolManager {
  private progress: UserProgress;

  constructor(initialProgress?: UserProgress) {
    this.progress = initialProgress || this.getDefaultProgress();
  }

  private getDefaultProgress(): UserProgress {
    return {
      protocols: {
        arch: {
          id: "arch",
          name: "Arch Network",
          isUnlocked: true,
          completedLessons: 0,
          totalLessons: 8,
        },
        alkanes: {
          id: "alkanes",
          name: "Alkanes Protocol",
          isUnlocked: false,
          completedLessons: 0,
          totalLessons: 12,
        },
        ordinals: {
          id: "ordinals",
          name: "Bitcoin Ordinals",
          isUnlocked: false,
          completedLessons: 0,
          totalLessons: 10,
        },
        runes: {
          id: "runes",
          name: "Bitcoin Runes",
          isUnlocked: false,
          completedLessons: 0,
          totalLessons: 15,
        },
        scripts: {
          id: "scripts",
          name: "Bitcoin Scripts",
          isUnlocked: false,
          completedLessons: 0,
          totalLessons: 20,
        },
        taproot: {
          id: "taproot",
          name: "Taproot & Tapscript",
          isUnlocked: false,
          completedLessons: 0,
          totalLessons: 18,
        },
      },
      globalProgress: {
        totalCompletedLessons: 0,
        totalAvailableLessons: 8, // Only Arch is available initially
        unlockedProtocols: ["arch"],
      },
    };
  }

  // Check if a protocol should be unlocked based on user progress
  public checkProtocolUnlock(protocolId: string): boolean {
    const conditions =
      PROTOCOL_UNLOCK_CONDITIONS[
        protocolId as keyof typeof PROTOCOL_UNLOCK_CONDITIONS
      ];
    if (!conditions) return false;

    // Check if all required protocols are completed
    for (const requiredProtocol of conditions.requiredProtocols) {
      const protocol = this.progress.protocols[requiredProtocol];
      if (!protocol || protocol.completedLessons < protocol.totalLessons) {
        return false;
      }
    }

    // Check if minimum lesson count is met across required protocols
    const totalCompletedInRequired = conditions.requiredProtocols.reduce(
      (sum, protocolId) => {
        return (
          sum + (this.progress.protocols[protocolId]?.completedLessons || 0)
        );
      },
      0
    );

    return totalCompletedInRequired >= conditions.requiredCompletedLessons;
  }

  // Mark a lesson as completed and update unlock status
  public completeLesson(protocolId: string, lessonId: number): UserProgress {
    const protocol = this.progress.protocols[protocolId];
    if (!protocol) return this.progress;

    // Update completed lessons (don't exceed total)
    protocol.completedLessons = Math.max(protocol.completedLessons, lessonId);

    // Check and unlock new protocols
    this.updateUnlockedProtocols();

    // Update global progress
    this.updateGlobalProgress();

    return this.progress;
  }

  private updateUnlockedProtocols(): void {
    Object.keys(this.progress.protocols).forEach((protocolId) => {
      if (!this.progress.protocols[protocolId].isUnlocked) {
        if (this.checkProtocolUnlock(protocolId)) {
          this.progress.protocols[protocolId].isUnlocked = true;
          this.progress.globalProgress.unlockedProtocols.push(protocolId);
        }
      }
    });
  }

  private updateGlobalProgress(): void {
    const protocols = Object.values(this.progress.protocols);

    this.progress.globalProgress.totalCompletedLessons = protocols.reduce(
      (sum, protocol) => sum + protocol.completedLessons,
      0
    );

    this.progress.globalProgress.totalAvailableLessons = protocols
      .filter((protocol) => protocol.isUnlocked)
      .reduce((sum, protocol) => sum + protocol.totalLessons, 0);

    this.progress.globalProgress.unlockedProtocols = protocols
      .filter((protocol) => protocol.isUnlocked)
      .map((protocol) => protocol.id);
  }

  // Get current progress
  public getProgress(): UserProgress {
    return this.progress;
  }

  // Get protocol-specific progress
  public getProtocolProgress(protocolId: string): Protocol | null {
    return this.progress.protocols[protocolId] || null;
  }

  // Save progress to localStorage
  public saveProgress(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "bitcoinZombiesProgress",
        JSON.stringify(this.progress)
      );
    }
  }

  // Load progress from localStorage
  public static loadProgress(): ProtocolManager {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bitcoinZombiesProgress");
      if (saved) {
        try {
          const progress = JSON.parse(saved) as UserProgress;
          return new ProtocolManager(progress);
        } catch (error) {
          console.error("Failed to load progress:", error);
        }
      }
    }
    return new ProtocolManager();
  }

  // Get unlock requirements for a protocol
  public getUnlockRequirements(protocolId: string): {
    requiredProtocols: string[];
    requiredCompletedLessons: number;
    currentProgress: number;
    isUnlockable: boolean;
  } {
    const conditions =
      PROTOCOL_UNLOCK_CONDITIONS[
        protocolId as keyof typeof PROTOCOL_UNLOCK_CONDITIONS
      ];
    if (!conditions) {
      return {
        requiredProtocols: [],
        requiredCompletedLessons: 0,
        currentProgress: 0,
        isUnlockable: false,
      };
    }

    const currentProgress = conditions.requiredProtocols.reduce(
      (sum, protocolId) => {
        return (
          sum + (this.progress.protocols[protocolId]?.completedLessons || 0)
        );
      },
      0
    );

    return {
      requiredProtocols: conditions.requiredProtocols,
      requiredCompletedLessons: conditions.requiredCompletedLessons,
      currentProgress,
      isUnlockable: this.checkProtocolUnlock(protocolId),
    };
  }
}

// Global instance for the app
export const protocolManager = ProtocolManager.loadProgress();
