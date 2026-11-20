import React, { useState } from 'react';
import { ArrowUpRight, Check, Code, Copy, Download, Eye, X } from 'lucide-react';
import { CLEAN_GITHUB_README_MARKDOWN } from '../data/profileData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeStudioModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'preview' | 'markdown'>('preview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(CLEAN_GITHUB_README_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([CLEAN_GITHUB_README_MARKDOWN], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[88vh] rounded-2xl bg-[#111114] border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-6 py-4 bg-[#0C0C0E] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-zinc-100">
              GitHub Profile README.md
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Clean Markdown formatted for <span className="text-zinc-300 font-medium">Seavik2142/Seavik2142</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-zinc-900 p-1 border border-zinc-800">
              <button
                onClick={() => setTab('preview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  tab === 'preview'
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setTab('markdown')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  tab === 'markdown'
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Markdown</span>
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors"
              title="Download README.md"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'markdown' ? (
            <div className="rounded-xl bg-[#0C0C0E] border border-zinc-800/80 p-5">
              <pre className="text-[13px] font-mono text-zinc-300 whitespace-pre-wrap leading-[1.7]">
                {CLEAN_GITHUB_README_MARKDOWN}
              </pre>
            </div>
          ) : (
            <div className="rounded-xl bg-[#0D1117] border border-zinc-800/90 p-6 sm:p-8 space-y-6 text-zinc-200">
              <div className="text-center pb-6 border-b border-zinc-800">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Mao Seavik
                </h1>
                <p className="text-sm text-zinc-300 font-medium mt-1.5">
                  Machine Learning Engineer & Backend Software Developer
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Phnom Penh, Cambodia · B.Sc. Computer Studies at Norton University
                </p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-white mb-2">
                  About
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  I am a Machine Learning Engineer and Software Developer specializing in{' '}
                  <strong className="text-white font-medium">open-source LLM fine-tuning</strong> (Qwen2.5, SFT, PEFT/LoRA, GGUF),{' '}
                  <strong className="text-white font-medium">Python backend services</strong> (FastAPI, Flask, PostgreSQL), and{' '}
                  <strong className="text-white font-medium">full-stack applications</strong> (TypeScript, React, Next.js, Flutter).
                </p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-white mb-3">
                  Published Language Models (Hugging Face)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-zinc-800">
                    <thead>
                      <tr className="bg-zinc-900/80 text-zinc-300">
                        <th className="p-3 border border-zinc-800 font-medium">Model</th>
                        <th className="p-3 border border-zinc-800 font-medium">Base Architecture</th>
                        <th className="p-3 border border-zinc-800 font-medium">Method</th>
                        <th className="p-3 border border-zinc-800 font-medium">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-zinc-300">
                      <tr>
                        <td className="p-3 font-medium text-white">agri-qwen3b-lora</td>
                        <td className="p-3 font-mono text-zinc-400">Qwen2.5-3B-Instruct</td>
                        <td className="p-3">SFT · TRL · LoRA</td>
                        <td className="p-3 text-zinc-400">Crop disease diagnosis & agricultural advisory</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">agrisystem-qwen2.5-3b-gguf</td>
                        <td className="p-3 font-mono text-zinc-400">Qwen2.5-3B-Instruct</td>
                        <td className="p-3">Quantized GGUF</td>
                        <td className="p-3 text-zinc-400">Low-latency CPU & edge inference</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">agrisystem-qwen2.5-3b-adapter</td>
                        <td className="p-3 font-mono text-zinc-400">Qwen2.5-3B-Instruct</td>
                        <td className="p-3">PEFT Adapter</td>
                        <td className="p-3 text-zinc-400">Symptom-to-treatment domain reasoning</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">agri-expert-adapter</td>
                        <td className="p-3 font-mono text-zinc-400">Qwen2.5-1.5B-Instruct</td>
                        <td className="p-3">PEFT · SafeTensors</td>
                        <td className="p-3 text-zinc-400">Lightweight conversational assistant</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0C0C0E] border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
          <span>
            Saved locally at <code className="text-zinc-200 font-mono">GITHUB_PROFILE_README.md</code>
          </span>
          <a
            href="https://github.com/Seavik2142/Seavik2142/edit/main/README.md"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-zinc-200 hover:text-white font-medium"
          >
            <span>Edit on GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
