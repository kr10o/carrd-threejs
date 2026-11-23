# Carrd3.js animation prompt collection

**100 simple Three.js loop prompts + 100 corresponding CSS animation prompts.** Written in English for coding assistants, with matching IDs, explicit loop durations and concrete visual instructions. Created 2026-11-23.

## Open the lists

| File | Contents |
| --- | --- |
| [100-threejs-loop-prompts.md](100-threejs-loop-prompts.md) | 100 Three.js prompts that download/load actual web-hosted GLB models |
| [100-css-loop-prompts.md](100-css-loop-prompts.md) | 100 matched CSS substitutes, wrappers and decorative companions |
| [pairing-index.md](pairing-index.md) | Side-by-side links to all 100 pairs, their roles and durations |
| [model-sources.md](model-sources.md) | 27 pinned model downloads, original file sizes, provenance links and loading notes |
| [prompt-pairs.json](prompt-pairs.json) | All 100 pairs, shared briefs and source metadata in machine-readable form |

These are implementation prompts, not 200 built or browser-tested animation demos. The 27 verified source paths are intentionally reused across different motions and compositions. The prompt files themselves do not download models into this repository.

## How to use a prompt

1. Choose a numbered pair from the index.
2. Copy the relevant shared brief at the beginning of that list, followed by that numbered prompt, into a coding assistant.
3. For the Three.js version, use its exact binary URL or download an optimized local copy and keep the credits. For the CSS version, build the requested HTML/CSS artwork or prepare the listed static views.
4. Ask the coding assistant to deliver the working files and verify loading, loop continuity, mobile layout, pause and reduced motion.

For JSON-driven use, concatenate `sharedBriefs.threejs` with `pairs[i].threejsPrompt`, or `sharedBriefs.css` with `pairs[i].cssPrompt`. IDs are 1–100; array indices are 0–99.

## What CSS takes over

| Role | Count | What it does | What remains |
| --- | ---: | --- | --- |
| CSS substitute | 59 | Recreates the idea using HTML shapes, CSS 3D faces, static SVG or prepared product images | No WebGL is needed for that substitute; complex 3D appearance is approximated |
| CSS wrapper | 18 | Animates a fixed-view image or canvas with transforms/opacity | A canvas still needs initialization and redraws when resized or its actual scene changes |
| CSS companion | 23 | Takes over a specific decorative layer such as dots, rings, labels, frames or backgrounds | Three.js still renders any changing meshes, lighting, camera, materials or skeletal animation |

CSS controls DOM elements and the canvas rectangle. It cannot directly replace a Three.js mesh transform, a bone animation, a morph target or physical lighting inside the canvas. A static rendered view can stop its continuous render loop; a changing 3D scene cannot. The shared briefs make that distinction explicit.

Transform/opacity animation often avoids layout work, but CSS is not a blanket performance guarantee. Profile the chosen implementation, especially clipping, masks, layers and large images. See the [MDN animation-performance guidance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance).

## Categories

| Pair IDs | Theme |
| --- | --- |
| 001–010 | Product showcases |
| 011–020 | Objects and accessories |
| 021–030 | Food and playful scenes |
| 031–040 | Vehicles and travel |
| 041–050 | Interiors and decor |
| 051–060 | Characters and mascots |
| 061–070 | Small group choreography |
| 071–080 | Geometric loops from a downloaded model |
| 081–090 | Lighting and graphic accents |
| 091–100 | Carrd hero and interface loops |

## Defaults used throughout

- Plain HTML/CSS/JavaScript, static hosting and no build step; suitable for a scoped Carrd fragment or a hosted iframe.
- One exact Three.js release shared by core and addons, direct GLB URLs and model-source credits.
- Time-based seamless loops, conservative scene complexity, reusable objects and no physics engine.
- Responsive sizing, static reduced-motion states, accessible pause controls and loading/error fallbacks.
- CSS motion without per-frame JavaScript. Minimal initialization or event handling is allowed only where the wrapper or integration needs it.

## Verification of this collection

Checked exactly 100 consecutive IDs in each list, 100 unique prompt titles and bodies per list, matching pair durations, 100 index rows and valid source-key references. All 27 binary paths and source links were checked against repository metadata at their pinned revisions. Sizes and metadata are recorded in the source table and JSON. Runtime rendering and performance verification belong to implementation of the selected prompt.
