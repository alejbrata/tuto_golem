import { createContext, useContext, useEffect, useState, useRef } from 'react';

const PyodideContext = createContext(null);

export function PyodideProvider({ children }) {
    const [pyodide, setPyodide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [output, setOutput] = useState([]);

    useEffect(() => {
        async function initPyodide() {
            if (pyodide) return; // Already loaded in this component instance

            try {
                // Singleton Pattern: If initialization already started globally, wait for it
                if (!window.golemPyodidePromise) {
                    window.golemPyodidePromise = (async () => {
                        // Load script if not present
                        if (!window.loadPyodide && !document.querySelector('script[src*="pyodide.js"]')) {
                            const script = document.createElement('script');
                            script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
                            script.async = true;
                            document.body.appendChild(script);
                            await new Promise((resolve, reject) => {
                                script.onload = resolve;
                                script.onerror = () => reject(new Error("Failed to load Pyodide script from CDN"));
                            });
                        } else if (!window.loadPyodide) {
                            // Wait for existing script tag to populate window.loadPyodide
                            await new Promise(resolve => {
                                const checkInterval = setInterval(() => {
                                    if (window.loadPyodide) {
                                        clearInterval(checkInterval);
                                        resolve();
                                    }
                                }, 100);
                            });
                        }

                        // Initialize Pyodide
                        const py = await window.loadPyodide({
                            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/"
                        });

                        // Setup Environment
                        const MOCK_TIKTOKEN = `
import sys
from types import ModuleType

class MockEncoding:
    def __init__(self, name):
        self.name = name
    
    def encode(self, text):
        try:
            return [sum(ord(c) for c in word) for word in text.split()]
        except:
            return []

class MockTiktoken:
    def get_encoding(self, encoding_name):
        return MockEncoding(encoding_name)

if "tiktoken" not in sys.modules:
    sys.modules["tiktoken"] = MockTiktoken()
`;
                        // Removed micropip to save memory/startup time for now
                        // await py.loadPackage("micropip");
                        await py.runPythonAsync(MOCK_TIKTOKEN);

                        return py;
                    })();
                }

                const py = await window.golemPyodidePromise;

                // Configure output redirection for this component instance
                py.setStdout({ batched: (msg) => setOutput((prev) => [...prev, msg]) });
                py.setStderr({ batched: (msg) => setOutput((prev) => [...prev, `Error: ${msg}`]) });

                setPyodide(py);
                setOutput(prev => [...prev, "✨ Neural Link Established."]);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to load Pyodide:", err);
                setError(err);
                setIsLoading(false);
                window.golemPyodidePromise = null; // Reset global promise on failure so we can retry
            }
        }

        initPyodide();
    }, []);

    const runPython = async (code) => {
        if (!pyodide) return;
        try {
            setError(null);
            await pyodide.runPythonAsync(code);
        } catch (err) {
            console.error("Pyodide run error:", err);
            // setError(err); // Do NOT set global error on runtime errors, only on init failure
            setOutput((prev) => [...prev, `Traceback: ${err.message}`]);
            throw err; // Re-throw so the caller knows it failed
        }
    };

    const clearOutput = () => {
        setOutput([]);
    };

    return (
        <PyodideContext.Provider value={{ pyodide, isLoading, error, runPython, output, clearOutput }}>
            {children}
        </PyodideContext.Provider>
    );
}

export function usePyodide() {
    return useContext(PyodideContext);
}
