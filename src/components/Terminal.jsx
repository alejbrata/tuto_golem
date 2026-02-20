import React from 'react';

function Terminal({ output = [] }) {
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [output]);

    return (
        <div
            ref={containerRef}
            className="bg-slate-950 font-mono text-sm p-4 rounded-lg border border-slate-800 h-64 overflow-y-auto shadow-inner text-slate-300 custom-scrollbar"
        >
            <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1 text-xs uppercase tracking-wider sticky top-0 bg-slate-950">
                Neural Console Output
            </div>
            {output.length === 0 && (
                <span className="text-slate-600 italic">Waiting for signal...</span>
            )}
            {output.map((line, i) => (
                <div key={i} className={`${line.startsWith('Error:') || line.startsWith('Traceback:') ? 'text-red-400' : 'text-emerald-400'}`}>
                    <span className="text-slate-600 select-none mr-2">$</span>
                    {line}
                </div>
            ))}
        </div>
    );
}

export default Terminal;
