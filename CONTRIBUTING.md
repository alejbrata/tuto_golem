# Cómo Contribuir (How to Contribute)

¡Gracias por tu interés en mejorar **The Neural Forge**! (English below)

Este proyecto es Open Source, pero para mantener la calidad y seguridad del código, seguimos un flujo de trabajo estándar de GitHub.

## 🇪🇸 En Español

### 🚫 No puedes hacer "Push" directamente
Por seguridad, la rama `main` está protegida. Si intentas hacer `git push` directo, te dará error (403 Forbidden).

### ✅ El flujo correcto (Fork & Pull Request)

1.  **Danos un Fork 🍴**: Ve arriba a la derecha y haz clic en "Fork". Esto creará una copia del repositorio en tu propia cuenta de GitHub.
2.  **Clona tu copia**:
    ```bash
    git clone https://github.com/TU_USUARIO/tuto_golem.git
    cd tuto_golem
    ```
3.  **Crea una rama (Branch)**:
    ```bash
    git checkout -b mi-nueva-funcionalidad
    ```
4.  **Haz tus cambios**: Mejora el código, arregla bugs, añade traducciones...
5.  **Verifica**: Ejecuta `npm run validate` para asegurarte de que no has roto nada.
6.  **Sube tus cambios a TU copia**:
    ```bash
    git push origin mi-nueva-funcionalidad
    ```
7.  **Abre un Pull Request (PR)**: Ve a tu repositorio en GitHub. Verás un botón verde que dice "Compare & pull request". Haz clic, explica tus cambios y envíalo.

Nosotros revisaremos tu código y, si todo está bien, lo fusionaremos (Merge) con el proyecto principal.

---

## 🇺🇸 In English

### 🚫 You cannot "Push" directly
For security reasons, the `main` branch is protected. Direct `git push` attempts will fail.

### ✅ The Correct Workflow (Fork & Pull Request)

1.  **Fork the Repo 🍴**: Click "Fork" at the top right. This creates a copy in your GitHub account.
2.  **Clone your copy**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/tuto_golem.git
    cd tuto_golem
    ```
3.  **Create a Branch**:
    ```bash
    git checkout -b my-new-feature
    ```
4.  **Make your changes**: Improve code, fix bugs, add translations...
5.  **Verify**: Run `npm run validate` to ensure integrity.
6.  **Push to YOUR copy**:
    ```bash
    git push origin my-new-feature
    ```
7.  **Open a Pull Request (PR)**: Go to your repo on GitHub. Click the green "Compare & pull request" button.

We will review your code and merge it if everything looks good.
