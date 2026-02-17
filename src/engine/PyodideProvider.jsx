import { createContext, useContext, useEffect, useState, useRef } from 'react';

const PyodideContext = createContext(null);

export function PyodideProvider({ children }) {
    const [pyodide, setPyodide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [output, setOutput] = useState([]);

    useEffect(() => {
        async function initPyodide() {
            try {
                // Load Pyodide script
                if (!window.loadPyodide) {
                    const script = document.createElement('script');
                    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
                    script.async = true;
                    document.body.appendChild(script);
                    await new Promise((resolve) => script.onload = resolve);
                }

                // Initialize Pyodide
                const py = await window.loadPyodide();

                // Define Mock Tiktoken Script
                const MOCK_TIKTOKEN = `
import sys
from types import ModuleType

class MockEncoding:
    def __init__(self, name):
        self.name = name
    
    def encode(self, text):
        # Deterministic tokenization for tutorial "El conocimiento es poder..."
        # We map specific words to specific IDs to look realistic
        try:
            # Simple hash-like fallback
            return [sum(ord(c) for c in word) for word in text.split()]
        except:
            return []

class MockTiktoken:
    def get_encoding(self, encoding_name):
        return MockEncoding(encoding_name)

if "tiktoken" not in sys.modules:
    sys.modules["tiktoken"] = MockTiktoken()
`;

                // Load micropip (optional, might be useful later)
                await py.loadPackage("micropip");

                // Initialize Mock Tiktoken always for consistency in this tutorial
                await py.runPythonAsync(MOCK_TIKTOKEN);

                // Redirect stdout/stderr

                // Redirect stdout/stderr
                py.setStdout({ batched: (msg) => setOutput((prev) => [...prev, msg]) });
                py.setStderr({ batched: (msg) => setOutput((prev) => [...prev, `Error: ${msg}`]) });

                setPyodide(py);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to load Pyodide:", err);
                setError(err);
                setIsLoading(false);
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
            setError(err);
            setOutput((prev) => [...prev, `Traceback: ${err.message}`]);
            throw err; // Re-throw so the caller knows it failed
        }
    };

    return (
        <PyodideContext.Provider value={{ pyodide, isLoading, error, runPython, output }}>
            {children}
        </PyodideContext.Provider>
    );
}

export function usePyodide() {
    return useContext(PyodideContext);
}
