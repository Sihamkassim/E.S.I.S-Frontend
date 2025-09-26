import React, { useCallback, useEffect } from 'react';

export interface MediaItem {
  id?: number | string;
  url: string;
  type: string; // IMAGE | VIDEO | mime
}

interface MediaLightboxProps {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNavigate?: (nextIndex: number) => void;
}

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_ESC = 27;

export const MediaLightbox: React.FC<MediaLightboxProps> = ({ items, index, onClose, onNavigate }) => {
  const item = items[index];

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.keyCode === KEY_ESC) onClose();
    if (e.keyCode === KEY_LEFT) onNavigate?.((index - 1 + items.length) % items.length);
    if (e.keyCode === KEY_RIGHT) onNavigate?.((index + 1) % items.length);
  }, [index, items.length, onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="flex items-center justify-between h-12 px-4 text-white text-sm">
        <span>{index + 1} / {items.length}</span>
        <button onClick={onClose} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Close</button>
      </div>
      <div className="flex-1 flex items-center justify-center select-none">
        {item.type.startsWith('video') || item.type === 'VIDEO' ? (
          <video src={item.url} controls className="max-h-full max-w-full" />
        ) : (
          <img src={item.url} alt={item.type} className="max-h-full max-w-full object-contain" />
        )}
      </div>
      {items.length > 1 && (
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={() => onNavigate?.((index - 1 + items.length) % items.length)}
            className="text-white/70 hover:text-white px-4 text-2xl"
            aria-label="Previous"
          >‹</button>
        </div>
      )}
      {items.length > 1 && (
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={() => onNavigate?.((index + 1) % items.length)}
            className="text-white/70 hover:text-white px-4 text-2xl"
            aria-label="Next"
          >›</button>
        </div>
      )}
      {items.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => onNavigate?.(i)}
              className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLightbox;
