import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';

const WEEKS = 52;
const DAYS = 7;

function generateGrid(): number[][] {
  const grid: number[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const col: number[] = [];
    for (let d = 0; d < DAYS; d++) {
      const seed = Math.sin(w * 12.9898 + d * 78.233) * 43758.5453;
      const rand = seed - Math.floor(seed);
      const recencyBoost = w > 30 ? 0.22 : w > 15 ? 0.1 : 0;
      const val = rand + recencyBoost;
      if (val > 0.88) col.push(4);
      else if (val > 0.72) col.push(3);
      else if (val > 0.52) col.push(2);
      else if (val > 0.34) col.push(1);
      else col.push(0);
    }
    grid.push(col);
  }
  return grid;
}

const LEVEL_COLORS: Record<number, string> = {
  0: '#18181B',
  1: '#064E3B',
  2: '#047857',
  3: '#10B981',
  4: '#34D399',
};

export const InteractiveSnakeCard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'interactive' | 'github-svg' | 'analytics'>('interactive');
  const [isPlaying, setIsPlaying] = useState(true);
  const [step, setStep] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<{ w: number; d: number; level: number } | null>(null);

  const initialGrid = useMemo(() => generateGrid(), []);

  const path = useMemo(() => {
    const pts: { w: number; d: number }[] = [];
    for (let w = 0; w < WEEKS; w++) {
      if (w % 2 === 0) {
        for (let d = 0; d < DAYS; d++) pts.push({ w, d });
      } else {
        for (let d = DAYS - 1; d >= 0; d--) pts.push({ w, d });
      }
    }
    return pts;
  }, []);

  useEffect(() => {
    if (!isPlaying || viewMode !== 'interactive') return;
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % path.length);
    }, 60);
    return () => clearInterval(timer);
  }, [isPlaying, viewMode, path.length]);

  const snakeLength = 16;
  const snakePositions = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 0; i < snakeLength; i++) {
      const idx = (step - i + path.length) % path.length;
      const pt = path[idx];
      map.set(`${pt.w}-${pt.d}`, i);
    }
    return map;
  }, [step, path]);

  return (
    <div className="surface-card rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-50 tracking-tight">
            Contribution Activity
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Annual commit history, contribution snake animation, and language analytics across public repositories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg bg-zinc-900 p-1 border border-zinc-800">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'interactive'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Contribution Grid
            </button>
            <button
              onClick={() => setViewMode('github-svg')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'github-svg'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              GitHub Snake SVG
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'analytics'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Analytics Cards
            </button>
          </div>

          {viewMode === 'interactive' && (
            <button
              onClick={() => setIsPlaying((p) => !p)}
              title={isPlaying ? 'Pause animation' : 'Resume animation'}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {viewMode === 'interactive' && (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[720px] bg-[#0C0C0E] border border-zinc-800/80 rounded-xl p-5">
              <svg
                viewBox={`0 0 ${WEEKS * 14 + 10} ${DAYS * 14 + 10}`}
                className="w-full h-auto select-none"
                role="img"
                aria-label="GitHub Contribution Grid"
              >
                {initialGrid.map((col, w) =>
                  col.map((level, d) => {
                    const key = `${w}-${d}`;
                    const snakeIdx = snakePositions.get(key);
                    const isSnakeHead = snakeIdx === 0;
                    const isSnakeBody = snakeIdx !== undefined && snakeIdx > 0;

                    let fill = LEVEL_COLORS[level];
                    if (isSnakeHead) {
                      fill = '#FAFAFA';
                    } else if (isSnakeBody) {
                      fill = '#A1A1AA';
                    }

                    return (
                      <rect
                        key={key}
                        x={w * 14 + 5}
                        y={d * 14 + 5}
                        width={11}
                        height={11}
                        rx={2.5}
                        fill={fill}
                        className="transition-colors duration-75 cursor-pointer"
                        onMouseEnter={() => setHoveredCell({ w, d, level })}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    );
                  })
                )}
              </svg>

              <div className="mt-4 pt-3 border-t border-zinc-800/70 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                <div>
                  {hoveredCell ? (
                    <span>
                      Week {hoveredCell.w + 1}, Day {hoveredCell.d + 1} —{' '}
                      <strong className="text-zinc-200 font-medium">
                        {hoveredCell.level * 2} contributions
                      </strong>
                    </span>
                  ) : (
                    <span>Hover over any square to inspect daily contribution activity</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((lvl) => (
                    <span
                      key={lvl}
                      className="w-3 h-3 rounded-[3px] inline-block"
                      style={{ backgroundColor: LEVEL_COLORS[lvl] }}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'github-svg' && (
          <div className="bg-[#0C0C0E] border border-zinc-800/80 rounded-xl p-5 space-y-3">
            <img
              src="https://raw.githubusercontent.com/Seavik2142/Seavik2142/output/github-snake-dark.svg"
              alt="Seavik2142 GitHub Contribution Snake"
              className="w-full h-auto rounded-lg"
            />
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/70">
              <span>Generated automatically by GitHub Actions on Seavik2142/Seavik2142</span>
              <a
                href="https://github.com/Seavik2142/Seavik2142/blob/main/.github/workflows/main.yml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-zinc-200 hover:text-white font-medium"
              >
                <span>View workflow</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {viewMode === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0C0C0E] border border-zinc-800/80 rounded-xl p-4 flex items-center justify-center">
                <img
                  src="https://raw.githubusercontent.com/Seavik2142/Seavik2142/main/profile-summary-card-output/tokyonight/1-repos-per-language.svg"
                  alt="Repos Per Language"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="bg-[#0C0C0E] border border-zinc-800/80 rounded-xl p-4 flex items-center justify-center">
                <img
                  src="https://raw.githubusercontent.com/Seavik2142/Seavik2142/main/profile-summary-card-output/tokyonight/4-productive-time.svg"
                  alt="Productive Time"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
            <div className="bg-[#0C0C0E] border border-zinc-800/80 rounded-xl p-4">
              <img
                src="https://raw.githubusercontent.com/Seavik2142/Seavik2142/main/profile-summary-card-output/tokyonight/0-profile-details.svg"
                alt="Profile Summary Details"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
