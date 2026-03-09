'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, Folder, File, X } from 'lucide-react';
import { useSearch } from '@/hooks/useFiles';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  onFolderClick: (id: string) => void;
}

export default function SearchBar({ onFolderClick }: Props) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { t } = useTheme();
  const search = useSearch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 1) {
        await search.mutateAsync(query.trim());
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const results = search.data;
  const hasResults = results && (results.files?.length > 0 || results.folders?.length > 0);

  return (
    <div ref={ref} className="relative w-72">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${t.input}`}>
        <Search size={15} className={t.textSub} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search files & folders..."
          className={`bg-transparent text-sm outline-none flex-1 ${t.text}`}
        />
        {query && (
          <button onClick={() => { setQuery(''); setShowResults(false); }}>
            <X size={14} className={t.textSub} />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div className={`absolute top-12 left-0 right-0 rounded-2xl border shadow-xl z-50 overflow-hidden ${t.sidebar.split(' ')[0]} ${t.border}`}>
          {search.isPending && (
            <div className={`px-4 py-3 text-sm ${t.textSub}`}>Searching...</div>
          )}

          {!search.isPending && !hasResults && (
            <div className={`px-4 py-3 text-sm ${t.textSub}`}>No results for "{query}"</div>
          )}

          {!search.isPending && hasResults && (
            <>
              {results.folders?.length > 0 && (
                <div>
                  <p className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${t.textSub} ${t.accentBg}`}>
                    Folders
                  </p>
                  {results.folders.map((folder: any) => (
                    <button key={folder.id}
                      onClick={() => { onFolderClick(folder.id); setShowResults(false); setQuery(''); }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-left ${t.hover} transition`}>
                      <Folder size={16} className={t.accentText} />
                      <span className={`text-sm ${t.text}`}>{folder.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.files?.length > 0 && (
                <div>
                  <p className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${t.textSub} ${t.accentBg}`}>
                    Files
                  </p>
                  {results.files.map((file: any) => (
                    <div key={file.id}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 ${t.hover} transition`}>
                      <File size={16} className={t.accentText} />
                      <div>
                        <p className={`text-sm ${t.text}`}>{file.name}</p>
                        <p className={`text-xs ${t.textSub}`}>
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}