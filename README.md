# Projection / Video Mapping Experience

Herramienta standalone de autoría visual para simular, personalizar, reproducir y exportar experiencias de **proyección de vídeo / video mapping** sobre escenarios reales o generados.

La herramienta nace como un laboratorio independiente y validado antes de su futura integración como experiencia nativa dentro de **Immersive Worlds** en Escaparates Pro.

> Estado actual: **V0.4 Final / baseline estable aprobado**.
>
> Entrada principal de revisión: `index-v0-4.html`.

---

## 1. Qué es

Projection / Video Mapping Experience permite combinar:

- un **escenario o fondo**;
- un **vídeo o imagen proyectada**;
- una **superficie en perspectiva**;
- controles de posición, escala y rotación;
- integración visual mediante opacidad, brillo, contraste, blend, light spill y reflejos;
- un **haz de proyector cinematográfico**;
- partículas de polvo volumétrico concentradas dentro del haz;
- texto editable integrado dentro del mismo plano de proyección;
- preview limpio;
- guardado de ajustes;
- grabación y exportación.

El objetivo no es simplemente colocar un vídeo encima de una fotografía, sino crear la ilusión visual de que el contenido está siendo **proyectado físicamente dentro de la escena**.

---

## 2. Objetivo de producto

Este repositorio cumple dos funciones:

1. **Golden baseline / laboratorio aprobado** de la experiencia Projection.
2. Fuente de referencia para una futura adaptación nativa dentro de `Escaparates Pro > Immersive Worlds > Experiences > Projection`.

Este repo debe seguir siendo independiente para:

- experimentar sin afectar Escaparates Pro;
- conservar versiones funcionales conocidas;
- facilitar rollback;
- probar nuevos presets, escenas y técnicas de mapping;
- validar visualmente cada evolución antes de integrarla en el producto principal.

No debe utilizarse como iframe remoto obligatorio ni como dependencia runtime de Escaparates Pro. La integración futura deberá ser una **adaptación selectiva del código aprobado** al sistema nativo de Escaparates Pro.

---

## 3. Origen técnico

La base visual procede del efecto `Director's Cut` del proyecto:

- `Juanmaes83/rubiksotamovil`

El patrón fuente combinaba:

- vídeo dentro de un plano DOM;
- transformación CSS `matrix3d()`;
- baja opacidad;
- `mix-blend-mode`;
- light spill;
- reflexión / blur;
- capas atmosféricas;
- animación GSAP;
- texto superpuesto dentro del mismo plano transformado.

La matriz fuente protegida es:

```css
matrix3d(
  0.614952, 0.147049, 0, 0.000199706,
 -0.0178567, 0.487847, 0, -0.0000312429,
  0, 0, 1, 0,
  137, 29, 0, 1
)
```

Esta geometría sigue siendo el **Rubik source baseline** y sirve como referencia estable para comparar futuras modificaciones.

---

## 4. Arquitectura actual

La experiencia se construye de forma aditiva sobre un núcleo V0 estable.

```text
index.html
│
│  V0 / core validado
│  - fondo
│  - media
│  - matrix3d
│  - projection look
│  - transform
│  - playback
│
├── index-v0-3.html
│   └── v0-3-enhancer.js
│       - transform ampliado
│       - cinema beam
│       - volumetric dust
│       - media fit / flip
│       - preview clean
│       - save / restore
│       - output
│
└── index-v0-4.html
    ├── v0-3-enhancer.js
    └── v0-4-final.js
        - background light ampliado
        - projection text editable
        - text persistence
        - text en HTML standalone/embed
```

La decisión arquitectónica clave es **no reescribir el núcleo que ya funciona**. Las capacidades nuevas se añaden como capas separadas.

---

## 5. Entrada principal

La versión estable actual es:

```text
index-v0-4.html
```

Preview pública habitual:

```text
https://raw.githack.com/Juanmaes83/projection-video-mapping-experience/main/index-v0-4.html
```

RawGitHack se utiliza únicamente como preview rápida del código público del repositorio. No debe considerarse hosting definitivo de producción.

---

## 6. Flujo de uso

### Paso 1 — Elegir escenario

Puede utilizarse:

- el escenario original de Rubik Sota;
- un fondo personalizado.

El fondo debe estar pensado como una **projection-ready scene**, no simplemente como una fotografía decorativa.

Un buen escenario debe incluir:

- una superficie clara donde pueda caer la proyección;
- espacio suficiente;
- poca obstrucción frontal;
- perspectiva útil;
- iluminación compatible con proyección;
- buen contraste entre contenido y entorno.

### Paso 2 — Cargar contenido

La herramienta admite:

- vídeo local;
- imagen local;
- vídeo remoto mediante URL directa;
- imagen remota mediante URL directa;
- fuente YouTube original del baseline.

Para archivos locales se utiliza `URL.createObjectURL()` durante la sesión.

### Paso 3 — Reproducir

Controles disponibles:

- Play;
- Pause;
- Restart.

### Paso 4 — Ajustar el look

La proyección puede modificarse mediante:

- Opacity;
- Brightness;
- Contrast;
- Blend mode;
- Light spill;
- Reflection;
- Background light.

### Paso 5 — Ajustar posición

Transform permite adaptar la proyección al nuevo escenario.

Rangos actuales:

```text
Scale      0.25 → 2.50
Offset X  -1000 → +1000 px
Offset Y   -700 → +700 px
Rotate Z    -35 → +35°
```

Existe además un reset independiente para volver al transform base.

### Paso 6 — Añadir atmósfera

Cinema Beam y Volumetric Dust permiten simular la presencia física de un proyector dentro de la escena.

### Paso 7 — Añadir texto

Projection Text permite colocar un mensaje dentro del mismo plano transformado de la proyección.

### Paso 8 — Previsualizar

`Preview clean` oculta la interfaz de autoría para mostrar únicamente la experiencia final.

### Paso 9 — Guardar o exportar

Puede guardarse la configuración local y generar diferentes salidas.

---

## 7. Fondo / Background

### Upload Custom Background

Permite sustituir el entorno sin alterar automáticamente la geometría de proyección.

### Background Light

Rango actual:

```text
0.05 → 2.50
```

Interpretación orientativa:

```text
0.05 = casi negro
1.00 = exposición original
2.50 = fondo fuertemente levantado
```

También existen controles rápidos:

- `Darker`
- `Brighter`

Esto permite compensar escenas demasiado oscuras o demasiado luminosas sin alterar la imagen proyectada.

---

## 8. Media

### Fuentes admitidas

- Original Rubik Sota YouTube
- Local video
- Local image
- Direct video URL
- Direct image URL

### Media Fit

Opciones:

- `Cover`
- `Contain`
- `Stretch`

### Flip

- Flip X
- Flip Y

### Visibility

La proyección puede ocultarse temporalmente para comparar:

```text
BACKGROUND ONLY
vs
BACKGROUND + PROJECTION
```

---

## 9. Projection Look

Los controles visuales actúan sobre la integración del contenido con el escenario.

### Opacity

Controla cuánto contenido proyectado domina sobre la superficie física.

### Brightness

Aumenta o reduce la luminosidad del contenido proyectado.

### Contrast

Ajusta la separación entre luces y sombras del contenido.

### Blend Mode

Modos disponibles actualmente:

- Screen
- Lighten
- Plus Lighter
- Normal
- Hard Light

No existe un blend universalmente correcto. El resultado depende de:

- color del soporte;
- brillo del fondo;
- tipo de contenido;
- apariencia deseada.

### Light Spill

Añade contaminación lumínica alrededor del área proyectada.

### Reflection

Simula una reflexión difusa del contenido sobre zonas cercanas de la escena.

---

## 10. Transform

La perspectiva base se conserva mediante la matriz `matrix3d()` del source baseline.

Sobre esa geometría se aplican:

- Scale
- Offset X
- Offset Y
- Rotate Z

La versión actual **no es todavía un editor de homografía de cuatro esquinas**.

Eso queda reservado para una fase futura de Architectural Video Mapping.

---

## 11. Cinema Beam

Cinema Beam intenta reproducir el comportamiento visual de un proyector de cine:

```text
PROJECTOR ORIGIN
       ●
      / \
     /   \
    /     \
   /       \
PROJECTION SURFACE
```

Controles actuales:

- Enable projector beam
- Origin X
- Origin Y
- Intensity
- Softness

El haz se abre desde un punto de origen hacia la zona proyectada.

### Color del haz

Cuando existe vídeo o imagen local, la herramienta utiliza una copia visual muy desenfocada y de baja opacidad del contenido para introducir cambios de color y movimiento dentro del haz.

Con fuentes YouTube embebidas no se muestrean píxeles del iframe debido a las restricciones del navegador; en ese caso se utiliza un haze neutro.

---

## 12. Volumetric Dust

Las partículas simulan polvo suspendido revelado por la luz del proyector.

No se distribuyen de manera completamente uniforme.

La lógica actual concentra aproximadamente la mayoría de partículas dentro del volumen definido entre:

- origen del proyector;
- superficie proyectada.

Controles:

- Dust in beam
- Density
- Speed
- Size
- Opacity

El objetivo visual es que las partículas sean una consecuencia del haz, no un efecto decorativo independiente.

---

## 13. Projection Text

La V0.4 recupera uno de los patrones del código fuente de Rubik Sota: una capa textual colocada **dentro del mismo plano transformado** que el vídeo.

Esto significa que el texto hereda automáticamente:

- perspectiva;
- escala;
- posición;
- rotación.

Controles actuales:

- Show text over projection
- Text
- Size
- Opacity
- Color

El texto se guarda junto con la configuración y también se incluye en:

- Standalone HTML;
- Embed generado.

Este recurso permite crear rápidamente:

- claims;
- titulares;
- mensajes de marca;
- títulos de exposición;
- copy promocional;
- información contextual dentro de una instalación.

---

## 14. Save / Restore

`Save settings` almacena la configuración de autoría en el navegador mediante `localStorage`.

Se guardan parámetros como:

- look de proyección;
- transform;
- background light;
- media display;
- beam;
- dust;
- projection text.

### Importante

Los archivos locales grandes no deben persistirse en `localStorage`.

Los vídeos e imágenes locales permanecen asociados a la sesión actual.

Una evolución futura puede utilizar IndexedDB si se necesita persistencia de proyectos con media local.

---

## 15. Preview Clean

`Preview clean` elimina temporalmente la interfaz de autoría y deja únicamente:

- escenario;
- proyección;
- beam;
- partículas;
- texto;
- efectos visuales.

Esto es útil para:

- revisar el resultado;
- presentar al cliente;
- grabar una salida limpia.

`ESC` permite salir del modo preview.

---

## 16. Output

La herramienta incluye actualmente:

### Record WebM

Utiliza captura de pantalla/pestaña mediante APIs del navegador y `MediaRecorder`.

La grabación puede incluir:

- escenario;
- vídeo;
- perspectiva;
- beam;
- partículas;
- texto;
- overlays visibles.

### Stop

Finaliza la grabación activa.

### Download Standalone HTML

Genera un documento HTML final que representa la experiencia sin incluir el panel de autoría.

Cuando es posible, los medios locales de la sesión se incorporan mediante Data URL.

### Copy Embed

Genera un iframe temporal para insertar la experiencia.

Actualmente utiliza un `Blob URL`, por lo que debe entenderse como una salida de sesión/local, no como URL pública permanente.

### Screenshot PNG

Genera una captura de la escena utilizando `html2canvas` cuando las restricciones CORS lo permiten.

---

## 17. CORS y restricciones del navegador

Al trabajar con medios remotos pueden aparecer limitaciones por:

- CORS;
- iframes cross-origin;
- autoplay;
- permisos de captura;
- MIME types;
- políticas del navegador.

Ejemplos:

- un vídeo remoto sin CORS correcto puede impedir determinadas exportaciones;
- YouTube dentro de iframe no puede tratarse como una textura o canvas local normal;
- screenshot de elementos cross-origin puede fallar;
- grabación requiere permiso explícito del usuario.

Estas limitaciones no son errores del motor de proyección, sino restricciones de seguridad del navegador.

---

## 18. Estado actual de alcance

### Implementado / baseline estable

- [x] Fondo personalizado
- [x] Vídeo local
- [x] Imagen local
- [x] URLs directas
- [x] YouTube source baseline
- [x] Play / Pause / Restart
- [x] Matrix3D Rubik baseline
- [x] Opacity
- [x] Brightness
- [x] Contrast
- [x] Blend modes
- [x] Light spill
- [x] Reflection
- [x] Background light
- [x] Transform ampliado
- [x] Media Fit
- [x] Flip X/Y
- [x] Projection visibility
- [x] Cinema Beam
- [x] Beam origin X/Y
- [x] Volumetric Dust
- [x] Projection Text
- [x] Save / Restore
- [x] Preview Clean
- [x] Record WebM
- [x] Standalone HTML
- [x] Embed temporal
- [x] Screenshot PNG

### No implementado todavía

- [ ] 4-corner perspective editor
- [ ] Homography calibration
- [ ] Architectural masks
- [ ] Multiple projection surfaces
- [ ] Multi-projector
- [ ] Window / column segmentation
- [ ] Advanced facade warping
- [ ] Persistent project files with IndexedDB
- [ ] Production publishing URL
- [ ] Deterministic offline video rendering

---

## 19. Futuro: Architectural Video Mapping

La siguiente evolución importante no debería consistir en seguir añadiendo sliders al editor actual.

El salto natural es:

```text
CUSTOM FACADE
      ↓
4 CORNER HANDLES
      ↓
PERSPECTIVE CALIBRATION
      ↓
ARCHITECTURAL MASKS
      ↓
MULTIPLE SURFACES
      ↓
VIDEO MAPPING
```

Esto transformaría la experiencia actual de Projection en un verdadero sistema de authoring para mapping arquitectónico.

---

## 20. Futuro: integración en Escaparates Pro

Este repositorio **no debe desaparecer** cuando se integre Projection en Escaparates Pro.

Debe mantenerse como:

```text
projection-video-mapping-experience
        │
        │ GOLDEN BASELINE / LAB
        ▼
selective port / adapter
        ▼
Escaparates Pro
└── Immersive Worlds
    └── Experiences
        └── Projection
```

### Regla de integración

No integrar mediante copia ciega del repositorio entero.

Adaptar únicamente las capacidades aprobadas:

- projection runtime;
- media handling específico;
- matrix / transform;
- projection look;
- cinema beam;
- dust;
- text layer;
- state.

### Output dentro de Escaparates Pro

Cuando se integre, Projection debería utilizar en la medida de lo posible el sistema común existente de Escaparates Pro para:

- serialización de medios;
- export de vídeo;
- standalone HTML;
- embed;
- final viewer;
- publicación.

De este modo Projection aporta su motor visual, pero no duplica innecesariamente infraestructura de producto ya existente.

---

## 21. Archivos principales

```text
README.md
SOURCE-NOTES.md
FINAL-V0.4-NOTES.md

index.html
index-v0-2.html
index-v0-3.html
index-v0-4.html

v0-2-enhancer.js
v0-3-enhancer.js
v0-4-final.js

.github/workflows/pages.yml
```

### `index.html`

Baseline V0 original y núcleo estable.

### `v0-3-enhancer.js`

Añade el refinamiento principal de producto:

- transform ampliado;
- beam;
- dust;
- media tools;
- preview;
- save/restore;
- output.

### `v0-4-final.js`

Añade el cierre funcional:

- background light extendido;
- botones darker/brighter;
- Projection Text;
- persistencia de texto;
- inclusión del texto en standalone HTML/embed.

### `SOURCE-NOTES.md`

Documentación de procedencia y decisiones del baseline.

### `FINAL-V0.4-NOTES.md`

Notas del cierre de la versión V0.4.

---

## 22. Principios de mantenimiento

1. **No romper el V0 core validado.**
2. Las mejoras deben ser preferentemente aditivas y reversibles.
3. Mantener un reset al source baseline siempre que sea posible.
4. No convertir este repo en una copia completa de Escaparates Pro.
5. No duplicar infraestructura común cuando la futura integración pueda usar servicios existentes de Escaparates Pro.
6. Probar visualmente antes de integrar cambios relevantes.
7. Separar authoring de final viewer.
8. Mantener media lifecycle y `ObjectURL` bajo control.
9. No prometer compatibilidad cross-origin que el navegador no puede garantizar.
10. Preservar este repositorio como referencia histórica del motor independiente.

---

## 23. Concepto de producto

Projection no debe entenderse únicamente como un "cine al aire libre".

El mismo motor puede evolucionar hacia experiencias como:

- Open Air Cinema;
- Museum Projection;
- Digital Art Installation;
- Gallery Media Wall;
- Rooftop Projection;
- Beach Cinema;
- Branded Environment;
- Architectural Media;
- Cultural Video Mapping;
- Retail Projection;
- Custom Facade Mapping.

La escena y el contenido cambian; el motor de Projection permanece.

---

## 24. Referencias

### Fuente visual / técnica principal

`Juanmaes83/rubiksotamovil`

Uso relevante:

- Director's Cut projection geometry;
- matrix3d baseline;
- projection opacity / blend;
- light integration;
- text layer pattern;
- GSAP reveal concept.

### Escaparates Pro

`Juanmaes83/escaparates-pro`

No fue modificado durante el desarrollo standalone de esta experiencia.

Se utiliza como referencia para la futura integración y para reutilizar selectivamente patrones de:

- export;
- standalone viewer;
- media serialization;
- embed;
- final output.

---

## 25. Estado de cierre

**Projection / Video Mapping Experience V0.4 está aprobada y mergeada en `main` como baseline estable.**

La siguiente decisión de producto es una de estas dos:

```text
A. Integrar Projection como Experience dentro de Immersive Worlds

B. Evolucionar primero hacia 4-corner / Architectural Video Mapping
```

Hasta entonces, `main/index-v0-4.html` debe tratarse como la referencia funcional aprobada.
