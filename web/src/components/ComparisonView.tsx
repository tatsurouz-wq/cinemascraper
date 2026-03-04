"use client";

import { useState } from "react";
import type { Schedule, Movie, Screening } from "@/lib/types";
import { Timeline } from "./Timeline";
import { ShareButton } from "./ShareButton";
import { AREAS } from "@/lib/constants";

interface PanelData {
  schedule: Schedule | null;
  loading: boolean;
  error: string | null;
  areaId: string;
}

interface ComparisonViewProps {
  panels: PanelData[];
  commonMovies: string[];
}

export function ComparisonView({
  panels,
  commonMovies,
}: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState(0);
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

  const activePanels = panels.filter((p) => p.areaId);

  const renderPanel = (panel: PanelData) => {
    if (panel.loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      );
    }

    if (panel.error) {
      return (
        <div className="text-center py-8 text-red-400">
          <p className="text-sm">⚠️ {panel.error}</p>
        </div>
      );
    }

    if (!panel.schedule || panel.schedule.movies.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p className="text-2xl mb-2">📅</p>
          <p className="text-sm font-medium">スケジュール未公開</p>
          <p className="text-xs mt-1">公開され次第表示されます</p>
        </div>
      );
    }

    return (
      <Timeline
        schedule={panel.schedule}
        commonMovies={commonMovies}
        onScreeningSelect={(movie, screening) =>
          handleScreeningSelect(
            movie,
            screening,
            panel.schedule!.theater.name,
            panel.schedule!.date
          )
        }
      />
    );
  };

  const getAreaLabel = (areaId: string) => {
    const area = AREAS.find((a) => a.id === areaId);
    return area?.name || areaId;
  };

  if (activePanels.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>エリアと日付を選択してください</p>
      </div>
    );
  }

  return (
    <>
      {/* モバイル: タブ切替 */}
      <div className="lg:hidden">
        <div className="flex border-b dark:border-gray-700 mb-3 overflow-x-auto">
          {activePanels.map((panel, idx) => (
            <button
              key={panel.areaId}
              onClick={() => setActiveTab(idx)}
              className={`flex-shrink-0 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === idx
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-400"
              }`}
            >
              {getAreaLabel(panel.areaId)}
            </button>
          ))}
        </div>
        <div>{renderPanel(activePanels[activeTab] || activePanels[0])}</div>
      </div>

      {/* デスクトップ: 横スクロール N カラム */}
      <div className="hidden lg:block overflow-x-auto">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${activePanels.length}, minmax(220px, 1fr))`,
          }}
        >
          {activePanels.map((panel, idx) => (
            <div
              key={panel.areaId}
              className={`min-w-0 ${
                idx > 0 ? "border-l pl-3 dark:border-gray-700" : ""
              }`}
            >
              <h3 className="text-xs font-semibold text-gray-500 mb-2 text-center">
                {getAreaLabel(panel.areaId)}
              </h3>
              {renderPanel(panel)}
            </div>
          ))}
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
            🎬 全エリア共通上映中（{commonMovies.length}本）
          </p>
          <p className="text-xs text-blue-500/70">
            {commonMovies.join("、")}
          </p>
        </div>
      )}
    </>
  );
}
