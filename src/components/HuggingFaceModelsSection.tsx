import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { HUGGING_FACE_MODELS, HuggingFaceModel } from '../data/profileData';

interface Props {
  liveDownloads?: Record<string, number>;
}

export const HuggingFaceModelsSection: React.FC<Props> = ({ liveDownloads = {} }) => {
  const [selectedModel, setSelectedModel] = useState<HuggingFaceModel>(HUGGING_FACE_MODELS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="surface-card rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-50 tracking-tight">
            Published Language Models
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Open-source Qwen2.5 fine-tuned adapters and quantized GGUF weights hosted on Hugging Face (@Maoseavik).
          </p>
        </div>

        <a
          href="https://huggingface.co/Maoseavik"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-sm font-medium transition-colors self-start sm:self-auto shrink-0"
        >
          <span>Hugging Face Profile</span>
          <ArrowUpRight className="w-4 h-4 text-zinc-400" />
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Model Selection List */}
        <div className="lg:col-span-6 space-y-3">
          {HUGGING_FACE_MODELS.map((model) => {
            const isSelected = selectedModel.id === model.id;
            const dlCount = liveDownloads[model.id] ?? model.downloads;

            return (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`rounded-xl p-5 cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-zinc-900/90 border-zinc-600 shadow-sm'
                    : 'surface-subcard hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-zinc-100">
                        {model.name}
                      </h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-zinc-800/90 text-zinc-300 border border-zinc-700/70">
                        {model.method}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Base architecture: <span className="text-zinc-300 font-medium">{model.baseModel}</span>
                    </p>
                  </div>

                  <a
                    href={model.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-zinc-400 hover:text-zinc-100 p-1 rounded-md hover:bg-zinc-800 transition-colors"
                    title="Open Model on Hugging Face"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                  {model.description}
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex flex-wrap gap-1.5">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-zinc-400 shrink-0 ml-2">
                    {dlCount} downloads
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Clean Code Viewer */}
        <div className="lg:col-span-6 rounded-xl bg-[#0C0C0E] border border-zinc-800/90 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="px-4 py-3 bg-zinc-900/70 border-b border-zinc-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-medium text-zinc-400">Python Inference</span>
                <span className="text-zinc-600">·</span>
                <span className="text-xs font-mono text-zinc-200 truncate">
                  {selectedModel.id}
                </span>
              </div>

              <button
                onClick={() => handleCopy(selectedModel.codeSnippet, selectedModel.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors shrink-0"
              >
                {copiedId === selectedModel.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 overflow-x-auto">
              <pre className="text-[13px] font-mono leading-[1.7] text-zinc-300">
                <code>{selectedModel.codeSnippet}</code>
              </pre>
            </div>
          </div>

          <div className="px-5 py-3.5 bg-zinc-900/40 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Format: <strong className="text-zinc-200 font-medium">{selectedModel.format}</strong>
            </span>
            <a
              href={selectedModel.url}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-200 hover:text-white inline-flex items-center gap-1 font-medium"
            >
              <span>View on Hugging Face</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
