import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme

function CodeEditor({ code, onChange, runCode, isRunning }) {
    return (
        <div className="flex flex-col h-full font-mono text-sm">
            <div className="flex justify-between items-center mb-0 bg-slate-800 p-2 rounded-t-lg border-b border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
                    Spell Editor
                </span>
                <button
                    onClick={runCode}
                    disabled={isRunning}
                    className={`
            px-4 py-1.5 rounded text-sm font-bold transition-all
            ${isRunning
                            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 hover:shadow-emerald-500/30'
                        }
          `}
                >
                    {isRunning ? 'Transmuting...' : '▶ RUN'}
                </button>
            </div>

            <div className="flex-1 bg-slate-900 overflow-auto border border-slate-800 rounded-b-lg relative">
                <Editor
                    value={code}
                    onValueChange={onChange}
                    highlight={code => highlight(code, languages.python, 'python')}
                    padding={16}
                    className="font-mono min-h-full"
                    style={{
                        fontFamily: '"Fira Code", "Fira Mono", monospace',
                        fontSize: 14,
                        backgroundColor: '#0f172a', // slate-950 matches theme
                        color: '#e2e8f0',
                    }}
                    textareaClassName="focus:outline-none"
                />
            </div>

            {/* Custom Styles for Prism to match requested "White Comments" if desired, 
                though Tomorrow Night usually has gray comments. 
                Let's inject a small style tag to override comment color to white/bright as requested. 
            */}
            <style>{`
                .token.comment,
                .token.prolog,
                .token.doctype,
                .token.cdata {
                    color: #94a3b8 !important; /* slate-400, readable but distinct */
                    font-style: italic;
                }
                .token.function {
                    color: #38bdf8 !important; /* sky-400 */
                }
                .token.string {
                    color: #4ade80 !important; /* green-400 */
                }
                .token.keyword {
                    color: #c084fc !important; /* purple */
                }
            `}</style>
        </div>
    );
}

export default CodeEditor;
