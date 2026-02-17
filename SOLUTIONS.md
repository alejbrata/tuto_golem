# The Neural Forge - Libro de Soluciones

Usa estos **Hechizos Maestros** para avanzar rápidamente por los capítulos y probar la evolución del Golem.

## LIBRO 1: El Alquimista de Almas

### Capítulo 1: Fragmentación (Tokenization)
```python
import tiktoken

pergamino_sagrado = "El conocimiento es poder, pero la sabiduría es libertad."

# 1. Invoca al espíritu del codificador 'cl100k_base'
codificador = tiktoken.get_encoding("cl100k_base")

# 2. Transmuta el pergamino en tokens numéricos
tokens_alma = codificador.encode(pergamino_sagrado)

# Verificación visual
print(f"Frase original: '{pergamino_sagrado}'")
print(f"Esencia numérica: {tokens_alma}")
print(f"Cantidad de fragmentos: {len(tokens_alma)}")
```

### Capítulo 2: La Brújula Semántica (Embeddings)
```python
# Esencias de prueba (Vectores [Fuerza, Magia])
alma_guerrero = [0.9, 0.1]
alma_paladin =  [0.6, 0.6]

def calcular_proximidad(vec1, vec2):
    # Producto Escalar: (x1*x2) + (y1*y2)
    return (vec1[0] * vec2[0]) + (vec1[1] * vec2[1])

# Invocación de prueba
afinidad = calcular_proximidad(alma_guerrero, alma_paladin)

print(f"Afinidad entre Guerrero y Paladín: {afinidad}")
```

### Capítulo 3: La Biblioteca Susurrante (Búsqueda Semántica)
```python
memoria_biblioteca = {
    "item_304": [0.1, 0.2, 0.9],
    "item_777": [0.8, 0.9, 0.1],
    "item_055": [0.2, 0.1, 0.3]
}

vector_busqueda = [0.9, 0.8, 0.2]

def buscar_reliquia(query, base_datos):
    for id_obj, vector in base_datos.items():
        # Producto Escalar simplificado (3 dimensiones)
        similitud = (query[0]*vector[0]) + (query[1]*vector[1]) + (query[2]*vector[2])
        
        if similitud > 0.9:
            return id_obj
    
    return "No encontrado"

hallazgo = buscar_reliquia(vector_busqueda, memoria_biblioteca)
print(f"El Golem ha recuperado: {hallazgo}")
```

### Capítulo 4: El Archivo de Cristal (Vector DB)
```python
class VectorDB:
    def __init__(self):
        self.storage = {}
    
    def insert(self, id, vector, metadata):
        self.storage[id] = {'vec': vector, 'meta': metadata}
        print(f"[DB] Insertado {id} con meta: {metadata}")
        
    def query(self, query_vector, top_k=1):
        # Simulación simple
        best_id = None
        best_score = -1
        for uid, data in self.storage.items():
            # Producto punto simple como score
            score = sum(i*j for i,j in zip(query_vector, data['vec']))
            if score > best_score:
                best_score = score
                best_id = uid
        
        if best_id:
            return [(best_id, self.storage[best_id])]
        return []

db = VectorDB()

# Inserción con Metadata
metadata_vital = {'tipo': 'Epifanía', 'texto': 'Cogito Ergo Sum'}
vector_recuerdo = [0.5, 0.5, 0.5]
db.insert('memoria_core', vector_recuerdo, metadata_vital)

# Búsqueda
resultados = db.query([0.5, 0.5, 0.5], top_k=1)
print(f"Recuperado: {resultados}")
```

## LIBRO 2: Los Sentidos del Alquimista

### Capítulo 5: El Ojo de Cristal (Visión)
```python
imagen_glifo = "<GLIFO_RUNICO_ENCANTADO_AC8F>"

class VisionModel:
    def generate(self, image, prompt):
        print("[OJO] Escaneando frecuencia lumínica...")
        return {
            "descripcion": "Una estructura de paso.",
            "objeto_detectado": "Puerta",
            "confianza": 0.99
        }

vlm = VisionModel()

# Análisis Visual
respuesta = vlm.generate(imagen_glifo, "Describe el objeto")

# Extracción de Concepto
clave_maestra = respuesta['objeto_detectado']

print(f"Análisis completado. El objeto es: {clave_maestra}")
```

### Capítulo 6: El Susurro del Viento (Audio)
```python
audio_raw = [0.01, -0.5, 0.8] 

class OidoAlquimico:
    def escuchar(self, audio, lenguaje='humano'):
        if lenguaje == 'humano':
            raise ValueError("Frecuencia incorrecta")
        return "shhh... CAMINO ...shhh... VELOZ ...pfff..."

oido = OidoAlquimico()

# 1. Captura con manejo de errores
try:
    mensaje_sucio = oido.escuchar(audio_raw, lenguaje='humano')
except ValueError:
    print("¡Frecuencia humana falló! Sintonizando espectro espiritual...")
    mensaje_sucio = oido.escuchar(audio_raw, lenguaje='espiritual')

# 2. Limpieza de ruido
# Encadenamos replaces para borrar todo el ruido
mensaje_limpio = mensaje_sucio.replace("shhh", "").replace("pfff", "").replace("...", "").strip()

print(f"Mensaje original: '{mensaje_sucio}'")
print(f"Mensaje limpio: '{mensaje_limpio}'")
```

### Capítulo 7: El Flujo del Tiempo (Video)
```python
video_stream = [
    {'t': 0.0, 'desc': 'Un salón de piedra vacío.'},
    {'t': 2.5, 'desc': 'Entra una figura encapuchada.'},
    {'t': 5.0, 'desc': 'La figura mira a los lados con nerviosismo.'},
    {'t': 7.5, 'desc': 'Saca un objeto brillante de su túnica.'},
    {'t': 10.0, 'desc': 'Sostiene unas monedas de oro.'},
    {'t': 12.5, 'desc': 'Deja caer una llave antigua al suelo.'},
    {'t': 15.0, 'desc': 'La figura se desvanece en las sombras.'}
]

momento_clave = -1

for frame in video_stream:
    print(f"[{frame['t']}s] Analizando: {frame['desc']}...")
    if 'llave' in frame['desc']:
        momento_clave = frame['t']
        print("¡OBJETIVO LOCALIZADO!")
        break

print(f"La llave cae exactamente en el segundo: {momento_clave}")
```

## LIBRO 3: El Código Sagrado

### Capítulo 8: El Escriba Externo (RAG Basics)
```python
pregunta_usuario = "¿Quién gobierna la Torre hoy?"
pergamino_verdad = "REGISTRO ALQUÍMICO (FECHA: AYER): La Reina Lyra derrotó a Eldric el Viejo y fue coronada Soberana."

template = """
Eres un asistente veraz. Usa SOLO el siguiente contexto para responder. Si no lo sabes, di 'No lo sé'.

Contexto: {contexto}

Pregunta: {pregunta}
Respuesta:
"""

# Inyección de Contexto
prompt_final = template.format(contexto=pergamino_verdad, pregunta=pregunta_usuario)

print("--- Prompt Enviado al Cerebro ---")
print(prompt_final)
print("----------------------------------")
print("Simulación LLM: 'Según el registro, la Reina Lyra gobierna la Torre.'")
```

### Capítulo 9: Cadenas de Mando (Chains)
```python
mensaje_original = "Saludos, noble Rey de la Montaña. Necesitamos 500 lingotes de mitril para reparar la Torre Este antes del amanecer."

class ChainStep:
    def __init__(self, name, logic):
        self.name = name
        self.logic = logic
    
    def run(self, input_text):
        print(f"[{self.name}] Procesando... ")
        return self.logic(input_text)

# Definir funciones
def traducir(txt): return f"RUNAS: {txt}"
def resumir(txt): return "Necesitamos 500 mitril."
def encriptar(txt): return f"%%%{txt[::-1]}%%%"

# Instanciar pasos
paso1 = ChainStep("Traductor", traducir)
paso2 = ChainStep("Resumidor", resumir)
paso3 = ChainStep("Encriptador", encriptar)

# Ejecución en Cadena (Pipeline)
r1 = paso1.run(mensaje_original)
r2 = paso2.run(r1)
resultado_final = paso3.run(r2)

print(f"Mensaje Final: {resultado_final}")
```

### Capítulo 10: El Espejo de la Verdad (RAG Eval)
```python
contexto_real = "La espada 'Excalibur' fue forjada en la Isla de Avalon por la Dama del Lago. Solo el verdadero Rey puede empuñarla."
respuesta_golem_1 = "La espada Excalibur fue forjada en el Monte del Destino por orcos."
respuesta_golem_2 = "Excalibur fue hecha en Avalon por la Dama del Lago."

class JuezAlquimico:
    def evaluar_fidelidad(self, contexto, respuesta):
        score = 0.0
        contexto_lower = contexto.lower()
        respuesta_lower = respuesta.lower()
        
        # Palabras clave que DEBEN estar
        keywords = ['avalon', 'dama', 'lago']
        hits = sum(1 for k in keywords if k in respuesta_lower)
        
        if hits == 3:
            score = 1.0
        elif hits > 0:
            score = 0.5
            
        # Penalización por alucinación obvia
        if 'monte' in respuesta_lower or 'orcos' in respuesta_lower:
            score = 0.0
            print("[ALERTA] ¡Alucinación detectada!")
            
        return score

juez = JuezAlquimico()
score1 = juez.evaluar_fidelidad(contexto_real, respuesta_golem_1)
score2 = juez.evaluar_fidelidad(contexto_real, respuesta_golem_2)

print(f"Score 1 (Alucinación): {score1}")
print(f"Score 2 (Verdad): {score2}")
```

## LIBRO 4: La Voluntad Propia

### Capítulo 11: Herramientas de Poder (Function Calling)
```python
piedra = "Runa_Ignis"

class AgenteGolem:
    def pensar(self, prompt, herramientas):
        # Simulación: El LLM analiza el prompt y ve que necesita el peso
        if "peso" in prompt.lower() or "equilibrar" in prompt.lower():
            return {
                "tool": "obtener_peso",
                "args": {"objeto": piedra},
                "reasoning": "Necesito saber el peso para aplicar la fórmula."
            }
        return None

agente = AgenteGolem()
herramientas = [{"name": "obtener_peso"}, {"name": "fase_lunar_actual"}]

prompt = f"Calcula el polvo necesario para la {piedra}."
decision = agente.pensar(prompt, herramientas)

print(f"[PENSAMIENTO] {decision['reasoning']}")
print(f"[ACCIÓN] Llamando a herramienta: {decision['tool']} con {decision['args']}")
```

### Capítulo 12: La Mente Colmena (Multi-Agent)
```python
mision_templo = "Necesito construir un arco."

class AgenteEspecialista:
    def __init__(self, nombre, rol):
        self.nombre = nombre
        self.rol = rol
    
    def ejecutar(self, input_data):
        print(f"[{self.nombre}] {self.rol} activado.")
        if "Buscador" in self.nombre:
            return "Materiales: Granito Azul, Obsidiana."
        if "Cantero" in self.nombre:
            return f"Plan de Construcción: Usar Granito Azul para el arco principal. Estructura sólida."

buscador = AgenteEspecialista("Buscador", "Investigador")
cantero = AgenteEspecialista("Cantero", "Arquitecto")

# Orquestación
print("--- FASE 1: RECOLECCIÓN ---")
materiales = buscador.ejecutar(mision_templo)
print(f"> {materiales}")

print("--- FASE 2: SÍNTESIS ---")
diseño_final = cantero.ejecutar(materiales)
print(f"> {diseño_final}")
```

### Capítulo 13: El Ciclo del Infinito (LangGraph / Grafos)
```python
acertijo = "¿Qué es lo que al principio camina a cuatro patas, luego a dos y finalmente a tres?"
estado = {"intento": 0, "respuesta_actual": "", "es_correcta": False}

def pensar(estado):
    estado["intento"] += 1
    print(f"[PENSAR] Intento #{estado['intento']}")
    if estado["intento"] == 1:
        estado["respuesta_actual"] = "Un gato"
    elif estado["intento"] >= 2:
        estado["respuesta_actual"] = "El Ser Humano"
    return estado

def criticar(estado):
    ans = estado["respuesta_actual"]
    if ans == "El Ser Humano":
        estado["es_correcta"] = True
        print(f"[CRITICO] '{ans}' es CORRECTO. Rompiendo el ciclo.")
    else:
        estado["es_correcta"] = False
        print(f"[CRITICO] '{ans}' es INCORRECTO. Volviendo al Nodo Pensar.")
    return estado

# Motor del Grafo (Runtime)
while not estado["es_correcta"]:
    estado = pensar(estado)
    estado = criticar(estado)
    # Simulación de pausa para no colgar el navegador si fuera infinito real
    if estado["intento"] > 5: break 

print(f"🎉 Resultado Final: {estado['respuesta_actual']}")
```
