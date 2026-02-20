import { useState, useEffect } from 'react';
import { PyodideProvider, usePyodide } from './engine/PyodideProvider';
import Terminal from './components/Terminal';
import CodeEditor from './components/CodeEditor';
import StoryCard from './components/StoryCard';
import CharacterCreator from './components/CharacterCreator';
import Golem from './components/Golem';
import chapter0 from './content/book1-chapter0.json';
import chapter1 from './content/book1-chapter1.json';
import chapter2 from './content/book1-chapter2.json';
import chapter3 from './content/book1-chapter3.json';
import chapter4 from './content/book1-chapter4.json';
import chapter5 from './content/book2-chapter1.json';
import chapter6 from './content/book2-chapter2.json';
import chapter7 from './content/book2-chapter3.json';
import chapter8 from './content/book3-chapter1.json';
import chapter9 from './content/book3-chapter2.json';
import chapter10 from './content/book3-chapter3.json';
import chapter11 from './content/book4-chapter1.json';
import chapter12 from './content/book4-chapter2.json';
import chapter13 from './content/book4-chapter3.json';
import chapter14 from './content/book5-chapter1.json';
import chapter15 from './content/book5-chapter2.json';
import chapter16 from './content/book5-chapter3.json';
import chapter17 from './content/book5-chapter4.json';
import chapter18 from './content/book5-chapter5.json';
import chapter19 from './content/book5-chapter6.json';
import chapter20 from './content/book5-chapter7.json';
import './index.css';
import { UI_TEXT, GOLEM_PARTS_I18N } from './translations';

const CHAPTERS = [chapter0, chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10, chapter11, chapter12, chapter13, chapter14, chapter15, chapter16, chapter17, chapter18, chapter19, chapter20];

import CampaignMap from './components/CampaignMap';
import IntroScreen from './components/IntroScreen';

function Game({ dna, onExit }) {
  const { runPython, output, isLoading, pyodide, clearOutput, error: pyodideError } = usePyodide();
  const [showMap, setShowMap] = useState(false);
  const [showBookTransition, setShowBookTransition] = useState(false);

  // Persistence: Language (Default 'es' if not set, or user preference)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('golem_language') || 'es';
  });

  // Save Language Persistence
  useEffect(() => {
    localStorage.setItem('golem_language', language);
  }, [language]);

  const TEXT = UI_TEXT[language];
  const GOLEM_PARTS = GOLEM_PARTS_I18N[language];

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

  // Intro Screen Logic
  const [showIntro, setShowIntro] = useState(() => {
    const hasSeen = localStorage.getItem('golem_intro_seen');
    // Show if chapter 0 and not seen yet
    return !hasSeen && currentChapterIndex === 0;
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('golem_intro_seen', 'true');
  };

  const chapterContentRaw = CHAPTERS[currentChapterIndex];
  // Helper to get stylized chapter content based on language
  // Fallback to raw if logic not yet implemented in JSONs
  const chapterContent = {
    ...chapterContentRaw,
    title: chapterContentRaw[language]?.title || chapterContentRaw.title,
    lore: chapterContentRaw[language]?.lore || chapterContentRaw.lore,
    lesson: chapterContentRaw[language]?.lesson || chapterContentRaw.lesson,
    hints: chapterContentRaw[language]?.hints || chapterContentRaw.hints,
    initialCode: chapterContentRaw[language]?.initialCode || chapterContentRaw.initialCode || "",
    solutionCode: chapterContentRaw[language]?.solutionCode || chapterContentRaw.solutionCode || ""
  };

  const [code, setCode] = useState(chapterContent.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [isSuccessPending, setIsSuccessPending] = useState(false); // NEW: Waiting for user to click Continue

  const getBookInfo = (chapterIdx) => {
    // Advanced: Book 5 (Index 14+) - "Agency Awakening"
    if (chapterIdx >= 14) return {
      id: 5,
      title: TEXT.book5_title || TEXT.advanced_section || "AGENCY AWAKENING",
      color: 'from-fuchsia-600 to-pink-600',
      text: 'fuchsia-100',
      bg: 'bg-slate-950',
      accent: 'fuchsia',
      experimental: true // Flag for warning UI
    };

    if (chapterIdx <= 4) return { id: 1, title: TEXT.book1_title, color: 'from-cyan-500 to-blue-600', text: 'slate-200', bg: 'bg-slate-950', accent: 'cyan' }; // Ch 0-4 (5 chapters)
    if (chapterIdx <= 7) return { id: 2, title: TEXT.book2_title, color: 'from-emerald-500 to-teal-600', text: 'emerald-100', bg: 'bg-emerald-950', accent: 'emerald' }; // Ch 5-7 (3 chapters)
    if (chapterIdx <= 10) return { id: 3, title: TEXT.book3_title, color: 'from-amber-500 to-orange-600', text: 'amber-100', bg: 'bg-slate-900', accent: 'amber' }; // Ch 8-10 (3 chapters)
    return { id: 4, title: TEXT.book4_title, color: 'from-violet-500 to-purple-600', text: 'violet-100', bg: 'bg-indigo-950', accent: 'violet' }; // Ch 11-13 (3 chapters)
  };

  const currentBook = getBookInfo(currentChapterIndex);

  // Persistence: Save Current Chapter ID whenever it changes
  useEffect(() => {
    localStorage.setItem('golem_current_chapter', currentChapterIndex.toString());
  }, [currentChapterIndex]);

  // Reset code, status AND CONSOLE when chapter changes
  useEffect(() => {
    // When changing chapters, load the code for the CURRENT language
    const content = CHAPTERS[currentChapterIndex];
    const newCode = content[language]?.initialCode || content.initialCode;
    setCode(newCode);

    setStatus(null);
    setIsSuccessPending(false); // Reset pending state
    if (clearOutput) clearOutput(); // Clear console on chapter change
  }, [currentChapterIndex, language, clearOutput]);
  // Added 'language' and 'clearOutput' dependency so code comments update and console clears correctly

  // Save progress (Completed Chapters)
  useEffect(() => {
    localStorage.setItem('golem_completed_chapters', JSON.stringify(completedChapters));
  }, [completedChapters]);

  const handleRun = async () => {
    if (!pyodide || isRunning) return;
    setIsRunning(true);
    setStatus(null);
    setIsSuccessPending(false);

    try {
      if (clearOutput) clearOutput(); // Clear previous run
      await runPython(`print("🔮 Casting Spell...")`); // Immediate feedback
      await runPython(code);
      await pyodide.runPythonAsync(chapterContent.validationCode);

      // Execute validation
      let result = await pyodide.runPythonAsync("validar_mision(globals())");
      let [success, message] = result.toJs();

      if (success) {
        runPython(`print("\\n✨ SYSTEM: ${message}")`);

        // Wait for user manual advance
        setIsSuccessPending(true);

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
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleManualContinue = () => {
    setIsSuccessPending(false);
    setStatus('success'); // Shows the overlay
  };

  const nextChapter = () => {
    // Check for Book Transition
    const nextIdx = currentChapterIndex + 1;
    if (nextIdx >= CHAPTERS.length) return;

    const nextBook = getBookInfo(nextIdx);

    if (nextBook.id > currentBook.id) {
      setShowBookTransition(true);
    } else {
      if (currentChapterIndex < CHAPTERS.length - 1) {
        setCurrentChapterIndex(prev => prev + 1);
      }
    }
  };

  const proceedToNextBook = () => {
    setShowBookTransition(false);
    setCurrentChapterIndex(prev => prev + 1);
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  };

  // HARD RESET FUNCTION
  const handleHardReset = () => {
    if (window.confirm(TEXT.reset_confirm)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Error Screen
  if (pyodideError) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center flex-col gap-4 p-8 text-center">
        <div className="w-16 h-16 text-rose-500 mb-4">
          {/* Error Icon */}
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-rose-500">Neural Connect Failure</h1>
        <p className="text-slate-400 max-w-md">The magical link to the Pyodide Engine could not be established. Check your internet connection (CDN required) or firewall.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors">
          RETRY CONNECTION
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-cyan-400 font-mono animate-pulse">Summoning the Neural Forge...</p>
      </div>
    )
  }

  // Visual effects based on chapter
  const golemStage = completedChapters.length;
  // Calculate max ID unlocked. 
  // If completedChapters.length is 0, we can play index 0.
  // If completedChapters.length is 1, we can play index 1.
  const isNextDisabled = currentChapterIndex >= completedChapters.length;


  if (showIntro) {
    return <IntroScreen onComplete={handleIntroComplete} language={language} setLanguage={setLanguage} />;
  }

  if (showBookTransition) {
    const nextBook = getBookInfo(currentChapterIndex + 1);
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-1000 bg-black`}>
        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${nextBook.color}`}></div>
        <h1 className="text-6xl font-bold mb-4 text-white relative z-10">{TEXT.book_completed}</h1>
        <div className="w-32 h-1 bg-white mb-8 relative z-10"></div>
        <p className="text-xl text-slate-300 mb-12 max-w-2xl relative z-10">
          {TEXT.mastered_arts} <strong>{currentBook.title}</strong>.
          <br />
          {TEXT.before_evolves}
          <br />
          {TEXT.prepare_for}: <strong className={`text-${nextBook.accent}-400`}>{nextBook.title}</strong>.
        </p>
        <button
          onClick={proceedToNextBook}
          className={`px-8 py-4 bg-gradient-to-r ${nextBook.color} text-white font-bold rounded-xl text-xl shadow-lg hover:scale-105 transition-transform relative z-10`}
        >
          {TEXT.enter_book} {nextBook.id}
        </button>
      </div>
    )
  }

  if (showMap) {
    return (
      <div className={`min-h-screen ${currentBook.bg} text-slate-200 font-sans p-4`}>
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-slate-950/90 backdrop-blur z-20 py-4 border-b border-slate-800">
          <h1 className={`text-xl font-bold bg-gradient-to-r ${currentBook.color} bg-clip-text text-transparent`}>{TEXT.journey_map}</h1>
          <button onClick={() => setShowMap(false)} className="px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors">{TEXT.back_to_forge}</button>
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

  // Determine border color based on book accent
  const borderClass = `border-${currentBook.accent}-500/30`;
  const textAccent = `text-${currentBook.accent}-400`;

  return (
    <div className={`min-h-screen ${currentBook.bg} text-slate-200 font-sans selection:bg-${currentBook.accent}-500/30 transition-colors duration-1000`}>
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur fixed top-0 w-full z-10 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">

          {/* EXIT / RESET GROUP */}
          <div className="flex flex-col gap-0.5 mr-2">
            <button
              onClick={() => {
                if (window.confirm(TEXT.exit_confirm)) {
                  onExit();
                }
              }}
              className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-wider font-bold"
              title="Exit to Menu"
            >
              {TEXT.exit}
            </button>
            <button
              onClick={handleHardReset}
              className="text-[10px] text-rose-900 hover:text-rose-500 transition-colors uppercase tracking-widest"
              title="Wipe Save"
            >
              {TEXT.reset}
            </button>
          </div>


          {/* Golem Avatar */}
          <div className={`w-10 h-10 rounded-full border ${borderClass} bg-black/40 overflow-hidden relative group cursor-help transition-all duration-500 hover:scale-110`}>
            <Golem dna={dna} stage={golemStage} className="w-full h-full transform scale-150 translate-y-2 transition-all duration-1000" />
            <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-mono ${textAccent}`}>
              STG {golemStage}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h1 className={`font-bold text-lg tracking-tight bg-gradient-to-r ${currentBook.color} bg-clip-text text-transparent hidden sm:block`}>
              {TEXT.app_title}
            </h1>
          </div>
        </div>

        {/* Chapter Title Banner (Top Center) - Mobile hidden, visible on tablet+ */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{TEXT.book_label} {currentBook.id}: {currentBook.title}</span>
          <span className="text-sm font-bold text-white/80">{chapterContent.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMap(true)}
            className={`px-3 py-1 bg-${currentBook.accent}-900/50 text-${currentBook.accent}-300 border border-${currentBook.accent}-500/50 rounded hover:bg-${currentBook.accent}-800/50 transition-colors font-mono text-xs flex items-center gap-2`}
          >
            <span>🗺️</span> {TEXT.map_button}
          </button>

          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            {TEXT.chap_label} {currentChapterIndex}/{CHAPTERS.length - 1}
          </div>
          <div className="flex gap-1">
            <button
              onClick={prevChapter}
              disabled={currentChapterIndex === 0}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 transition-colors"
            >
              ◀
            </button>
            <button
              onClick={nextChapter}
              disabled={isNextDisabled}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 transition-colors"
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
            key={chapterContent.id}
            title={chapterContent.title}
            lore={chapterContent.lore}
            lesson={chapterContent.lesson}
            hints={chapterContent.hints}
            onSolve={() => setCode(chapterContent.solutionCode)}
            accentColor={currentBook.accent} // Pass accent color to StoryCard
            text={TEXT}
          />
        </div>

        {/* Right Column: Editor & Terminal (8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-4 h-[calc(100vh-6rem)]">

          {/* Editor Area */}
          <div className={`flex-1 min-h-0 bg-slate-900 rounded-xl border ${borderClass} shadow-xl overflow-hidden relative group transition-colors duration-500`}>
            <CodeEditor
              code={code}
              onChange={setCode}
              runCode={handleRun}
              isRunning={isRunning}
              isSuccessPending={isSuccessPending}
              onContinue={handleManualContinue}
              text={TEXT}
            />

            {/* Success / Evolution Overlay */}
            {status === 'success' && (
              <div className="fixed inset-0 bg-emerald-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                {/* Scrollable Wrapper */}
                <div className="w-full h-full overflow-y-auto custom-scrollbar p-4 flex items-center justify-center">

                  {/* Card Container */}
                  <div className="relative w-full max-w-md md:max-w-lg bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col shrink-0 my-8">

                    {/* Ambient Background */}
                    <div className={`absolute inset-0 bg-${currentBook.accent}-500/5 animate-pulse pointer-events-none`}></div>

                    {/* Content Wrapper */}
                    <div className="relative z-10 px-8 py-10 flex flex-col items-center text-center">

                      {/* Title Section */}
                      <div className="mb-6">
                        <div className="text-emerald-400 font-mono text-xs font-bold tracking-[0.25em] uppercase opacity-80 mb-2">
                          {TEXT.component_acquired}
                        </div>
                        <h2 className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${currentBook.color} bg-clip-text text-transparent drop-shadow-sm`}>
                          {GOLEM_PARTS[currentChapterIndex]?.name || TEXT.unknown_artifact}
                        </h2>
                      </div>

                      {/* Golem Visual */}
                      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 flex-shrink-0 flex items-center justify-center">
                        {/* Halos */}
                        <div className={`absolute inset-0 bg-${currentBook.accent}-400/20 rounded-full animate-ping blur-2xl opacity-40`}></div>
                        <div className={`absolute inset-0 bg-${currentBook.accent}-500/10 rounded-full blur-xl`}></div>

                        {/* The Golem */}
                        <div className="relative z-10 w-full h-full p-4">
                          <Golem dna={dna} stage={golemStage} className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                        </div>
                      </div>

                      {/* Lore / Description */}
                      <div className="mb-8 max-w-sm">
                        <p className="text-slate-300 italic text-lg leading-relaxed font-light">
                          "{GOLEM_PARTS[currentChapterIndex]?.desc || TEXT.golem_evolves}"
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="w-full">
                        {currentChapterIndex < CHAPTERS.length - 1 ? (
                          <button
                            onClick={() => { setStatus(null); nextChapter(); }}
                            className={`group relative w-full py-4 bg-gradient-to-r ${currentBook.color} hover:brightness-110 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-${currentBook.accent}-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-[0.98]`}
                          >
                            <span>{TEXT.continue_journey}</span>
                            <span className="group-hover:translate-x-1 transition-transform">▶</span>
                          </button>
                        ) : (
                          <div className="w-full py-4 bg-amber-900/30 border border-amber-500/50 rounded-xl text-amber-400 font-bold animate-pulse">
                            {TEXT.journey_complete}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal Area */}
          <div className="h-1/3 min-h-[150px]">
            {/* Pass accent to terminal if needed, or just keep standard dark */}
            <Terminal output={output} />
          </div>
        </div>

      </main>
    </div>
  );
}

function App() {
  const [dna, setDna] = useState(() => localStorage.getItem('golem_dna'));

  // Persistence: Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('golem_language') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('golem_language', language);
  }, [language]);

  const TEXT = UI_TEXT[language];

  const handleCharacterCreated = (newDna) => {
    localStorage.setItem('golem_dna', newDna);
    setDna(newDna);
  };

  const handleExit = () => {
    localStorage.removeItem('golem_dna');
    setDna(null);
  };

  return (
    <PyodideProvider>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 relative">
        {!dna ? (
          <CharacterCreator
            onComplete={handleCharacterCreated}
            language={language}
            setLanguage={setLanguage}
            TEXT={TEXT}
          />
        ) : (
          <Game dna={dna} onExit={handleExit} language={language} setLanguage={setLanguage} />
        )}
      </div>
    </PyodideProvider>
  );
}

export default App;
