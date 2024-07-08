// Espera a que el DOM esté completamente cargado antes de agregar los event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.button.translate-button').addEventListener('click', translateCode); // Botón de traducción
    document.querySelector('.button[onclick="abrir()"]').addEventListener('click', abrir); // Botón para abrir un archivo
    document.querySelector('.button[onclick="guardar()"]').addEventListener('click', guardar); // Botón para guardar el archivo traducido
    document.querySelector('.button[onclick="nuevo()"]').addEventListener('click', nuevo); // Botón para crear un nuevo documento
    document.querySelector('.button[onclick="limpiar()"]').addEventListener('click', limpiar); // Botón para limpiar el textarea de entrada
    document.querySelector('.button[onclick="salir()"]').addEventListener('click', salir); // Botón para salir de la aplicación
});

// Función para abrir un archivo y cargar su contenido en el textarea de entrada
function abrir() {
    const sourceCode = document.getElementById('sourceCode'); // Referencia al textarea de entrada
    const fileInput = document.createElement('input'); // Crear un elemento de entrada de archivo
    fileInput.type = 'file'; // Tipo de entrada es archivo
    fileInput.accept = '.txt,.js,.php,.cs'; // Tipos de archivo aceptados
    fileInput.onchange = () => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            sourceCode.value = reader.result; // Cargar el contenido del archivo en el textarea de entrada
        };
        reader.readAsText(file);
    };
    fileInput.click(); // Simular clic para abrir el cuadro de diálogo de selección de archivo
}

// Función para guardar el contenido del textarea de salida en un archivo
function guardar() {
    const translatedCode = document.getElementById('translatedCode').value; // Obtener el contenido del textarea de salida
    const blob = new Blob([translatedCode], { type: 'text/plain;charset=utf-8' }); // Crear un Blob con el contenido
    const link = document.createElement('a'); // Crear un enlace para descargar el archivo
    link.href = URL.createObjectURL(blob); // Crear una URL para el Blob
    link.download = 'translated_code.txt'; // Nombre del archivo de descarga
    link.click(); // Simular clic para iniciar la descarga
}

// Función para crear un nuevo documento (limpiar ambos textareas)
function nuevo() {
    document.getElementById('sourceCode').value = ''; // Limpiar el textarea de entrada
    document.getElementById('translatedCode').value = ''; // Limpiar el textarea de salida
}

// Función para limpiar el contenido del textarea de entrada
function limpiar() {
    document.getElementById('sourceCode').value = ''; // Limpiar el textarea de entrada
}

// Función para salir de la aplicación (cierra la ventana del navegador)
function salir() {
    if (confirm('¿Estás seguro de que deseas salir?')) { // Confirmar salida
        window.close(); // Cerrar la ventana del navegador
    }
}

// Función para traducir el código de entrada y mostrarlo en el textarea de salida
function translateCode() {
    const sourceCode = document.getElementById('sourceCode').value; // Obtener el código fuente del textarea de entrada
    const translatedCode = document.getElementById('translatedCode'); // Referencia al textarea de salida
    
    if (sourceCode.trim() === '') {
        translatedCode.value = 'El código traducido aparecerá aquí...'; // Mensaje por defecto si no hay código fuente
        return;
    }

    const language = detectLanguage(sourceCode); // Detectar el lenguaje del código fuente

    // Traducir el código según el lenguaje detectado
    switch(language) {
        case 'javascript':
            translatedCode.value = translateJsToPhp(sourceCode);
            break;
        case 'php':
            translatedCode.value = translatePhpToCsharp(sourceCode);
            break;
        default:
            translatedCode.value = 'Traducción no disponible'; // Mensaje si la traducción no está disponible
    }
}

// Función para detectar el lenguaje del código fuente
function detectLanguage(code) {
    if (code.includes('console.log')) {
        return 'javascript'; // Detectar JavaScript
    } else if (code.includes('echo')) {
        return 'php'; // Detectar PHP
    } else {
        return 'unknown'; // Lenguaje desconocido
    }
}

// Función para traducir código de JavaScript a PHP
function translateJsToPhp(jsCode) {
    let phpCode = jsCode
        .replace(/console\.log/g, 'echo') // Reemplazar console.log con echo
        .replace(/function\s+(\w+)\s*\(([^)]*)\)\s*{/g, 'function $1($2) {') // Reemplazar la sintaxis de función de JavaScript con PHP
        .replace(/(\w+)\s*\(([^)]*)\);/g, '$1($2);') // Ajustar la sintaxis de llamada de función
        .replace(/let|const/g, '$') // Reemplazar let/const con $
        .replace(/;/g, ';'); // Asegurar el punto y coma en el final de cada línea

    phpCode = "<?php\n" + phpCode + "\n?>"; // Añadir las etiquetas de apertura y cierre de PHP
    return phpCode; // Devolver el código traducido
}

// Función para traducir código de PHP a C#
function translatePhpToCsharp(phpCode) {
    let csharpCode = phpCode
        .replace(/<\?php/g, 'using System;\n\nclass Program {\n    static void Main() {') // Reemplazar la etiqueta de apertura de PHP con la estructura básica de C#
        .replace(/\?>/g, '    }\n}') // Reemplazar la etiqueta de cierre de PHP con el cierre de clase y método en C#
        .replace(/echo\s+/g, 'Console.WriteLine(') // Reemplazar echo con Console.WriteLine
        .replace(/;/g, ');') // Asegurar el punto y coma en el final de cada línea
        .replace(/function\s+(\w+)\s*\(([^)]*)\)\s*{/g, 'static void $1($2) {') // Reemplazar la sintaxis de función de PHP con C#
        .replace(/\$(\w+)/g, '$1'); // Eliminar el símbolo $ de las variables

    return csharpCode; // Devolver el código traducido
}
