
import React from 'react';
import { GroundingChunk } from '../types';

interface Props {
  chunks: GroundingChunk[];
}

export const GroundingResults: React.FC<Props> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-700">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        Grounding Sources
      </h4>
      <div className="flex flex-wrap gap-2">
        {chunks.map((chunk, idx) => {
          const title = chunk.maps?.title || chunk.web?.title || "Unknown Source";
          const uri = chunk.maps?.uri || chunk.web?.uri;

          if (!uri) return null;

          return (
            <a
              key={idx}
              href={uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full text-xs text-cyan-400 transition-colors"
            >
              <span>{title}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
};
