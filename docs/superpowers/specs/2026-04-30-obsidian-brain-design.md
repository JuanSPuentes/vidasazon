# Diseño del Cerebro de Obsidian para LLM

## 1. Objetivo

Crear una estructura de conocimiento interconectada en formato Markdown, similar a un "cerebro de Obsidian", que sea fácilmente legible y comprensible por un Large Language Model (LLM). La información se centrará en recetas y sus categorías, con un énfasis en la ligadura de datos para facilitar la navegación y extracción de relaciones.

## 2. Ubicación del Proyecto

El "cerebro de Obsidian" se ubicará en: `c:\Users\sebas\Desktop\WEB\web`

## 3. Estructura de Directorios

Se crearán dos subdirectorios principales dentro de `c:\Users\sebas\Desktop\WEB\web`:

*   `c:\Users\sebas\Desktop\WEB\web\recetas\`
*   `c:\Users\sebas\Desktop\WEB\web\categorias\`

## 4. Formato de Archivos Markdown (Recetas)

Cada archivo de receta (`.md`) estará en el directorio `recetas/` y tendrá la siguiente estructura, incluyendo `YAML Frontmatter` para metadatos estructurados:

```markdown
---
titulo: [Título de la Receta]
categorias: ["[Categoría 1]", "[Categoría 2]", ...]
dificultad: [Fácil/Medio/Difícil]
tiempo_preparacion: "[X minutos]"
tiempo_coccion: "[X minutos]"
rendimiento: "[Y porciones]"
tags: ["[tag1]", "tag2", ...]
---

# [Título de la Receta]

## Descripción
[Breve descripción de la receta.]

## Ingredientes
* [Ingrediente 1]
* [Ingrediente 2]
* ...

## Instrucciones
1. [Paso 1]
2. [Paso 2]
3. ...

---

[Notas adicionales, consejos, o enlaces internos a otras [[Recetas Relacionadas]] si es relevante.]
```

**Notas sobre el Formato de Recetas:**
*   El `YAML Frontmatter` es crucial para la extracción eficiente de metadatos por parte del LLM.
*   Se pueden añadir enlaces internos `[[Nombre de otra Receta]]` o `[[Categoría/Nombre de Categoría]]` en el cuerpo del texto para enriquecer la red de conocimiento.

## 5. Formato de Archivos Markdown (Categorías)

Cada archivo de categoría (`.md`) estará en el directorio `categorias/` y tendrá la siguiente estructura:

```markdown
---
titulo: [Nombre de la Categoría]
descripcion: [Breve descripción de la categoría.]
---

# [Nombre de la Categoría]

## Recetas
* [[Nombre de la Receta 1]]
* [[Nombre de la Receta 2]]
* ...
```

**Notas sobre el Formato de Categorías:**
*   El `YAML Frontmatter` proporcionará un título y descripción de la categoría.
*   La sección "Recetas" contendrá una lista de enlaces internos a los archivos de recetas que pertenecen a esta categoría, creando la ligadura fundamental para el LLM.

## 6. Interconexión y Legibilidad para el LLM

*   **Enlaces Bidireccionales:**
    *   Las recetas enlazarán a sus categorías a través del campo `categorias` en el `YAML Frontmatter`.
    *   Las categorías enlazarán a las recetas a través de la lista de enlaces internos en el cuerpo del archivo.
    *   Esta estructura bidireccional es vital para que el LLM pueda navegar, comprender y extraer las relaciones entre recetas y categorías.
*   **Convención de Nombres:**
    *   Se recomienda usar nombres de archivo descriptivos con espacios (ej. `Pastel de Chocolate.md`) para facilitar la legibilidad de los enlaces internos en Obsidian y para el LLM.
*   **Extracción de Metadatos:**
    *   El uso consistente del `YAML Frontmatter` permitirá al LLM extraer metadatos estructurados (títulos, categorías, dificultad, etc.) de forma programática, mejorando la comprensión y procesamiento de la información.

## 7. Próximos Pasos

Una vez aprobado este diseño, se procederá a la creación de un plan de implementación detallado utilizando la habilidad `writing-plans`.