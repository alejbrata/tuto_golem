import { useState, useEffect } from 'react';
import { PyodideProvider, usePyodide } from './engine/PyodideProvider';
import Terminal from './components/Terminal';
import CodeEditor from './components/CodeEditor';
import StoryCard from './components/StoryCard';
import CharacterCreator from './components/CharacterCreator';
import Golem from './components/Golem';
import chapter1 from './content/book1-chapter1.json';
import chapter2 from './content/book1-chapter2.json';
import chapter3 from './content/book1-chapter3.json';
import chapter4 from './content/book1-chapter4.json';
import chapter5 from './content/book2-chapter1.json'; // Book 2 Start
import chapter6 from './content/book2-chapter2.json';
import chapter7 from './content/book2-chapter3.json'; // Book 2 End
import chapter8 from './content/book3-chapter1.json'; // Book 3 Start
import chapter9 from './content/book3-chapter2.json';
import chapter10 from './content/book3-chapter3.json'; // Book 3 End
import chapter11 from './content/book4-chapter1.json'; // Book 4 Start
import chapter12 from './content/book4-chapter2.json';
import chapter13 from './content/book4-chapter3.json'; // Book 4 End (Finale)
import './index.css';

const CHAPTERS = [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10, chapter11, chapter12, chapter13];

import CampaignMap from './components/CampaignMap';

function Game({ dna, onExit }) {
  const { runPython, output, isLoading, pyodide } = usePyodide();
  const [showMap, setShowMap] = useState(false);

  // Persistence: Current Chapter
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    const saved = localStorage.getItem('golem_current_chapter');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Persistence: Track completed chapters to maintain Golem Stage
  const [completedChapters, setCompletedChapters] = useState(() => {
    const saved = localStorage.getItem('golem_completed_chapters');
    return saved ? JSON.parse(saved) : [];
  });

  const chapterContent = CHAPTERS[currentChapterIndex];

  const [code, setCode] = useState(chapterContent.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  // Persistence: Save Current Chapter ID whenever it changes
  useEffect(() => {
    localStorage.setItem('golem_current_chapter', currentChapterIndex.toString());
  }, [currentChapterIndex]);

  // Reset code and status when chapter changes
  useEffect(() => {
    // If chapter is already completed, maybe show solution or keep status null?
    // For now, reset to try again or practice.
    setCode(chapterContent.initialCode);
    setStatus(null);
  }, [currentChapterIndex]);

  // Save progress (Completed Chapters)
  useEffect(() => {
    localStorage.setItem('golem_completed_chapters', JSON.stringify(completedChapters));
  }, [completedChapters]);

  const handleRun = async () => {
    if (!pyodide || isRunning) return;
    setIsRunning(true);
    setStatus(null);

    try {
      // 1. Run User Code
      // This will throw if the user code has a syntax/runtime error
      await runPython(code);

      // 2. Run Validation Logic
      // Only proceed if user code didn't crash

      // Inject validation function
      await pyodide.runPythonAsync(chapterContent.validationCode);

      // Execute validation
      let result = await pyodide.runPythonAsync("validar_mision(globals())");
      let [success, message] = result.toJs();

      if (success) {
        setStatus('success');
        runPython(`print("\\n✨ SYSTEM: ${message}")`);

        // Mark chapter as complete if not already
        setCompletedChapters(prev => {
          if (!prev.includes(chapterContent.id)) {
            return [...prev, chapterContent.id];
          }
          return prev;
        });

      } else {
        setStatus('error');
        runPython(`print("\\n❌ SYSTEM: ${message}")`);
      }

    } catch (err) {
      console.error("Execution failed:", err);
      // Determine if it was a user code error or system error
      // runPython (from PyodideProvider) already adds the traceback to 'output'
      setStatus('error');
      // We don't need to print to terminal here because PyodideProvider does it
    } finally {
      setIsRunning(false);
    }
  };

  const nextChapter = () => {
    if (currentChapterIndex < CHAPTERS.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-cyan-400 font-mono animate-pulse">Summoning the Neural Forge...</p>
      </div>
    )
  }

  // Visual effects based on chapter
  // Calculate Golem Stage based on TOTAL completed chapters
  // This ensures evolution persists even if you revisit an old chapter
  const golemStage = completedChapters.length;
  // Specific visual for current chapter success
  const isChapterSuccess = status === 'success';
  const isChapter2Success = currentChapterIndex === 1 && isChapterSuccess; // Keep specific FX for Ch2 for now

  if (showMap) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4">
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-slate-950/90 backdrop-blur z-20 py-4 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">JOURNEY MAP</h1>
          <button onClick={() => setShowMap(false)} className="px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors">BACK TO FORGE</button>
        </header>
        <div className="max-w-md mx-auto">
          <CampaignMap
            chapters={CHAPTERS}
            currentChapterIndex={currentChapterIndex}
            completedChapters={completedChapters}
            onSelectChapter={(idx) => { setCurrentChapterIndex(idx); setShowMap(false); }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 transition-colors duration-1000 ${isChapter2Success ? 'shadow-[inset_0_0_100px_rgba(99,102,241,0.2)]' : ''}`}>
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur fixed top-0 w-full z-10 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">

          <button
            onClick={() => {
              if (window.confirm("Return to Soul Forge? Current progress is saved, but you will need to re-summon your Golem.")) {
                onExit();
              }
            }}
            className="mr-2 text-slate-500 hover:text-rose-400 transition-colors"
            title="Exit to Menu"
          >
            ⏏
          </button>

          {/* Golem Avatar */}
          <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900 overflow-hidden relative group cursor-help transition-all duration-500 hover:scale-110 hover:border-cyan-500/50">
            <Golem dna={dna} stage={golemStage} className="w-full h-full transform scale-150 translate-y-2 transition-all duration-1000" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-mono text-cyan-400">
              STG {golemStage}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
              THE NEURAL FORGE
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMap(true)}
            className="px-3 py-1 bg-indigo-900/50 text-indigo-300 border border-indigo-500/50 rounded hover:bg-indigo-800/50 transition-colors font-mono text-xs flex items-center gap-2"
          >
            <span>🗺️</span> MAP
          </button>

          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            {currentChapterIndex >= 4 ? 'BOOK 2' : 'BOOK 1'} • CHAP {currentChapterIndex >= 4 ? currentChapterIndex - 3 : currentChapterIndex + 1}/{CHAPTERS.length}
          </div>
          <div className="flex gap-1">
            <button
              onClick={prevChapter}
              disabled={currentChapterIndex === 0}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 transition-colors"
            >
              ◀
            </button>
            <button
              onClick={nextChapter}
              disabled={currentChapterIndex === CHAPTERS.length - 1}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 transition-colors"
            >
              ▶
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="pt-20 p-4 h-screen grid grid-cols-1 md:grid-cols-12 gap-4 max-w-7xl mx-auto">

        {/* Left Column: Story & Lore (4 cols) */}
        <div className="md:col-span-4 flex flex-col h-[calc(100vh-6rem)]">
          <StoryCard
            key={chapterContent.id} // Force re-render on chapter change to animate
            title={chapterContent.title}
            lore={chapterContent.lore}
            lesson={chapterContent.lesson}
            hints={chapterContent.hints}
            onSolve={() => setCode(chapterContent.solutionCode)}
          />
        </div>

        {/* Right Column: Editor & Terminal (8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-4 h-[calc(100vh-6rem)]">

          {/* Editor Area */}
          <div className={`flex-1 min-h-0 bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative group transition-colors duration-500 ${isChapter2Success ? 'border-indigo-500/50' : ''}`}>
            <CodeEditor
              code={code}
              onChange={setCode}
              runCode={handleRun}
              isRunning={isRunning}
            />

            {/* Success / Evolution Overlay */}
            {status === 'success' && (
              <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex items-center justify-center p-8 z-20 animate-in fade-in zoom-in duration-300">
                <div className="text-center relative">

                  {/* --- EVOLUTION ANIMATION CHECK --- */}
                  {/* If this chapter was just completed and triggered a stage up (Stage > 0) */}
                  {/* We can infer evolution if it is a success and we are checking the stage. 
                      Actually, let's just make the success screen more "Evolutionary" 
                      if we successfully completed the chapter.
                  */}

                  <div className="mb-6 relative">
                    {/* Golem Preview in Overlay */}
                    <div className="w-32 h-32 mx-auto relative">
                      <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping"></div>
                      <Golem dna={dna} stage={golemStage} className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                    </div>

                    {/* Ch4: Crystal Grid */}
                    {currentChapterIndex === 3 && (
                      <div className="absolute inset-x-0 -bottom-10 h-20 flex justify-center gap-2 opacity-50">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-4 h-8 bg-cyan-400/30 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                        ))}
                      </div>
                    )}

                    {/* Ch5: Laser Scanner */}
                    {currentChapterIndex === 4 && (
                      <div className="absolute inset-0 bg-red-500/10 z-0 animate-pulse">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_15px_red] animate-[scan_2s_linear_infinite]"></div>
                      </div>
                    )}

                    {/* Ch6: Audio Waveform */}
                    {currentChapterIndex === 5 && (
                      <div className="absolute inset-x-0 bottom-0 h-20 flex justify-center items-end gap-1 opacity-50 z-0">
                        {[...Array(15)].map((_, i) => (
                          <div key={i} className="w-1.5 bg-cyan-400/60 rounded-t-full animate-[pulse_0.5s_infinite]" style={{ height: `${Math.random() * 40 + 10}px`, animationDelay: `${i * 0.05}s` }}></div>
                        ))}
                      </div>
                    )}

                    {/* Ch7: Timeline Effect */}
                    {currentChapterIndex === 6 && (
                      <div className="absolute inset-x-0 bottom-10 px-8 opacity-70 z-0">
                        <div className="h-1 bg-slate-700 w-full relative rounded overflow-hidden">
                          <div className="absolute inset-y-0 left-0 bg-amber-400 w-1/2 animate-[width_2s_ease-in-out_infinite]"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-mono text-amber-500/80">
                          <span>00:00</span>
                          <span>00:15</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-6xl mb-4 relative z-10">
                    {currentChapterIndex === 0 && '👁️'}
                    {currentChapterIndex === 1 && '🔮'}
                    {currentChapterIndex === 2 && '🧠'}
                    {currentChapterIndex === 3 && '💎'}
                  </div>

                  <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent animate-pulse">
                    {currentChapterIndex === 0 && 'GOLEM AWAKENED'}
                    {currentChapterIndex === 1 && 'GOLEM EVOLVED'}
                    {currentChapterIndex === 2 && 'GOLEM ENLIGHTENED'}
                    {currentChapterIndex === 3 && 'GOLEM ORGANIZED'}
                  </h3>

                  <p className="text-emerald-200/80 mb-6 font-mono text-sm">
                    {currentChapterIndex === 0 && 'The construct opens its eyes. It perceives DATA.'}
                    {currentChapterIndex === 1 && 'The construct defies gravity. It perceives MEANING.'}
                    {currentChapterIndex === 2 && 'The Third Eye opens. It perceives CONNECTION.'}
                    {currentChapterIndex === 3 && 'The Crystal Archive forms. It perceives ORDER.'}
                  </p>

                  {/* Next Chapter Button if not last */}
                  {currentChapterIndex < CHAPTERS.length - 1 && (
                    <button
                      onClick={() => { setStatus(null); nextChapter(); }}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
                    >
                      CONTINUE JOURNEY ▶
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Terminal Area */}
          <div className="h-1/3 min-h-[150px]">
            <Terminal output={output} />
          </div>
        </div>

      </main>
    </div>
  );
}

function App() {
  const [dna, setDna] = useState(() => localStorage.getItem('golem_dna'));

  const handleCharacterCreated = (newDna) => {
    localStorage.setItem('golem_dna', newDna);
    setDna(newDna);
  };

  const handleExit = () => {
    // Clear persistence to allow new character creation
    localStorage.removeItem('golem_dna');
    setDna(null);
    // We do NOT clear completed_chapters so the 'player' (browser) retains knowledge/lore, 
    // but the specific Golem is reset. 
    // If user wants full wipe, they can manually clear, or we can add a 'Reset All' button later.
  };

  if (!dna) {
    return <CharacterCreator onComplete={handleCharacterCreated} />;
  }

  return (
    <PyodideProvider>
      <Game dna={dna} onExit={handleExit} />
    </PyodideProvider>
  );
}

export default App;
