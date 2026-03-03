"use client";

import { useState } from "react";
import type { Schedule, Movie, Screening } from "@/lib/types";
import { Timeline } from "./Timeline";
import { ShareButton } from "./ShareButton";

interface ComparisonViewProps {
  leftSchedule: Schedule | null;
  rightSchedule: Schedule | null;
  commonMovies: string[];
  leftLoading?: boolean;
  rightLoading?: boolean;
  leftError?: string | null;
  rightError?: string | null;
}

export function ComparisonView({
  leftSchedule,
  rightSchedule,
  commonMovies,
  leftLoading,
  rightLoading,
  leftError,
  rightError,
}: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<"left" | "right">("left");
  const [shareData, setShareData] = useState<{
    movie: Movie;
    screening: Screening;
    theaterName: string;
    date: string;
  } | null>(null);

  const handleScreeningSelect = (
    movie: Movie,
    screening: Screening,
    theaterName: string,
    date: string
  ) => {
    setShareData({ movie, screening, theaterName, date });
  };

  const renderPanel = (
    schedule: Schedule | null,
    loading?: boolean,
    error?: string | null
  ) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-400">
          <p className="text-sm">⚠️ {error}</p>
        </div>
      );
    }

    if (!schedule) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">エリアと日付を選択してください</p>
        </div>
      );
    }

    return (
      <Timeline
        schedule={schedule}
        commonMovies={commonMovies}
        onScreeningSelect={(movie, screening) =>
          handleScreeningSelect(
            movie,
            screening,
            schedule.theater.name,
            schedule.date
          )
        }
      />
    );
  };

  return (
    <>
      {/* モバイル: タブ切替 */}
      <div className="sm:hidden">
        <div className="flex border-b dark:border-gray-700 mb-3">
          <button
            onClick={() => setActiveTab("left")}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "left"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400"
            }`}
          >
            {leftSchedule?.theater.area || "エリア1"}
          </button>
          <button
            onClick={() => setActiveTab("right")}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "right"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400"
            }`}
          >
            {rightSchedule?.theater.area || "エリア2"}
          </button>
        </div>
        <div>
          {activeTab === "left"
            ? renderPanel(leftSchedule, leftLoading, leftError)
            : renderPanel(rightSchedule, rightLoading, rightError)}
        </div>
      </div>

      {/* デスクトップ: 横並び */}
      <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4">
        <div className="min-w-0">
          {renderPanel(leftSchedule, leftLoading, leftError)}
        </div>
        <div className="min-w-0 border-l pl-4 dark:border-gray-700">
          {renderPanel(rightSchedule, rightLoading, rightError)}
        </div>
      </div>

      {/* 共有モーダル */}
      {shareData && (
        <ShareButton
          movie={shareData.movie}
          screening={shareData.screening}
          theaterName={shareData.theaterName}
          date={shareData.date}
          onClose={() => setShareData(null)}
        />
      )}

      {/* 共通映画インジケーター */}
      {commonMovies.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
            🎬 両エリアで上映中（{commonMovies.length}本）
          </p>
          <p className="text-xs text-blue-500/70">
            {commonMovies.join("、")}
          </p>
        </div>
      )}
    </>
  );
}
