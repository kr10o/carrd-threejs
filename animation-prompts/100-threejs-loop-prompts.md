# 100 simple Three.js loop animation prompts

Exactly 100 prompts, paired by ID with [100 CSS prompts](100-css-loop-prompts.md). Each scene uses a downloaded GLB. Reusing a verified model for different loops is intentional: this is 100 animation ideas using 27 source models, not a promise of 100 different models.

Copy the shared brief below together with one prompt. For programmatic use, [prompt-pairs.json](prompt-pairs.json) contains both shared briefs and all prompt strings. Model URLs are revision-pinned; see [model sources and sizes](model-sources.md).

## Shared Three.js brief

```text
Build one small responsive animation for Carrd3.js using plain HTML, CSS and JavaScript, without Node.js, a framework or a build step. Deliver index.html, style.css, script.js and a short usage/credits note. Scope all selectors and DOM queries under one unique scene root so several examples can coexist.

Use Three.js ES modules and GLTFLoader through an import map. Choose and record one tested release, pin both core and addons to it, and serve locally over HTTP or deploy to static hosting. Keep the requested scene self-contained; use simple primitives only for supporting floors, rings, brackets or stages.

Download the supplied pinned GLB once during preparation and serve a local copy when practical. Alternatively load its exact HTTPS binary URL if CORS works. Fetch once per scene initialization, never per frame. Keep any external buffers/textures referenced by an asset at valid relative paths. Inspect required extensions and configure only necessary decoders. Retain the model's source and all required credits. Do not assume a repository page is a model download.

Inspect bounds, forward/up axes, materials, bones and animation clips before setting pivots. Center/normalize through outer groups, preserving internal skeletons and mesh transforms. Use the shoe's default material unless variants are explicitly requested. Use SkeletonUtils.clone for independent skinned clones, and clone materials only when properties must differ.

Use one time-based animation loop with normalized phase p=(elapsed % duration)/duration. Match the first and last visible states, including opacity, rotation, camera and animation pose. Use sine/cosine or eased segments for oscillations and linear timing for constant spins. For ping-pong playback, the stated duration covers the complete forward-and-back cycle. Reset traveling objects only offscreen or at zero opacity. Do not accumulate transforms frame by frame or create objects inside the render loop.

Keep one modest canvas, a fixed camera unless specified, one or two simple lights, and DPR capped at 1.5 by default. Prefer a static environment and an inexpensive fake shadow to dynamic shadow maps. Use a small procedural studio environment if needed; any extra downloaded environment must have its own source and credits. Avoid physics engines, GSAP, post-processing and custom shaders unless essential to the stated effect.

Budget the shipped scene separately from the motion: several source GLBs here are 7–17 MB. Aim for a measured model download under about 2 MiB and textures near 1K for a small hero, optimizing a local copy where needed. Report actual size and tradeoffs; this target is not a claim that the upstream file already meets it.

Reserve dimensions to prevent layout shifts. Resize with ResizeObserver. Pause when offscreen or hidden and preserve elapsed animation time when resuming. Under prefers-reduced-motion show a useful static pose and stop continuous rendering. Include a visible accessible pause control, loading status, an error message and a static fallback. On removal, stop the loop, remove listeners/observers, and dispose owned resources without breaking shared assets.

Expose duration, amplitude, colors and model URL in one small configuration block. Keep heading, CTA and meaningful text in accessible HTML. Provide a standalone preview plus a clearly separated fragment or hosted-iframe integration note for Carrd; respect the surrounding page's import map rather than injecting conflicting maps.

Verify the chosen demo at narrow and wide sizes and across at least two loop boundaries. Check model loading, reduced motion, pause/resume and failure fallback. For any CSS companion, keep CSS time and JS time independent unless synchronization matters; if it does, use one initial phase and shared pause state without per-frame DOM writes.
```

## Prompts

## 1–10: Product showcases

### 001 T-shirt showroom turn

**Loop:** 8s · **Assets:** TShirt · **CSS pair:** [001 — Two-sided T-shirt card](100-css-loop-prompts.md#001-two-sided-t-shirt-card)

```text
Create a responsive no-build Three.js loop titled "T-shirt showroom turn" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load TShirt with GLTFLoader from:
https://raw.githubusercontent.com/kr10o/carrd-threejs/18e78bb98b1719bf8d7a1dc731365d247668bd26/tshirt.glb

Build a clean streetwear hero around the downloaded T-shirt. Center it in a pivot and rotate that pivot through one full Y turn in 8 seconds at constant speed. Keep the camera and two soft lights fixed, with a small static ground shadow. Expose shirt scale and background color; use the original garment geometry without cloth simulation.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 002 Floating sneaker

**Loop:** 4s · **Assets:** MaterialsVariantsShoe · **CSS pair:** [002 — Sneaker poster levitation](100-css-loop-prompts.md#002-sneaker-poster-levitation)

```text
Create a responsive no-build Three.js loop titled "Floating sneaker" with a complete repeat period of 4 seconds. Apply the shared Three.js brief.

Download/load MaterialsVariantsShoe with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb

Load the shoe's default material and frame a fixed three-quarter view. Move its outer group up and down by 4% of its height over 4 seconds, without rotating it. Scale a soft shadow slightly in the opposite direction. Keep lighting constant and avoid material-variant plugins for this example.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 003 Bottle pendulum

**Loop:** 5s · **Assets:** WaterBottle · **CSS pair:** [003 — Bottle hanging swing](100-css-loop-prompts.md#003-bottle-hanging-swing)

```text
Create a responsive no-build Three.js loop titled "Bottle pendulum" with a complete repeat period of 5 seconds. Apply the shared Three.js brief.

Download/load WaterBottle with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/WaterBottle/glTF-Binary/WaterBottle.glb

Download the bottle and pivot the entire model around a point just above its cap. Swing it smoothly between -8 and +8 degrees in the image plane over 5 seconds. Use an orthographic front camera and an unlit material option for a graphic result. Keep the bottle rigid and its cap attached.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 004 Sunglasses gentle yaw

**Loop:** 6s · **Assets:** SunglassesKhronos · **CSS pair:** [004 — Sunglasses perspective sway](100-css-loop-prompts.md#004-sunglasses-perspective-sway)

```text
Create a responsive no-build Three.js loop titled "Sunglasses gentle yaw" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load SunglassesKhronos with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SunglassesKhronos/glTF-Binary/SunglassesKhronos.glb

Present the downloaded sunglasses at a comfortable close-up scale. Oscillate the whole model's Y rotation between -18 and +18 degrees over 6 seconds. Keep lens materials intact and provide a neutral studio environment so the frame remains visible. Do not open the arms or assume hinge node names.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 005 Watch display tilt

**Loop:** 8s · **Assets:** ChronographWatch · **CSS pair:** [005 — Watch card tilt](100-css-loop-prompts.md#005-watch-card-tilt)

```text
Create a responsive no-build Three.js loop titled "Watch display tilt" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load ChronographWatch with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ChronographWatch/glTF-Binary/ChronographWatch.glb

Show the entire watch as a fixed-size product display. Over 8 seconds, pitch it from -10 to +10 degrees and back while keeping its center stationary. Do not alter the clock hands. Use soft studio illumination and keep every part within the camera bounds at both extremes.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 006 Helmet orbiting light

**Loop:** 10s · **Assets:** DamagedHelmet · **CSS pair:** [006 — Helmet sheen sweep](100-css-loop-prompts.md#006-helmet-sheen-sweep)

```text
Create a responsive no-build Three.js loop titled "Helmet orbiting light" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load DamagedHelmet with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb

Keep the downloaded helmet stationary and move one point light in a circular orbit around it over 10 seconds. Use a low constant fill so the back of the light path never makes the product disappear. Cap light intensity and avoid shadows or post-processing for this small material study.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 007 Corset breathing display

**Loop:** 6s · **Assets:** Corset · **CSS pair:** [007 — Garment breathing poster](100-css-loop-prompts.md#007-garment-breathing-poster)

```text
Create a responsive no-build Three.js loop titled "Corset breathing display" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load Corset with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Corset/glTF-Binary/Corset.glb

Load and center the corset, then apply a subtle uniform 1.00-to-1.025-to-1.00 scale pulse over 6 seconds. Keep the camera, orientation and light direction fixed. Treat it as a stylized display pulse, not cloth deformation or a breathing-body simulation. Leave sufficient framing room around the widest state.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 008 Chair quarter-view reveal

**Loop:** 8s · **Assets:** SheenChair · **CSS pair:** [008 — Chair silhouette reveal](100-css-loop-prompts.md#008-chair-silhouette-reveal)

```text
Create a responsive no-build Three.js loop titled "Chair quarter-view reveal" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load SheenChair with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SheenChair/glTF-Binary/SheenChair.glb

Rotate the downloaded chair's outer pivot from -30 to +30 degrees in Y and back over 8 seconds, slowing gently at the ends. Preserve the fabric material. Use a fixed perspective camera and an inexpensive static contact-shadow decal. Do not spin the camera or animate individual cushions.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 009 Silk pouf hover

**Loop:** 5s · **Assets:** SpecularSilkPouf · **CSS pair:** [009 — Pouf cushion float](100-css-loop-prompts.md#009-pouf-cushion-float)

```text
Create a responsive no-build Three.js loop titled "Silk pouf hover" with a complete repeat period of 5 seconds. Apply the shared Three.js brief.

Download/load SpecularSilkPouf with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SpecularSilkPouf/glTF-Binary/SpecularSilkPouf.glb

Suspend the pouf slightly above a simple floor. Bob it vertically through 3% of its height on a 5-second sine loop, with its rotation fixed. Add a static studio environment to keep the silk visible. Animate only the outer group and a cheap ground-shadow scale; skip soft-body physics.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 010 Shoe two-view fade

**Loop:** 8s · **Assets:** MaterialsVariantsShoe · **CSS pair:** [010 — Product view crossfade](100-css-loop-prompts.md#010-product-view-crossfade)

```text
Create a responsive no-build Three.js loop titled "Shoe two-view fade" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load MaterialsVariantsShoe with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb

Create two pre-positioned views of the same downloaded shoe, front and side, using two groups or two render-to-image snapshots. Hold each view and crossfade during the middle and end of an 8-second cycle. If fading meshes, clone materials and handle transparent depth ordering. Prefer snapshots when no live 3D interaction is required.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

## 11–20: Objects and accessories

### 011 Boombox bass bounce

**Loop:** 2s · **Assets:** BoomBox · **CSS pair:** [011 — Boombox beat badge](100-css-loop-prompts.md#011-boombox-beat-badge)

```text
Create a responsive no-build Three.js loop titled "Boombox bass bounce" with a complete repeat period of 2 seconds. Apply the shared Three.js brief.

Download/load BoomBox with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/BoomBox/glTF-Binary/BoomBox.glb

Load the boombox and make its entire rigid group bounce vertically once every 2 seconds. Use a small 5%-height lift and a smooth landing without overshoot through the ground. Add two simple translucent rings in front of the speakers with matching scale pulses. Use a fixed rhythm, not microphone or audio analysis.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 012 Vintage camera nod

**Loop:** 5s · **Assets:** AntiqueCamera · **CSS pair:** [012 — Camera icon nod](100-css-loop-prompts.md#012-camera-icon-nod)

```text
Create a responsive no-build Three.js loop titled "Vintage camera nod" with a complete repeat period of 5 seconds. Apply the shared Three.js brief.

Download/load AntiqueCamera with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb

Frame the downloaded antique camera and gently rotate its whole group around X by plus or minus 5 degrees over 5 seconds. Find the center from its bounding box instead of assuming its source origin. Keep the lens fixed relative to the body and use a calm warm background.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 013 Lantern hanging arc

**Loop:** 6s · **Assets:** Lantern · **CSS pair:** [013 — Lantern swing](100-css-loop-prompts.md#013-lantern-swing)

```text
Create a responsive no-build Three.js loop titled "Lantern hanging arc" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load Lantern with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Lantern/glTF-Binary/Lantern.glb

Download the lantern and set a pivot at the top of its handle. Swing the rigid lantern left and right by 7 degrees over 6 seconds. Keep its internal light at constant intensity and avoid dynamic shadows. Use a front orthographic camera so the arc is easy to read.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 014 Two helmets counter-turn

**Loop:** 10s · **Assets:** DamagedHelmet · **CSS pair:** [014 — Counter-rotating helmet medallions](100-css-loop-prompts.md#014-counter-rotating-helmet-medallions)

```text
Create a responsive no-build Three.js loop titled "Two helmets counter-turn" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load DamagedHelmet with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb

Load one helmet and make two visible clones with shared immutable geometry. Place them side by side and rotate their outer groups in opposite Y directions, one turn each over 10 seconds. Keep lighting shared and avoid duplicating texture downloads. Both groups must return to the same visual orientation at the loop boundary.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 015 Floating sunglasses figure eight

**Loop:** 8s · **Assets:** SunglassesKhronos · **CSS pair:** [015 — Sunglasses figure-eight drift](100-css-loop-prompts.md#015-sunglasses-figure-eight-drift)

```text
Create a responsive no-build Three.js loop titled "Floating sunglasses figure eight" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load SunglassesKhronos with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SunglassesKhronos/glTF-Binary/SunglassesKhronos.glb

Use a front orthographic camera and keep the sunglasses' orientation fixed. Move the outer group along x=A*sin(theta), y=B*sin(2*theta) over 8 seconds, with amplitudes below 12% of the viewport. Use no camera movement. The figure eight must close without a position or velocity jump.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 016 Watch display with ticking marker

**Loop:** 12s · **Assets:** ChronographWatch · **CSS pair:** [016 — Twelve-step dial](100-css-loop-prompts.md#016-twelve-step-dial)

```text
Create a responsive no-build Three.js loop titled "Watch display with ticking marker" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load ChronographWatch with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ChronographWatch/glTF-Binary/ChronographWatch.glb

Show the downloaded watch as a static background and add a separate simple hand mesh slightly in front of its dial. Rotate this decorative marker in twelve discrete steps over 12 seconds. Locate the dial plane explicitly after inspecting the model; do not guess a named clock-hand node. Make clear this is an animation, not local time.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 017 Camera flash accent

**Loop:** 6s · **Assets:** AntiqueCamera · **CSS pair:** [017 — Soft camera flash](100-css-loop-prompts.md#017-soft-camera-flash)

```text
Create a responsive no-build Three.js loop titled "Camera flash accent" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load AntiqueCamera with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb

Keep the downloaded camera stationary. Add a small soft white sprite near its flash position and pulse its opacity gently once in each 6-second cycle. Use a short fade up and a longer fade down rather than a strobe. Keep the actual scene lighting unchanged and do not wash out the whole viewport.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 018 Boombox signal bars

**Loop:** 4s · **Assets:** BoomBox · **CSS pair:** [018 — CSS equalizer bars](100-css-loop-prompts.md#018-css-equalizer-bars)

```text
Create a responsive no-build Three.js loop titled "Boombox signal bars" with a complete repeat period of 4 seconds. Apply the shared Three.js brief.

Download/load BoomBox with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/BoomBox/glTF-Binary/BoomBox.glb

Place the boombox beneath five small bar meshes. Scale the bars vertically through a fixed staggered pattern that repeats after 4 seconds, with their bottoms anchored to a common baseline. Keep the model itself static. Do not request audio permissions or pretend that the bars respond to live music.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 019 Lantern warm halo

**Loop:** 5s · **Assets:** Lantern · **CSS pair:** [019 — Breathing lantern halo](100-css-loop-prompts.md#019-breathing-lantern-halo)

```text
Create a responsive no-build Three.js loop titled "Lantern warm halo" with a complete repeat period of 5 seconds. Apply the shared Three.js brief.

Download/load Lantern with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Lantern/glTF-Binary/Lantern.glb

Display a stationary downloaded lantern with a soft billboard halo behind it. Pulse only the halo's opacity from 0.2 to 0.5 and back over 5 seconds. Keep the emissive material and light intensity constant. Render the halo without depth-writing and ensure it does not cover the product's silhouette.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 020 Accessory carousel

**Loop:** 12s · **Assets:** SunglassesKhronos · **CSS pair:** [020 — Three-card accessory carousel](100-css-loop-prompts.md#020-three-card-accessory-carousel)

```text
Create a responsive no-build Three.js loop titled "Accessory carousel" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load SunglassesKhronos with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SunglassesKhronos/glTF-Binary/SunglassesKhronos.glb

Clone the downloaded sunglasses three times and arrange them around a small circular stage. Rotate their parent group one turn over 12 seconds. Keep the camera fixed and make sure foreground and background models remain inside the view. Reuse geometry and materials; use no physics and no individual hinge animation.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

## 21–30: Food and playful scenes

### 021 Avocado slow tumble

**Loop:** 10s · **Assets:** Avocado · **CSS pair:** [021 — Avocado sticker tumble](100-css-loop-prompts.md#021-avocado-sticker-tumble)

```text
Create a responsive no-build Three.js loop titled "Avocado slow tumble" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load Avocado with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Avocado/glTF-Binary/Avocado.glb

Float the downloaded avocado against a pale background. Rotate its centered outer pivot once around a fixed diagonal axis over 10 seconds using a quaternion. Keep its center and scale fixed. Choose an axis that shows both the cut face and skin, with no lighting or camera animation.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 022 Avocado seed spotlight

**Loop:** 6s · **Assets:** Avocado · **CSS pair:** [022 — Seed focus ring](100-css-loop-prompts.md#022-seed-focus-ring)

```text
Create a responsive no-build Three.js loop titled "Avocado seed spotlight" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load Avocado with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Avocado/glTF-Binary/Avocado.glb

Keep the avocado fixed with its cut face toward the camera. Add a thin ring in a plane just in front of the seed and pulse the ring from 90% to 110% scale over 6 seconds. Position the ring from an inspected reference point rather than searching for an assumed seed node.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 023 Fish gentle cruise

**Loop:** 8s · **Assets:** BarramundiFish · **CSS pair:** [023 — Fish side drift](100-css-loop-prompts.md#023-fish-side-drift)

```text
Create a responsive no-build Three.js loop titled "Fish gentle cruise" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load BarramundiFish with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/BarramundiFish/glTF-Binary/BarramundiFish.glb

Orient the downloaded fish in side profile and move its whole rigid group left to right and back across a narrow range over 8 seconds. Add a small vertical sine bob with the same period. Keep the fish facing one direction throughout and describe it as a display drift, with no implied fin or skeletal animation.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 024 Fish bubble trail

**Loop:** 6s · **Assets:** BarramundiFish · **CSS pair:** [024 — Six rising bubbles](100-css-loop-prompts.md#024-six-rising-bubbles)

```text
Create a responsive no-build Three.js loop titled "Fish bubble trail" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load BarramundiFish with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/BarramundiFish/glTF-Binary/BarramundiFish.glb

Keep a side-view fish model still and spawn no new objects during playback. Reuse six small sphere meshes as bubbles: rise, grow slightly, fade, then reset only while invisible. Stagger their phases across a 6-second master loop. Place the bubbles beside the fish so transparency sorting stays simple.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 025 Duck water bob

**Loop:** 4s · **Assets:** Duck · **CSS pair:** [025 — Rubber-duck bob](100-css-loop-prompts.md#025-rubber-duck-bob)

```text
Create a responsive no-build Three.js loop titled "Duck water bob" with a complete repeat period of 4 seconds. Apply the shared Three.js brief.

Download/load Duck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Duck/glTF-Binary/Duck.glb

Load the duck above a flat blue disk. Bob its outer group up and down by 3% of its height and roll it by plus or minus 3 degrees in a 4-second loop. Keep the water disk static. Use an orthographic front camera and a flat-shaded option for a small, cheerful hero.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 026 Duck ripple rings

**Loop:** 5s · **Assets:** Duck · **CSS pair:** [026 — Pond ripple ellipses](100-css-loop-prompts.md#026-pond-ripple-ellipses)

```text
Create a responsive no-build Three.js loop titled "Duck ripple rings" with a complete repeat period of 5 seconds. Apply the shared Three.js brief.

Download/load Duck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Duck/glTF-Binary/Duck.glb

Keep the duck stationary and add three flat ring meshes under it. Expand and fade each ring on a 5-second loop with one-third-cycle offsets. Reset rings only at zero opacity. Avoid a water shader and render the rings slightly above the water plane to prevent z-fighting.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 027 Three avocados on a wheel

**Loop:** 12s · **Assets:** Avocado · **CSS pair:** [027 — Avocado orbital menu](100-css-loop-prompts.md#027-avocado-orbital-menu)

```text
Create a responsive no-build Three.js loop titled "Three avocados on a wheel" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load Avocado with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Avocado/glTF-Binary/Avocado.glb

Load one avocado and create three lightweight clones. Arrange them at equal angles in the XY plane and rotate their common parent around Z through one turn in 12 seconds. Counter-rotate each child if you want all cut faces to remain upright. Use an orthographic camera and fixed soft lighting.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 028 Bottle hydration pulse

**Loop:** 4s · **Assets:** WaterBottle · **CSS pair:** [028 — Bottle fill meter](100-css-loop-prompts.md#028-bottle-fill-meter)

```text
Create a responsive no-build Three.js loop titled "Bottle hydration pulse" with a complete repeat period of 4 seconds. Apply the shared Three.js brief.

Download/load WaterBottle with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/WaterBottle/glTF-Binary/WaterBottle.glb

Show the downloaded bottle at rest and add a separate blue vertical plane behind its silhouette. Scale this plane upward and down again over 4 seconds, anchored at its bottom. Treat it as a graphic hydration meter rather than liquid inside the mesh. Keep the bottle's original material unchanged.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 029 Duck peekaboo

**Loop:** 6s · **Assets:** Duck · **CSS pair:** [029 — Duck window peek](100-css-loop-prompts.md#029-duck-window-peek)

```text
Create a responsive no-build Three.js loop titled "Duck peekaboo" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load Duck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Duck/glTF-Binary/Duck.glb

Animate the duck upward from behind an opaque low wall, hold briefly, then lower it below the wall within a 6-second loop. Use a smooth piecewise timeline with identical start and end positions. Keep the wall, camera and lights fixed; do not rely on an opacity jump to hide the return.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 030 Two-duck seesaw

**Loop:** 8s · **Assets:** Duck · **CSS pair:** [030 — Toy seesaw loop](100-css-loop-prompts.md#030-toy-seesaw-loop)

```text
Create a responsive no-build Three.js loop titled "Two-duck seesaw" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load Duck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Duck/glTF-Binary/Duck.glb

Download the duck and use two clones on opposite ends of a simple beam. Rotate the beam and both attached ducks around a central Z pivot from -8 to +8 degrees and back over 8 seconds. Keep the assembly rigid and put a small static support under the pivot. Use no collision solver.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

## 31–40: Vehicles and travel

### 031 Toy car showroom

**Loop:** 10s · **Assets:** ToyCar · **CSS pair:** [031 — Car showcase card](100-css-loop-prompts.md#031-car-showcase-card)

```text
Create a responsive no-build Three.js loop titled "Toy car showroom" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load ToyCar with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ToyCar/glTF-Binary/ToyCar.glb

Load the toy car, center it on a low static platform, and rotate the whole car around Y once in 10 seconds. Keep wheels attached and do not assume wheel node names. Use a fixed three-quarter camera and broad studio lighting, with no real-time shadows.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 032 Milk truck lane loop

**Loop:** 8s · **Assets:** CesiumMilkTruck · **CSS pair:** [032 — Delivery truck crossing](100-css-loop-prompts.md#032-delivery-truck-crossing)

```text
Create a responsive no-build Three.js loop titled "Milk truck lane loop" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load CesiumMilkTruck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb

Move the downloaded truck from just outside the left edge to just outside the right edge over 8 seconds using an orthographic side view. Reset only while fully beyond the crop. Keep all wheels rigid for the simplest version and show a static road stripe below the truck.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 033 Car suspension impression

**Loop:** 3s · **Assets:** ToyCar · **CSS pair:** [033 — Road-bump car bounce](100-css-loop-prompts.md#033-road-bump-car-bounce)

```text
Create a responsive no-build Three.js loop titled "Car suspension impression" with a complete repeat period of 3 seconds. Apply the shared Three.js brief.

Download/load ToyCar with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ToyCar/glTF-Binary/ToyCar.glb

Keep the toy car at a fixed horizontal position and bob the entire group vertically by 1.5% of its height over 3 seconds. Add a small fore-aft pitch below 2 degrees. This is a stylized motion of the whole car, not a suspension simulation or independently rotating wheels.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 034 Traffic-cone caution wobble

**Loop:** 4s · **Assets:** TrafficCone · **CSS pair:** [034 — Wobbling caution cone](100-css-loop-prompts.md#034-wobbling-caution-cone)

```text
Create a responsive no-build Three.js loop titled "Traffic-cone caution wobble" with a complete repeat period of 4 seconds. Apply the shared Three.js brief.

Download/load TrafficCone with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/TrafficCone/glTF-Binary/TrafficCone.glb

Download the traffic cone and set its pivot at the center of the base. Rock it between -6 and +6 degrees around Z over 4 seconds without letting the base drift sideways. Use a front orthographic camera, fixed lighting and no physics. Keep the contact area visually anchored.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 035 Two trucks passing

**Loop:** 10s · **Assets:** CesiumMilkTruck · **CSS pair:** [035 — Opposing delivery lanes](100-css-loop-prompts.md#035-opposing-delivery-lanes)

```text
Create a responsive no-build Three.js loop titled "Two trucks passing" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load CesiumMilkTruck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb

Load the truck once and create two clones in separate horizontal lanes. Move them in opposite directions across the frame over 10 seconds, resetting each only when completely offscreen. Rotate the second whole model to face its travel direction. Keep a fixed side camera and avoid any collision logic.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 036 Toy-car circular track

**Loop:** 12s · **Assets:** ToyCar · **CSS pair:** [036 — Top-view circular car](100-css-loop-prompts.md#036-top-view-circular-car)

```text
Create a responsive no-build Three.js loop titled "Toy-car circular track" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load ToyCar with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ToyCar/glTF-Binary/ToyCar.glb

Move the toy car around a small flat circular track once in 12 seconds. Position it with sine and cosine and orient its forward axis tangent to the circle after inspecting the asset orientation. Keep the camera elevated and fixed. Skip wheel animation, tire physics and steering joints.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 037 Cone conveyor

**Loop:** 8s · **Assets:** TrafficCone · **CSS pair:** [037 — Endless cone strip](100-css-loop-prompts.md#037-endless-cone-strip)

```text
Create a responsive no-build Three.js loop titled "Cone conveyor" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load TrafficCone with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/TrafficCone/glTF-Binary/TrafficCone.glb

Load one cone and create four evenly spaced clones on a straight conveyor. Translate the sequence at constant speed so an identical cone replaces the first after 8 seconds. Hide the wrap outside the camera crop and keep spacing exact. Use a fixed front view and no moving conveyor geometry.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 038 Truck delivery ring

**Loop:** 5s · **Assets:** CesiumMilkTruck · **CSS pair:** [038 — Delivery notification ripple](100-css-loop-prompts.md#038-delivery-notification-ripple)

```text
Create a responsive no-build Three.js loop titled "Truck delivery ring" with a complete repeat period of 5 seconds. Apply the shared Three.js brief.

Download/load CesiumMilkTruck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb

Keep a small truck model stationary in the center of the frame. Add a flat ring behind it that grows from 60% to 160% of the truck's width and fades out over 5 seconds. Restart the ring only at zero opacity. Use the effect as a delivery-status illustration, not a progress indicator.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 039 Car inspection camera arc

**Loop:** 10s · **Assets:** ToyCar · **CSS pair:** [039 — Car layered parallax sway](100-css-loop-prompts.md#039-car-layered-parallax-sway)

```text
Create a responsive no-build Three.js loop titled "Car inspection camera arc" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load ToyCar with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ToyCar/glTF-Binary/ToyCar.glb

Keep the toy car stationary and move the camera along a short horizontal arc from -25 to +25 degrees and back over 10 seconds. Aim at the model center throughout. Maintain constant orbit radius and camera height, with fixed lights. Show a real parallax change using only one camera and one model.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 040 Cone slalom camera illusion

**Loop:** 8s · **Assets:** TrafficCone · **CSS pair:** [040 — Cone depth layers](100-css-loop-prompts.md#040-cone-depth-layers)

```text
Create a responsive no-build Three.js loop titled "Cone slalom camera illusion" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load TrafficCone with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/TrafficCone/glTF-Binary/TrafficCone.glb

Arrange three downloaded cone clones across a shallow stage and keep them static. Move the camera laterally left and right over 8 seconds while looking at the stage center. Use a restrained travel distance and a fixed focal length so the effect stays calm and visibly loops.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

## 41–50: Interiors and decor

### 041 Sofa slow inspection

**Loop:** 10s · **Assets:** GlamVelvetSofa · **CSS pair:** [041 — Sofa perspective panel](100-css-loop-prompts.md#041-sofa-perspective-panel)

```text
Create a responsive no-build Three.js loop titled "Sofa slow inspection" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load GlamVelvetSofa with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb

Load the sofa and rock its outer Y pivot gently from -20 to +20 degrees and back over 10 seconds. Keep the camera and floor fixed and preserve its upholstery material. Use a restrained studio environment and leave extra horizontal framing for the sofa arms at the widest angle.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 042 Chair floating seat display

**Loop:** 6s · **Assets:** SheenChair · **CSS pair:** [042 — Floating chair poster](100-css-loop-prompts.md#042-floating-chair-poster)

```text
Create a responsive no-build Three.js loop titled "Chair floating seat display" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load SheenChair with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SheenChair/glTF-Binary/SheenChair.glb

Float the complete downloaded chair 4% of its height upward and back over 6 seconds. Keep its orientation fixed and use a front orthographic camera. Add an ellipse below as a decorative contact shadow with inverse scale. The whole chair moves as one rigid object.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 043 Vase gentle sway

**Loop:** 8s · **Assets:** GlassVaseFlowers · **CSS pair:** [043 — Flower-vase sway](100-css-loop-prompts.md#043-flower-vase-sway)

```text
Create a responsive no-build Three.js loop titled "Vase gentle sway" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load GlassVaseFlowers with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/GlassVaseFlowers/glTF-Binary/GlassVaseFlowers.glb

Center the vase-and-flowers model and pivot the entire assembly at its base. Sway it by plus or minus 2 degrees around Z over 8 seconds. Keep flowers rigid relative to the vase and do not simulate stems. Use a simple environment so glass is visible without expensive extra effects.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 044 Refrigerator reveal from below

**Loop:** 8s · **Assets:** CommercialRefrigerator · **CSS pair:** [044 — Appliance rise-and-hide](100-css-loop-prompts.md#044-appliance-rise-and-hide)

```text
Create a responsive no-build Three.js loop titled "Refrigerator reveal from below" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load CommercialRefrigerator with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CommercialRefrigerator/glTF-Binary/CommercialRefrigerator.glb

Download the refrigerator and slide its complete group upward from below the frame, hold it, then slide back down across an 8-second loop. Use an orthographic frontal view with an opaque foreground plinth to conceal the lower endpoint. Keep doors shut and do not depend on articulated door nodes.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 045 Pouf side-to-side roll impression

**Loop:** 6s · **Assets:** SpecularSilkPouf · **CSS pair:** [045 — Cushion side wobble](100-css-loop-prompts.md#045-cushion-side-wobble)

```text
Create a responsive no-build Three.js loop titled "Pouf side-to-side roll impression" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load SpecularSilkPouf with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SpecularSilkPouf/glTF-Binary/SpecularSilkPouf.glb

Move the complete pouf gently left and right while rolling it only 5 degrees around Z over 6 seconds. Keep its height fixed and call this a stylized display motion rather than physically accurate rolling. Use a front orthographic camera and do not deform its mesh.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 046 Three chairs staggered lift

**Loop:** 6s · **Assets:** SheenChair · **CSS pair:** [046 — Chair wave row](100-css-loop-prompts.md#046-chair-wave-row)

```text
Create a responsive no-build Three.js loop titled "Three chairs staggered lift" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load SheenChair with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SheenChair/glTF-Binary/SheenChair.glb

Load a chair once and place three clones in a row. Give each an identical small vertical sine lift over 6 seconds with phases separated by one-third of a cycle. Keep their orientations fixed and use a front orthographic camera. Share geometry and unchanged materials.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 047 Sofa with drifting room cards

**Loop:** 12s · **Assets:** GlamVelvetSofa · **CSS pair:** [047 — Drifting interior panels](100-css-loop-prompts.md#047-drifting-interior-panels)

```text
Create a responsive no-build Three.js loop titled "Sofa with drifting room cards" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load GlamVelvetSofa with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb

Keep the sofa still and place two simple flat color panels behind it at different depths. Move the panels horizontally in opposite directions over a 12-second cycle, then return them smoothly. Keep the product silhouette unobscured and avoid moving the camera or lighting.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 048 Lantern trio wave

**Loop:** 9s · **Assets:** Lantern · **CSS pair:** [048 — Hanging lantern trio](100-css-loop-prompts.md#048-hanging-lantern-trio)

```text
Create a responsive no-build Three.js loop titled "Lantern trio wave" with a complete repeat period of 9 seconds. Apply the shared Three.js brief.

Download/load Lantern with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Lantern/glTF-Binary/Lantern.glb

Download one lantern and arrange three scaled clones at equal heights. Swing each about its handle by plus or minus 5 degrees over 9 seconds, with evenly offset phases. Keep illumination constant and use no moving point lights. Use an orthographic camera to emphasize the hanging rhythm.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 049 Vase spotlight oval

**Loop:** 7s · **Assets:** GlassVaseFlowers · **CSS pair:** [049 — Breathing decor spotlight](100-css-loop-prompts.md#049-breathing-decor-spotlight)

```text
Create a responsive no-build Three.js loop titled "Vase spotlight oval" with a complete repeat period of 7 seconds. Apply the shared Three.js brief.

Download/load GlassVaseFlowers with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/GlassVaseFlowers/glTF-Binary/GlassVaseFlowers.glb

Display the vase model motionless and place an unlit oval decal on the floor beneath it. Pulse the oval's scale from 1 to 1.15 and opacity from 0.15 to 0.3 over 7 seconds. Keep actual lighting unchanged and call the oval a graphic spotlight accent.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 050 Furniture card conveyor

**Loop:** 10s · **Assets:** SpecularSilkPouf · **CSS pair:** [050 — Decor catalog marquee](100-css-loop-prompts.md#050-decor-catalog-marquee)

```text
Create a responsive no-build Three.js loop titled "Furniture card conveyor" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load SpecularSilkPouf with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SpecularSilkPouf/glTF-Binary/SpecularSilkPouf.glb

Place three downloaded pouf clones on small flat platforms in a row. Move the row horizontally at constant speed, wrapping a clone only beyond the crop, for a 10-second seamless repeat. Keep the camera orthographic and all products identically oriented. Reuse the model data.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

## 51–60: Characters and mascots

### 051 Fox walk in place

**Loop:** 4s · **Assets:** Fox · **CSS pair:** [051 — Paper fox walking illusion](100-css-loop-prompts.md#051-paper-fox-walking-illusion)

```text
Create a responsive no-build Three.js loop titled "Fox walk in place" with a complete repeat period of 4 seconds. Apply the shared Three.js brief.

Download/load Fox with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Fox/glTF-Binary/Fox.glb

Download the fox and inspect its animation clips. Play the Walk clip with AnimationMixer, scaled so one full cycle takes 4 seconds. Keep its outer group in place and the camera fixed. Verify the first and last poses match, and do not combine multiple competing clips on the same bones.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 052 Fox survey loop

**Loop:** 6s · **Assets:** Fox · **CSS pair:** [052 — Fox looking around](100-css-loop-prompts.md#052-fox-looking-around)

```text
Create a responsive no-build Three.js loop titled "Fox survey loop" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load Fox with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Fox/glTF-Binary/Fox.glb

Load the fox and play its Survey animation as a repeating 6-second cycle using AnimationMixer. Keep the root fixed and use a close three-quarter camera. Inspect the clip duration and rescale playback instead of guessing keyframe timings. If its boundary is discontinuous, use ping-pong playback for the displayed cycle.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 053 Fox running badge

**Loop:** 2s · **Assets:** Fox · **CSS pair:** [053 — Running fox emblem](100-css-loop-prompts.md#053-running-fox-emblem)

```text
Create a responsive no-build Three.js loop titled "Fox running badge" with a complete repeat period of 2 seconds. Apply the shared Three.js brief.

Download/load Fox with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Fox/glTF-Binary/Fox.glb

Use the fox's Run clip, retimed to a 2-second cycle. Keep it running in place on a small static stage with a side camera. Use only one mixer and one active clip. Add no particle system or motion blur, and keep the stage within a compact square badge.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 054 Cesium character dance cycle

**Loop:** 4s · **Assets:** CesiumMan · **CSS pair:** [054 — Geometric dancing figure](100-css-loop-prompts.md#054-geometric-dancing-figure)

```text
Create a responsive no-build Three.js loop titled "Cesium character dance cycle" with a complete repeat period of 4 seconds. Apply the shared Three.js brief.

Download/load CesiumMan with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CesiumMan/glTF-Binary/CesiumMan.glb

Download the Cesium character and inspect its available clips. Loop its included animation with AnimationMixer at a 4-second displayed duration; use the first valid clip rather than assuming a name. Keep the root centered and use a fixed front camera. Report the chosen clip name in the accompanying notes.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 055 Rigged figure clip showcase

**Loop:** 5s · **Assets:** RiggedFigure · **CSS pair:** [055 — Stick-figure sway](100-css-loop-prompts.md#055-stick-figure-sway)

```text
Create a responsive no-build Three.js loop titled "Rigged figure clip showcase" with a complete repeat period of 5 seconds. Apply the shared Three.js brief.

Download/load RiggedFigure with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/RiggedFigure/glTF-Binary/RiggedFigure.glb

Load RiggedFigure and inspect its animation list. Loop its first valid skeletal clip over 5 seconds and frame the full body with a static camera. Do not invent a wave or other gesture unsupported by the file. If no usable clip is exposed, use a small whole-model sway and document that fallback.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 056 Fox on a rotating pedestal

**Loop:** 12s · **Assets:** Fox · **CSS pair:** [056 — Fox collectible card spin](100-css-loop-prompts.md#056-fox-collectible-card-spin)

```text
Create a responsive no-build Three.js loop titled "Fox on a rotating pedestal" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load Fox with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Fox/glTF-Binary/Fox.glb

Freeze the fox in a chosen neutral pose and rotate its outer pivot around Y once over 12 seconds. Keep the pedestal and lights fixed. Do not update AnimationMixer during this turntable. Center the model using bounds evaluated after the selected pose is applied.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 057 Duck friendly nod

**Loop:** 4s · **Assets:** Duck · **CSS pair:** [057 — Duck greeting bow](100-css-loop-prompts.md#057-duck-greeting-bow)

```text
Create a responsive no-build Three.js loop titled "Duck friendly nod" with a complete repeat period of 4 seconds. Apply the shared Three.js brief.

Download/load Duck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Duck/glTF-Binary/Duck.glb

Treat the duck as one rigid object and pitch its outer group forward by 7 degrees, pause, then return within a 4-second cycle. Set the pivot near the base so it resembles a friendly nod. Keep the source mesh intact and avoid assuming a separate head joint.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 058 Iridescent monkey head spin

**Loop:** 10s · **Assets:** IridescenceSuzanne · **CSS pair:** [058 — Iridescent mascot sticker](100-css-loop-prompts.md#058-iridescent-mascot-sticker)

```text
Create a responsive no-build Three.js loop titled "Iridescent monkey head spin" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load IridescenceSuzanne with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/IridescenceSuzanne/glTF-Binary/IridescenceSuzanne.glb

Download the iridescent Suzanne model and rotate its centered outer group around Y once over 10 seconds. Keep the environment static so the material changes come from the turning surface. Use the asset's existing material and a Three.js version supporting it; skip custom shaders and bloom.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 059 Character with orbiting dots

**Loop:** 8s · **Assets:** CesiumMan · **CSS pair:** [059 — Mascot orbit dots](100-css-loop-prompts.md#059-mascot-orbit-dots)

```text
Create a responsive no-build Three.js loop titled "Character with orbiting dots" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load CesiumMan with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CesiumMan/glTF-Binary/CesiumMan.glb

Show the character in a frozen pose and place three small spheres around its upper body on a circular XY path. Complete one orbit in 8 seconds with equal phase offsets. Keep the character static, use an orthographic camera and avoid collision logic or changing the camera angle.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 060 Fox with drifting ground

**Loop:** 4s · **Assets:** Fox · **CSS pair:** [060 — Mascot ground scroll](100-css-loop-prompts.md#060-mascot-ground-scroll)

```text
Create a responsive no-build Three.js loop titled "Fox with drifting ground" with a complete repeat period of 4 seconds. Apply the shared Three.js brief.

Download/load Fox with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Fox/glTF-Binary/Fox.glb

Play the fox Walk clip in place over 4 seconds and move a short repeated ground-mark pattern beneath it. Match the ground pattern's displacement to one exact repeat each cycle. Keep the camera fixed and recycle only the marks; do not translate the fox root across the scene.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

## 61–70: Small group choreography

### 061 Two ducks greeting

**Loop:** 6s · **Assets:** Duck · **CSS pair:** [061 — Two-icon greeting](100-css-loop-prompts.md#061-two-icon-greeting)

```text
Create a responsive no-build Three.js loop titled "Two ducks greeting" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load Duck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Duck/glTF-Binary/Duck.glb

Load the duck once and place two clones facing each other. Move both inward by a small equal distance, dip them slightly, then return to their starting positions in a 6-second cycle. Leave a visible gap throughout so they never intersect. Use a fixed frontal camera and rigid group transforms.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 062 Three-bottle expanding fan

**Loop:** 8s · **Assets:** WaterBottle · **CSS pair:** [062 — Bottle fan display](100-css-loop-prompts.md#062-bottle-fan-display)

```text
Create a responsive no-build Three.js loop titled "Three-bottle expanding fan" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load WaterBottle with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/WaterBottle/glTF-Binary/WaterBottle.glb

Arrange three downloaded bottle clones around a common bottom point. Keep the middle bottle vertical while the two side groups tilt outward to plus or minus 18 degrees and return over 8 seconds. Use small offsets to prevent intersections and keep the pivot construction separate from the source model.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 063 Sneaker stack separation

**Loop:** 8s · **Assets:** MaterialsVariantsShoe · **CSS pair:** [063 — Two-product stack spread](100-css-loop-prompts.md#063-two-product-stack-spread)

```text
Create a responsive no-build Three.js loop titled "Sneaker stack separation" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load MaterialsVariantsShoe with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb

Place two clones of the default shoe one above the other in a fixed view. Over 8 seconds, gently separate them vertically, hold, then bring them back to their initial spacing. Keep both rotations fixed and leave enough gap to prevent overlap. Reuse geometry and textures.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 064 Avocado helix elevator

**Loop:** 12s · **Assets:** Avocado · **CSS pair:** [064 — Avocado spiral drift](100-css-loop-prompts.md#064-avocado-spiral-drift)

```text
Create a responsive no-build Three.js loop titled "Avocado helix elevator" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load Avocado with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Avocado/glTF-Binary/Avocado.glb

Place three avocado clones at evenly spaced phases on a small helix. Move each around the helix over 12 seconds, fading it out near the top before resetting below the frame. Fade back in only after the reset. Keep their orientations fixed and use a fixed camera with minimal depth range.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 065 Cone domino wave

**Loop:** 8s · **Assets:** TrafficCone · **CSS pair:** [065 — Caution-cone lean sequence](100-css-loop-prompts.md#065-caution-cone-lean-sequence)

```text
Create a responsive no-build Three.js loop titled "Cone domino wave" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load TrafficCone with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/TrafficCone/glTF-Binary/TrafficCone.glb

Arrange five cone clones in a row, each with a pivot at its base. Tip them one after another by 12 degrees and return each smoothly to upright within an 8-second master loop. Keep spacing wide enough to avoid contact. This is a predetermined domino-like wave, without collisions.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 066 Watch marker chase

**Loop:** 12s · **Assets:** ChronographWatch · **CSS pair:** [066 — Twelve-dot circular chase](100-css-loop-prompts.md#066-twelve-dot-circular-chase)

```text
Create a responsive no-build Three.js loop titled "Watch marker chase" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load ChronographWatch with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ChronographWatch/glTF-Binary/ChronographWatch.glb

Keep the watch model still and add twelve small unlit marker spheres in a ring around it. Brighten one marker at a time, advancing at one-second intervals through a 12-second loop. Use a fixed camera and do not alter the model's clock face or hands.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 067 Checkerboard cube flips

**Loop:** 8s · **Assets:** Box · **CSS pair:** [067 — Checkerboard tile flips](100-css-loop-prompts.md#067-checkerboard-tile-flips)

```text
Create a responsive no-build Three.js loop titled "Checkerboard cube flips" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Download the Box asset and create a two-by-two grid of clones. Rotate diagonal pairs around Y by one full turn during alternating halves of an 8-second cycle, holding the other pair still. Use eased segment timing and fixed cell positions. Add distinct flat colors with separate material instances.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 068 Sunglasses burst rosette

**Loop:** 10s · **Assets:** SunglassesKhronos · **CSS pair:** [068 — Accessory rosette pulse](100-css-loop-prompts.md#068-accessory-rosette-pulse)

```text
Create a responsive no-build Three.js loop titled "Sunglasses burst rosette" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load SunglassesKhronos with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SunglassesKhronos/glTF-Binary/SunglassesKhronos.glb

Place six sunglasses clones around a circle, facing the camera. Expand the radius by 15%, hold, then contract to the original radius over 10 seconds. Keep every clone's own rotation fixed and the arrangement centered. Use one orthographic camera and shared geometry.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 069 Lantern lift in sequence

**Loop:** 9s · **Assets:** Lantern · **CSS pair:** [069 — Sequential lantern lifts](100-css-loop-prompts.md#069-sequential-lantern-lifts)

```text
Create a responsive no-build Three.js loop titled "Lantern lift in sequence" with a complete repeat period of 9 seconds. Apply the shared Three.js brief.

Download/load Lantern with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Lantern/glTF-Binary/Lantern.glb

Place three lantern clones on equal-height platforms. During a 9-second loop, lift the first, then second, then third by 8% of their height, returning each before the next lift. Use a smooth timeline and no overlapping lifts. Keep all light intensities fixed.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 070 Three-fox walking chorus

**Loop:** 4s · **Assets:** Fox · **CSS pair:** [070 — Paper-fox walking chorus](100-css-loop-prompts.md#070-paper-fox-walking-chorus)

```text
Create a responsive no-build Three.js loop titled "Three-fox walking chorus" with a complete repeat period of 4 seconds. Apply the shared Three.js brief.

Download/load Fox with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Fox/glTF-Binary/Fox.glb

Load the fox once and make three independently animated clones with SkeletonUtils.clone rather than sharing one mutable skeleton. Play Walk on each with a 4-second period and phase offsets of one-third cycle. Keep them in place across a small stage with fixed lighting and camera.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

## 71–80: Geometric loops from a downloaded model

### 071 Single cube diagonal spin

**Loop:** 8s · **Assets:** Box · **CSS pair:** [071 — Six-face CSS cube](100-css-loop-prompts.md#071-six-face-css-cube)

```text
Create a responsive no-build Three.js loop titled "Single cube diagonal spin" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Load the Box GLB rather than generating the main cube procedurally. Center it, apply a clean flat material, and rotate its outer group once around a fixed diagonal axis over 8 seconds. Use a fixed camera, one soft key light and no floor or texture downloads.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 072 Morph cube shape cycle

**Loop:** 6s · **Assets:** AnimatedMorphCube · **CSS pair:** [072 — Elastic block illusion](100-css-loop-prompts.md#072-elastic-block-illusion)

```text
Create a responsive no-build Three.js loop titled "Morph cube shape cycle" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load AnimatedMorphCube with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/AnimatedMorphCube/glTF-Binary/AnimatedMorphCube.glb

Download AnimatedMorphCube and inspect its morph-target animation. Play its provided cycle with AnimationMixer at a 6-second displayed duration, showing the thin and ramp shapes from a fixed three-quarter view. Keep lighting static and use the existing morph targets rather than writing a new vertex shader.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 073 Cube accordion

**Loop:** 6s · **Assets:** Box · **CSS pair:** [073 — Accordion block row](100-css-loop-prompts.md#073-accordion-block-row)

```text
Create a responsive no-build Three.js loop titled "Cube accordion" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Clone the downloaded cube five times into a horizontal row. Animate the spacing symmetrically from tight to wide and back over 6 seconds while keeping the center cube fixed. Keep orientation and individual scale unchanged. Use flat colors and an orthographic camera so the spacing rhythm is the main effect.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 074 Cube with satellite orbit

**Loop:** 10s · **Assets:** Box · **CSS pair:** [074 — Cube-and-orbit badge](100-css-loop-prompts.md#074-cube-and-orbit-badge)

```text
Create a responsive no-build Three.js loop titled "Cube with satellite orbit" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Keep a large downloaded cube stationary and add two smaller clones orbiting it in perpendicular planes. Complete both orbits over 10 seconds, offsetting their phases to avoid overlap. Use a fixed perspective view, simple materials and no trails or physics. The center cube remains completely still.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 075 Four-cube breathing square

**Loop:** 5s · **Assets:** Box · **CSS pair:** [075 — Breathing four-dot square](100-css-loop-prompts.md#075-breathing-four-dot-square)

```text
Create a responsive no-build Three.js loop titled "Four-cube breathing square" with a complete repeat period of 5 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Place four downloaded cube clones at the corners of a square in the XY plane. Move them radially outward by 20% and back over 5 seconds, with no rotation. Keep the center empty and the camera orthographic. Maintain identical scale and a soft consistent color palette.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 076 Staircase height wave

**Loop:** 8s · **Assets:** Box · **CSS pair:** [076 — Isometric bar wave](100-css-loop-prompts.md#076-isometric-bar-wave)

```text
Create a responsive no-build Three.js loop titled "Staircase height wave" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Make five vertical columns by scaling clones of the downloaded Box asset. Anchor each column at its bottom and animate its Y scale through a small staggered wave over 8 seconds. Keep height values positive and avoid intersections. Use a fixed isometric-style orthographic view and a static floor.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 077 Cube rolling in place

**Loop:** 8s · **Assets:** Box · **CSS pair:** [077 — Rolling square loader](100-css-loop-prompts.md#077-rolling-square-loader)

```text
Create a responsive no-build Three.js loop titled "Cube rolling in place" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Use the downloaded cube and create a stylized roll-in-place display: rotate around Z through four eased quarter turns over 8 seconds while applying a synchronized vertical lift to keep it clear of a static floor. Return to the same center and orientation after the fourth turn. Use a front orthographic camera.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 078 Book-like cube panels

**Loop:** 6s · **Assets:** Box · **CSS pair:** [078 — Opening two-panel booklet](100-css-loop-prompts.md#078-opening-two-panel-booklet)

```text
Create a responsive no-build Three.js loop titled "Book-like cube panels" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Load the Box asset and scale two clones into thin rectangular panels. Put their pivots along a shared vertical edge and open them symmetrically from a narrow angle to 70 degrees and back over 6 seconds. Use separate outer pivot groups and keep their edges aligned. No page simulation is needed.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 079 Telescoping block stack

**Loop:** 7s · **Assets:** Box · **CSS pair:** [079 — Telescoping columns](100-css-loop-prompts.md#079-telescoping-columns)

```text
Create a responsive no-build Three.js loop titled "Telescoping block stack" with a complete repeat period of 7 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Build three nested-height blocks by scaling downloaded Box clones. Keep each block's size fixed and animate only the top two vertically so the stack extends and retracts over 7 seconds. Keep the lower block still and choose dimensions that conceal the blocks' lower ends during retraction.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 080 Cube ribbon wave

**Loop:** 8s · **Assets:** Box · **CSS pair:** [080 — Seven-block sine wave](100-css-loop-prompts.md#080-seven-block-sine-wave)

```text
Create a responsive no-build Three.js loop titled "Cube ribbon wave" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Arrange seven small downloaded cube clones along a straight horizontal line. Apply a smooth vertical wave with phase increasing across the row, repeating after 8 seconds. Keep every cube's rotation fixed and use an orthographic camera. Seven fixed objects are sufficient; do not create particles during playback.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

## 81–90: Lighting and graphic accents

### 081 Helmet scanning stripe

**Loop:** 6s · **Assets:** DamagedHelmet · **CSS pair:** [081 — Scanning highlight line](100-css-loop-prompts.md#081-scanning-highlight-line)

```text
Create a responsive no-build Three.js loop titled "Helmet scanning stripe" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load DamagedHelmet with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb

Keep the downloaded helmet stationary and move a thin translucent plane vertically across its front over 6 seconds. Fade the plane out before resetting it below the view. Treat it as a graphic scanning stripe, not an X-ray or geometry scan. Keep the helmet material and actual lighting fixed.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 082 Bottle sliding color backdrop

**Loop:** 8s · **Assets:** WaterBottle · **CSS pair:** [082 — Sliding color backdrop](100-css-loop-prompts.md#082-sliding-color-backdrop)

```text
Create a responsive no-build Three.js loop titled "Bottle sliding color backdrop" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load WaterBottle with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/WaterBottle/glTF-Binary/WaterBottle.glb

Keep the bottle fixed and place two large unlit color panels behind it. Slide the panels sideways in opposite directions and back over 8 seconds to change the composition around the silhouette. Do not change the bottle material or claim that the background movement simulates reflections.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 083 Watch sparkle moment

**Loop:** 7s · **Assets:** ChronographWatch · **CSS pair:** [083 — Single bezel sparkle](100-css-loop-prompts.md#083-single-bezel-sparkle)

```text
Create a responsive no-build Three.js loop titled "Watch sparkle moment" with a complete repeat period of 7 seconds. Apply the shared Three.js brief.

Download/load ChronographWatch with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ChronographWatch/glTF-Binary/ChronographWatch.glb

Show the watch still and add one small four-point sparkle sprite near a chosen bezel point. Scale and fade the sparkle in and out once during a 7-second cycle, leaving most of the cycle quiet. Use a fixed camera and keep the actual material and lights unchanged.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 084 Sneaker orbiting ground accent

**Loop:** 8s · **Assets:** MaterialsVariantsShoe · **CSS pair:** [084 — Orbiting product accent](100-css-loop-prompts.md#084-orbiting-product-accent)

```text
Create a responsive no-build Three.js loop titled "Sneaker orbiting ground accent" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load MaterialsVariantsShoe with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb

Keep the shoe in a fixed three-quarter pose. Move a small unlit oval around an ellipse on the floor over 8 seconds while the true contact shadow stays static. Label the moving oval as a design accent, not a physically accurate shadow. Use no dynamic light or shadow-map updates.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 085 Iridescent head with color washes

**Loop:** 12s · **Assets:** IridescenceSuzanne · **CSS pair:** [085 — Three-color backdrop wash](100-css-loop-prompts.md#085-three-color-backdrop-wash)

```text
Create a responsive no-build Three.js loop titled "Iridescent head with color washes" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load IridescenceSuzanne with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/IridescenceSuzanne/glTF-Binary/IridescenceSuzanne.glb

Keep Suzanne stationary under a fixed environment. Crossfade three unlit full-frame background planes through cool, warm and neutral colors over a 12-second loop. Preserve the model's original iridescent material and do not change the lighting. The background wash is the only animated part.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 086 Lantern day-to-night light

**Loop:** 12s · **Assets:** Lantern · **CSS pair:** [086 — Warm-cool lantern mood](100-css-loop-prompts.md#086-warm-cool-lantern-mood)

```text
Create a responsive no-build Three.js loop titled "Lantern day-to-night light" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load Lantern with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Lantern/glTF-Binary/Lantern.glb

Keep the lantern motionless and slowly transition a broad fill light between a cooler daytime color and a warmer evening color over 12 seconds. Keep minimum intensity high enough to preserve detail. Interpolate smoothly back to the starting color, without changing material values or adding post-processing.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 087 Camera wireframe pulse

**Loop:** 8s · **Assets:** AntiqueCamera · **CSS pair:** [087 — Camera blueprint crossfade](100-css-loop-prompts.md#087-camera-blueprint-crossfade)

```text
Create a responsive no-build Three.js loop titled "Camera wireframe pulse" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load AntiqueCamera with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb

Load the camera and add a wireframe or edges overlay derived from its mesh geometry. Pulse only that overlay's opacity gently over 8 seconds while the original shaded model stays still. Use a low-detail optimized model and polygon offset or a small overlay bias to avoid z-fighting. Keep the line color constant.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 088 Corset vertical reveal

**Loop:** 8s · **Assets:** Corset · **CSS pair:** [088 — Garment wipe reveal](100-css-loop-prompts.md#088-garment-wipe-reveal)

```text
Create a responsive no-build Three.js loop titled "Corset vertical reveal" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load Corset with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Corset/glTF-Binary/Corset.glb

Keep the downloaded corset fixed and reveal it with a single clipping plane moving from bottom to top, hold, then move back down over 8 seconds. Use the same local clipping setup on all relevant materials. Keep the camera static and do not animate vertices or dissolve textures.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 089 Bottle reflection breath

**Loop:** 6s · **Assets:** WaterBottle · **CSS pair:** [089 — Fading product reflection](100-css-loop-prompts.md#089-fading-product-reflection)

```text
Create a responsive no-build Three.js loop titled "Bottle reflection breath" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load WaterBottle with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/WaterBottle/glTF-Binary/WaterBottle.glb

Keep the bottle stationary and add a vertically mirrored copy below a flat stage as a stylized reflection. Fade only the mirrored copy's materials from low to moderate opacity and back over 6 seconds. Use a fixed front view, cloned materials and a clear note that this is not ray-traced reflection.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 090 Helmet echo trails

**Loop:** 8s · **Assets:** DamagedHelmet · **CSS pair:** [090 — Product ghost echoes](100-css-loop-prompts.md#090-product-ghost-echoes)

```text
Create a responsive no-build Three.js loop titled "Helmet echo trails" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load DamagedHelmet with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb

Use one fixed helmet and two translucent clones behind it. Move the clones slightly outward in opposite horizontal directions and fade them away, then reset while invisible within an 8-second loop. Clone materials for independent opacity and avoid depth writing on the echoes. Keep the main helmet opaque.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

## 91–100: Carrd hero and interface loops

### 091 T-shirt with moving editorial frame

**Loop:** 8s · **Assets:** TShirt · **CSS pair:** [091 — Breathing editorial frame](100-css-loop-prompts.md#091-breathing-editorial-frame)

```text
Create a responsive no-build Three.js loop titled "T-shirt with moving editorial frame" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load TShirt with GLTFLoader from:
https://raw.githubusercontent.com/kr10o/carrd-threejs/18e78bb98b1719bf8d7a1dc731365d247668bd26/tshirt.glb

Display the T-shirt at a fixed angle in a transparent canvas. Add four thin plane strips around it as an editorial frame, moving the left and right strips outward and back over 8 seconds while the garment stays still. Keep all strips in the camera-facing plane and use no depth effects.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 092 Bottle hero with scroll cue

**Loop:** 3s · **Assets:** WaterBottle · **CSS pair:** [092 — Scroll-cue chevron](100-css-loop-prompts.md#092-scroll-cue-chevron)

```text
Create a responsive no-build Three.js loop titled "Bottle hero with scroll cue" with a complete repeat period of 3 seconds. Apply the shared Three.js brief.

Download/load WaterBottle with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/WaterBottle/glTF-Binary/WaterBottle.glb

Show the bottle in a fixed pose and place a small downward arrow made from two thin planes below it. Bounce the arrow downward and fade it slightly during a 3-second loop. Keep the product still and make the arrow decorative unless it is paired with a real accessible navigation control.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 093 Sneaker feature labels

**Loop:** 9s · **Assets:** MaterialsVariantsShoe · **CSS pair:** [093 — Rotating feature callouts](100-css-loop-prompts.md#093-rotating-feature-callouts)

```text
Create a responsive no-build Three.js loop titled "Sneaker feature labels" with a complete repeat period of 9 seconds. Apply the shared Three.js brief.

Download/load MaterialsVariantsShoe with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb

Keep a shoe model in one fixed view and show three camera-facing label cards near its toe, sole and heel. Fade one card at a time during a 9-second cycle while keeping positions fixed. Use generic labels without inventing product specifications. Do not project moving anchors every frame.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 094 Duck waiting indicator

**Loop:** 3s · **Assets:** Duck · **CSS pair:** [094 — Duck and three waiting dots](100-css-loop-prompts.md#094-duck-and-three-waiting-dots)

```text
Create a responsive no-build Three.js loop titled "Duck waiting indicator" with a complete repeat period of 3 seconds. Apply the shared Three.js brief.

Download/load Duck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Duck/glTF-Binary/Duck.glb

Keep a small duck model still above three simple sphere markers. Pulse the markers in sequence using scale and opacity on a 3-second loop. Present the result as an indeterminate waiting illustration, not measured download progress. If used during loading, expose a separate real text status.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 095 Downloaded-cube confetti burst

**Loop:** 6s · **Assets:** Box · **CSS pair:** [095 — Twelve-piece confetti burst](100-css-loop-prompts.md#095-twelve-piece-confetti-burst)

```text
Create a responsive no-build Three.js loop titled "Downloaded-cube confetti burst" with a complete repeat period of 6 seconds. Apply the shared Three.js brief.

Download/load Box with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/Box/glTF-Binary/Box.glb

Download Box and create twelve small colored clones. Move them outward from a center point on predetermined radial paths, rotate them slightly, then fade them out within a 6-second loop. Reset only while invisible. Reuse all twelve objects and materials; use no physics or unbounded particle creation.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 096 Camera focus brackets

**Loop:** 5s · **Assets:** AntiqueCamera · **CSS pair:** [096 — Focus-corner contraction](100-css-loop-prompts.md#096-focus-corner-contraction)

```text
Create a responsive no-build Three.js loop titled "Camera focus brackets" with a complete repeat period of 5 seconds. Apply the shared Three.js brief.

Download/load AntiqueCamera with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb

Keep the camera model stationary inside four L-shaped bracket groups made from thin plane strips. Move the brackets inward slightly, hold, then return over 5 seconds. Keep them in the image plane and outside the main silhouette. Use no actual autofocus logic or camera-parameter changes.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 097 T-shirt floating gallery strip

**Loop:** 12s · **Assets:** TShirt · **CSS pair:** [097 — Streetwear poster marquee](100-css-loop-prompts.md#097-streetwear-poster-marquee)

```text
Create a responsive no-build Three.js loop titled "T-shirt floating gallery strip" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load TShirt with GLTFLoader from:
https://raw.githubusercontent.com/kr10o/carrd-threejs/18e78bb98b1719bf8d7a1dc731365d247668bd26/tshirt.glb

Load the T-shirt once and place four fixed-pose clones across a horizontal gallery. Move the sequence by one exact product spacing over 12 seconds, wrapping only a fully offscreen clone. Use an orthographic camera, shared model resources and a plain background so the repeated garment shape stays clear.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 098 Truck with route dots

**Loop:** 8s · **Assets:** CesiumMilkTruck · **CSS pair:** [098 — Delivery route chase](100-css-loop-prompts.md#098-delivery-route-chase)

```text
Create a responsive no-build Three.js loop titled "Truck with route dots" with a complete repeat period of 8 seconds. Apply the shared Three.js brief.

Download/load CesiumMilkTruck with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb

Keep the truck stationary at one side of a fixed view. Place eight small markers along a simple horizontal route and pulse their opacity sequentially toward the truck over 8 seconds. Keep marker positions fixed and label the scene as a decorative delivery illustration rather than live tracking.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 099 Chair presentation elevator

**Loop:** 10s · **Assets:** SheenChair · **CSS pair:** [099 — Furniture pedestal lift](100-css-loop-prompts.md#099-furniture-pedestal-lift)

```text
Create a responsive no-build Three.js loop titled "Chair presentation elevator" with a complete repeat period of 10 seconds. Apply the shared Three.js brief.

Download/load SheenChair with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/SheenChair/glTF-Binary/SheenChair.glb

Put the downloaded chair on a simple short cylindrical plinth. Move the chair and plinth together upward by a small distance, hold, then lower them over 10 seconds. Use a fixed orthographic camera and a static backdrop. Keep the whole assembly rigid and avoid floor intersections at the lower endpoint.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

### 100 Three-product spotlight sequence

**Loop:** 12s · **Assets:** TShirt, MaterialsVariantsShoe, WaterBottle · **CSS pair:** [100 — Three-product featured sequence](100-css-loop-prompts.md#100-three-product-featured-sequence)

```text
Create a responsive no-build Three.js loop titled "Three-product spotlight sequence" with a complete repeat period of 12 seconds. Apply the shared Three.js brief.

Download/load TShirt with GLTFLoader from:
https://raw.githubusercontent.com/kr10o/carrd-threejs/18e78bb98b1719bf8d7a1dc731365d247668bd26/tshirt.glb

Download/load MaterialsVariantsShoe with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb

Download/load WaterBottle with GLTFLoader from:
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/WaterBottle/glTF-Binary/WaterBottle.glb

Download the T-shirt, shoe and bottle from the supplied sources. Arrange them in three fixed slots and give each a small upward lift in turn, with the others resting, across a 12-second loop. Put a soft unlit accent disk behind the active slot. Keep cameras and product materials fixed and load each model only once.

Deliver the working scene and source credits. Keep the loop seamless and provide a static reduced-motion state.
```

