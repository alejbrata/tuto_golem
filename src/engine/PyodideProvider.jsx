/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

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

# --- BOOK 5 MOCKS ---

class MockMCPServer:
    def __init__(self, name):
        self.name = name
    def read_files(self):
        return f"Leyendo datos del servidor MCP '{self.name}': [gasto1.csv, balance.xlsx]"

class MockMCPMock:
    def connect_to_server(self, name):
        print(f"[NEXO] Conectando al servidor MCP externo: {name}...")
        return MockMCPServer(name)

class MockChromeAI:
    def register_tool(self, name, action):
        print(f"[WEBMCP] Registrada habilidad global en navegador: '{name}'.")

class MockAlquimiaDocs:
    def generar_excel(self, data, formato='contable'):
        return f"Excel estructurado generado con {data} (formato: {formato})"
    def generate_excel(self, data, format='accounting'):
        return f"Structured Excel generated with {data} (format: {format})"

class MockMetrics:
    def calcular_similitud(self, a, b):
        print(f"[EVAL] Comparando similitud semántica. Puntuación: 0.92")
        return 0.92
    def calculate_similarity(self, a, b):
        print(f"[EVAL] Comparing semantic similarity. Score: 0.92")
        return 0.92

class MockLocalEngine:
    def load_model(self, name):
        print(f"[WEBGPU] Cargando modelo '{name}' directamente en VRAM del navegador...")
        return "Motor Edge Listo. Sin latencia."
        
class MockLocalAI:
    def init_webgpu(self):
        print(f"[EDGE] Inicializando WebGPU para inferencia off-grid...")
        return MockLocalEngine()

if "mcp_mock" not in sys.modules: sys.modules["mcp_mock"] = MockMCPMock()
if "chrome_ai" not in sys.modules: sys.modules["chrome_ai"] = MockChromeAI()
if "alquimia_docs" not in sys.modules: sys.modules["alquimia_docs"] = MockAlquimiaDocs()
if "metrics" not in sys.modules: sys.modules["metrics"] = MockMetrics()
if "local_ai" not in sys.modules: sys.modules["local_ai"] = MockLocalAI()
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
    }, [pyodide]);

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

    const clearOutput = useCallback(() => {
        setOutput([]);
    }, []);

    return (
        <PyodideContext.Provider value={{ pyodide, isLoading, error, runPython, output, clearOutput }}>
            {children}
        </PyodideContext.Provider>
    );
}

export function usePyodide() {
    return useContext(PyodideContext);
}
