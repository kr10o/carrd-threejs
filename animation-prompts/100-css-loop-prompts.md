# 100 corresponding CSS loop animation prompts

Exactly 100 prompts, paired by ID with [100 Three.js prompts](100-threejs-loop-prompts.md). Includes 59 CSS substitutes, 18 CSS wrappers and 23 CSS companions. See [the pairing index](pairing-index.md) to compare them.

Copy the shared brief below together with one prompt. A substitute can remove WebGL; a wrapper animates a fixed view; a companion moves only the stated decorative work into CSS. These are not all pixel-identical reproductions of the 3D versions.

## Shared CSS brief

```text
Build one responsive HTML/CSS animation for Carrd3.js, without a framework or animation library. Deliver index.html and style.css with selectors and keyframe names scoped to one unique scene root. Use CSS custom properties for duration, amplitude and colors. The animation itself must not use requestAnimationFrame, timers, GSAP or per-frame JavaScript style writes.

Use HTML elements, pseudo-elements and optionally static inline SVG artwork, or prepared licensed PNG/WebP/SVG cutouts. CSS does not load or render a GLB model. When a prompt calls for posters, prepare actual static views from the corresponding model during implementation, or provide a complete CSS-drawn substitute. Include the resulting artwork and its credits; do not leave broken placeholder image URLs.

For a CSS substitute, remove Three.js from that demo. A flat card, gradient or paper mascot is an intentional approximation, not a claim of equivalent geometry, reflections, refraction or skeletal motion. For a CSS wrapper, animate a poster or fixed-view canvas element as a composited rectangle. Any JS needed to load and render a canvas is initialization/event logic, not the animation engine.

For a CSS companion, animate the specified decorative layer in the DOM. Keep the Three.js loop only for model, light, camera, material, skin or vertex changes that still need it. If the entire underlying scene is static, render once initially and again on resize or state changes, rather than continuously. Moving a canvas element does not rotate the mesh inside it or update its internal shadows.

Prefer transform and opacity. Keep gradients, blur radii, border widths and box shadows static. Clip-path effects are explicitly allowed only where requested, with a fallback and profiling. CSS is not automatically faster or GPU-only: painting, compositing, layer memory and browser behavior still matter. Use will-change only after a measured need, not on every element.

Use nested wrappers for independent motion components so one animation does not overwrite another transform. For CSS 3D faces, use perspective and preserve-3d where needed, and keep flattening properties such as group opacity, filters or overflow:hidden off the 3D context itself. Put external clipping on a separate outer wrapper.

Make the specified duration the full visible repeat period. Match first and last states or reset only while completely hidden. Use negative delays for staggered repeats. For marquee strips, make duplicate content, widths and gaps exact. Keep semantic content outside decorative repeats and hide duplicates from assistive technology.

Include a useful static prefers-reduced-motion state and a visible accessible pause control. A checkbox plus animation-play-state can keep a standalone demo entirely CSS; minimal event-based JS is acceptable for an integrated button or offscreen pause, but no per-frame JS. Apply pause to every animated child and pseudo-element. Do not rely solely on hover to pause.

Reserve component dimensions, avoid animated layout properties, and keep links/text usable throughout the loop. Verify narrow/wide layouts, start/end continuity, pause/resume and reduced motion. Do not claim measured performance improvements without profiling the implemented result.
```

## Prompts

## 1–10: Product showcases

### 001 Two-sided T-shirt card

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [001 — T-shirt showroom turn](100-threejs-loop-prompts.md#001-t-shirt-showroom-turn)

```text
Create a responsive no-build HTML/CSS loop titled "Two-sided T-shirt card" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 001.

Draw a T-shirt silhouette with HTML and a static clip-path, then place front and back artwork on two flat faces. Rotate their parent through 360 degrees with perspective over 8 seconds. Use backface-visibility:hidden. Describe this as a flat merchandise-card substitute; it does not reveal the garment's real side geometry.

Move this work into CSS: Replace the WebGL turntable with a CSS card rotation when a flat product illustration is sufficient.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 002 Sneaker poster levitation

**Loop:** 4s · **Type:** CSS wrapper · **Three.js pair:** [002 — Floating sneaker](100-threejs-loop-prompts.md#002-floating-sneaker)

```text
Create a responsive no-build HTML/CSS loop titled "Sneaker poster levitation" with a complete repeat period of 4 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 002.

Place a static sneaker cutout above an elliptical shadow. Animate the image with translateY from 0 to -12px and back over 4 seconds using ease-in-out. Animate the shadow's scale and opacity with the same duration. Keep the label outside the moving wrapper and support a render-once canvas in place of the image.

Move this work into CSS: Move screen-space floating and the decorative shadow to CSS; a static Three.js scene needs no continuous render loop.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 003 Bottle hanging swing

**Loop:** 5s · **Type:** CSS wrapper · **Three.js pair:** [003 — Bottle pendulum](100-threejs-loop-prompts.md#003-bottle-pendulum)

```text
Create a responsive no-build HTML/CSS loop titled "Bottle hanging swing" with a complete repeat period of 5 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 003.

Use a bottle cutout inside a wrapper with transform-origin:50% 0%. Keyframe rotate(-8deg), rotate(8deg), and rotate(-8deg) across 5 seconds. Draw a short hanging line with a pseudo-element. Make its motion entirely CSS and keep the static label readable.

Move this work into CSS: Replace the rigid screen-plane swing calculation with a CSS transform.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 004 Sunglasses perspective sway

**Loop:** 6s · **Type:** CSS substitute · **Three.js pair:** [004 — Sunglasses gentle yaw](100-threejs-loop-prompts.md#004-sunglasses-gentle-yaw)

```text
Create a responsive no-build HTML/CSS loop titled "Sunglasses perspective sway" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 004.

Draw a simple frame and two tinted lenses with HTML shapes, then rock the wrapper between rotateY(-18deg) and rotateY(18deg) over 6 seconds. Use perspective on the scene and a static lens gradient. Explain that the flat lenses approximate the motion without simulating refraction.

Move this work into CSS: Replace 3D yaw with an inexpensive CSS perspective illustration where true frame depth is unnecessary.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 005 Watch card tilt

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [005 — Watch display tilt](100-threejs-loop-prompts.md#005-watch-display-tilt)

```text
Create a responsive no-build HTML/CSS loop titled "Watch card tilt" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 005.

Create a watch face and strap from rounded HTML elements. Tilt their common wrapper with rotateX from -10 to +10 degrees and back over 8 seconds. Use a static face highlight and fixed decorative hands. Leave all numbers sharp; this is a perspective card, not a working clock.

Move this work into CSS: Replace the product pitch loop with a CSS transform on a flat watch illustration.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 006 Helmet sheen sweep

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [006 — Helmet orbiting light](100-threejs-loop-prompts.md#006-helmet-orbiting-light)

```text
Create a responsive no-build HTML/CSS loop titled "Helmet sheen sweep" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 006.

Use a fixed helmet cutout and move a broad translucent highlight across it over 10 seconds. Clip the highlight to the silhouette with a mask, animate translateX and opacity, and fade it out before resetting. State that the overlay suggests a light sweep without reproducing surface-dependent lighting.

Move this work into CSS: Replace moving-light calculations with a decorative CSS highlight when physical shading is not needed.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 007 Garment breathing poster

**Loop:** 6s · **Type:** CSS wrapper · **Three.js pair:** [007 — Corset breathing display](100-threejs-loop-prompts.md#007-corset-breathing-display)

```text
Create a responsive no-build HTML/CSS loop titled "Garment breathing poster" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 007.

Place a corset or garment poster in a centered wrapper and animate scale(1) to scale(1.025) and back over 6 seconds. Keep transform-origin:center and use ease-in-out. Separate the heading from the animated element so text never expands with the image.

Move this work into CSS: Move the uniform display pulse to CSS and render the 3D asset only when its actual view changes.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 008 Chair silhouette reveal

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [008 — Chair quarter-view reveal](100-threejs-loop-prompts.md#008-chair-quarter-view-reveal)

```text
Create a responsive no-build HTML/CSS loop titled "Chair silhouette reveal" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 008.

Draw a recognizable chair with a rounded seat, back and four legs, then sway the wrapper through a small rotateY range over 8 seconds. Use perspective and static darker side strips to suggest depth. Keep the illustration modest: the hidden upholstery and rear geometry are not reconstructed.

Move this work into CSS: Replace a true chair reveal with a CSS faux-depth illustration.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 009 Pouf cushion float

**Loop:** 5s · **Type:** CSS wrapper · **Three.js pair:** [009 — Silk pouf hover](100-threejs-loop-prompts.md#009-silk-pouf-hover)

```text
Create a responsive no-build HTML/CSS loop titled "Pouf cushion float" with a complete repeat period of 5 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 009.

Use a rounded cushion illustration or transparent poster and float it upward 10px then back over 5 seconds. Place a blurred ellipse beneath it and animate only that ellipse's transform and opacity. Keep the blur radius static so the effect avoids an animated filter.

Move this work into CSS: Transfer vertical floating and shadow feedback to CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 010 Product view crossfade

**Loop:** 8s · **Type:** CSS wrapper · **Three.js pair:** [010 — Shoe two-view fade](100-threejs-loop-prompts.md#010-shoe-two-view-fade)

```text
Create a responsive no-build HTML/CSS loop titled "Product view crossfade" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 010.

Stack two static shoe views at the same size. Over 8 seconds hold the first, crossfade to the second, hold it, then crossfade back. Animate only opacity and keep the first fully visible at both 0% and 100%. Expose the images as configurable URLs.

Move this work into CSS: Replace repeated scene rendering and view-opacity updates with CSS image crossfades.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

## 11–20: Objects and accessories

### 011 Boombox beat badge

**Loop:** 2s · **Type:** CSS substitute · **Three.js pair:** [011 — Boombox bass bounce](100-threejs-loop-prompts.md#011-boombox-bass-bounce)

```text
Create a responsive no-build HTML/CSS loop titled "Boombox beat badge" with a complete repeat period of 2 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 011.

Build a boombox icon from one rounded rectangle and two circular speakers. Bounce its wrapper with translateY over 2 seconds and scale translucent speaker-ring pseudo-elements in phase. Keep the ring borders static and animate opacity as they expand.

Move this work into CSS: Replace the predetermined bounce and speaker pulses with CSS keyframes.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 012 Camera icon nod

**Loop:** 5s · **Type:** CSS substitute · **Three.js pair:** [012 — Vintage camera nod](100-threejs-loop-prompts.md#012-vintage-camera-nod)

```text
Create a responsive no-build HTML/CSS loop titled "Camera icon nod" with a complete repeat period of 5 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 012.

Construct a camera icon with a body, lens and small top block. Animate a subtle rotateX nod across 5 seconds with perspective on its parent. Keep the lens gradient and border static. Use a single transform wrapper so separate parts remain aligned.

Move this work into CSS: Replace the rigid model nod with a CSS perspective icon.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 013 Lantern swing

**Loop:** 6s · **Type:** CSS wrapper · **Three.js pair:** [013 — Lantern hanging arc](100-threejs-loop-prompts.md#013-lantern-hanging-arc)

```text
Create a responsive no-build HTML/CSS loop titled "Lantern swing" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 013.

Draw or supply a lantern cutout with a handle above its center. Rotate its wrapper between -7 and +7 degrees around the top of the handle in a 6-second loop. Keep a static warm glow inside the lantern and apply no per-frame JavaScript.

Move this work into CSS: Move the screen-plane hanging arc to CSS; the glow remains a static graphic.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 014 Counter-rotating helmet medallions

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [014 — Two helmets counter-turn](100-threejs-loop-prompts.md#014-two-helmets-counter-turn)

```text
Create a responsive no-build HTML/CSS loop titled "Counter-rotating helmet medallions" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 014.

Put two flat helmet emblems in circular medallions and rotate the medallion wrappers in opposite directions over 10 seconds. Keep each label outside its rotating wrapper. Call this a graphic counter-spin alternative, not a way to reveal the rear of a 3D helmet.

Move this work into CSS: Replace dual mesh rotations with two CSS rotation animations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 015 Sunglasses figure-eight drift

**Loop:** 8s · **Type:** CSS wrapper · **Three.js pair:** [015 — Floating sunglasses figure eight](100-threejs-loop-prompts.md#015-floating-sunglasses-figure-eight)

```text
Create a responsive no-build HTML/CSS loop titled "Sunglasses figure-eight drift" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 015.

Nest a horizontal-motion wrapper around a vertical-motion wrapper holding a sunglasses cutout. Give horizontal motion an 8-second cycle and vertical motion a 4-second cycle with matching phases to approximate a figure eight. Use small translate distances and smooth easing; the combined loop repeats every 8 seconds.

Move this work into CSS: Move a fixed-view two-axis path to nested CSS transforms.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 016 Twelve-step dial

**Loop:** 12s · **Type:** CSS substitute · **Three.js pair:** [016 — Watch display with ticking marker](100-threejs-loop-prompts.md#016-watch-display-with-ticking-marker)

```text
Create a responsive no-build HTML/CSS loop titled "Twelve-step dial" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 016.

Build a circular dial with twelve fixed tick marks and one hand. Rotate the hand through 360 degrees over 12 seconds with steps(12,end), pivoting at the dial center. Keep the dial stationary and label it as a decorative timer rather than a clock.

Move this work into CSS: Replace decorative step timing and hand rotation with CSS steps().

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 017 Soft camera flash

**Loop:** 6s · **Type:** CSS companion · **Three.js pair:** [017 — Camera flash accent](100-threejs-loop-prompts.md#017-camera-flash-accent)

```text
Create a responsive no-build HTML/CSS loop titled "Soft camera flash" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 017.

Place a soft radial-gradient pseudo-element over the flash region of a camera poster or canvas wrapper. Animate opacity from 0 to 0.65 and back during a small portion of a 6-second loop. Keep the gradient size fixed and the rest of the scene unchanged.

Move this work into CSS: Move the decorative flash sprite to CSS; any independently animated 3D camera body still needs rendering.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 018 CSS equalizer bars

**Loop:** 4s · **Type:** CSS companion · **Three.js pair:** [018 — Boombox signal bars](100-threejs-loop-prompts.md#018-boombox-signal-bars)

```text
Create a responsive no-build HTML/CSS loop titled "CSS equalizer bars" with a complete repeat period of 4 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 018.

Place five rounded bars above a static boombox image or canvas. Animate scaleY from the bottom using one 4-second keyframe sequence and staggered negative delays. Use different fixed amplitudes through custom properties. Present the bars as a decorative rhythm.

Move this work into CSS: Move the bar geometry animation into CSS; the boombox can be rendered once.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 019 Breathing lantern halo

**Loop:** 5s · **Type:** CSS companion · **Three.js pair:** [019 — Lantern warm halo](100-threejs-loop-prompts.md#019-lantern-warm-halo)

```text
Create a responsive no-build HTML/CSS loop titled "Breathing lantern halo" with a complete repeat period of 5 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 019.

Put a radial-gradient halo behind a lantern image or canvas. Pulse the halo opacity from 0.2 to 0.5 and back over 5 seconds using ease-in-out. Keep its blur and size constant and preserve a separate stacking layer for the product.

Move this work into CSS: Move the decorative halo to CSS without altering the model's material lighting.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 020 Three-card accessory carousel

**Loop:** 12s · **Type:** CSS substitute · **Three.js pair:** [020 — Accessory carousel](100-threejs-loop-prompts.md#020-accessory-carousel)

```text
Create a responsive no-build HTML/CSS loop titled "Three-card accessory carousel" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 020.

Place three flat accessory cards at 120-degree intervals around a CSS 3D cylinder using rotateY and translateZ. Rotate their common parent by one turn over 12 seconds with preserve-3d. Use backface-visibility:hidden and a perspective parent, and keep overflow clipping outside the 3D group.

Move this work into CSS: Replace a model carousel with CSS cards when flat previews satisfy the design.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

## 21–30: Food and playful scenes

### 021 Avocado sticker tumble

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [021 — Avocado slow tumble](100-threejs-loop-prompts.md#021-avocado-slow-tumble)

```text
Create a responsive no-build HTML/CSS loop titled "Avocado sticker tumble" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 021.

Draw an avocado sticker using nested rounded shapes for skin, flesh and seed. Rotate the whole sticker one turn in 10 seconds. Add a static shaded edge, and state that this is a playful flat tumble rather than a view of the avocado's hidden surface.

Move this work into CSS: Replace quaternion-driven model rotation with a flat CSS sticker spin.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 022 Seed focus ring

**Loop:** 6s · **Type:** CSS companion · **Three.js pair:** [022 — Avocado seed spotlight](100-threejs-loop-prompts.md#022-avocado-seed-spotlight)

```text
Create a responsive no-build HTML/CSS loop titled "Seed focus ring" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 022.

Place an outlined circular pseudo-element over the seed region of an avocado poster. Pulse its transform scale and opacity over 6 seconds. Keep the ring border width fixed and let its center be configured with percentages for different image crops.

Move this work into CSS: Move the focus-ring mesh and its pulse to a CSS overlay.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 023 Fish side drift

**Loop:** 8s · **Type:** CSS wrapper · **Three.js pair:** [023 — Fish gentle cruise](100-threejs-loop-prompts.md#023-fish-gentle-cruise)

```text
Create a responsive no-build HTML/CSS loop titled "Fish side drift" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 023.

Draw a fish body and triangular tail or use a side-view cutout. Move its wrapper horizontally and slightly upward at mid-cycle, then return over 8 seconds. Keep all body parts rigid and use transform keyframes with matching first and last poses.

Move this work into CSS: Transfer fixed-view cruising to a CSS wrapper without deforming the fish.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 024 Six rising bubbles

**Loop:** 6s · **Type:** CSS companion · **Three.js pair:** [024 — Fish bubble trail](100-threejs-loop-prompts.md#024-fish-bubble-trail)

```text
Create a responsive no-build HTML/CSS loop titled "Six rising bubbles" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 024.

Create six circular elements next to a fish poster. Animate translateY, scale and opacity over 6 seconds with staggered negative delays. Fade each bubble to zero before its position resets. Use a fixed set of elements and no runtime particle generator.

Move this work into CSS: Replace the decorative bubble meshes and particle update loop with CSS keyframes.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 025 Rubber-duck bob

**Loop:** 4s · **Type:** CSS wrapper · **Three.js pair:** [025 — Duck water bob](100-threejs-loop-prompts.md#025-duck-water-bob)

```text
Create a responsive no-build HTML/CSS loop titled "Rubber-duck bob" with a complete repeat period of 4 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 025.

Build a duck silhouette or use a cutout. Animate its wrapper through a subtle translateY and rotateZ bob over 4 seconds, with a static blue oval below. Put the oval outside the moving wrapper and keep the beak attached to the duck.

Move this work into CSS: Move screen-space bobbing and rolling to CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 026 Pond ripple ellipses

**Loop:** 5s · **Type:** CSS companion · **Three.js pair:** [026 — Duck ripple rings](100-threejs-loop-prompts.md#026-duck-ripple-rings)

```text
Create a responsive no-build HTML/CSS loop titled "Pond ripple ellipses" with a complete repeat period of 5 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 026.

Place three outlined ellipses under a static duck image. Animate scale from 0.6 to 1.6 and opacity to zero over 5 seconds, staggered evenly. Keep borders static and position the duck above the ripple layer so it remains crisp.

Move this work into CSS: Replace the expanding ripple meshes with CSS pseudo-elements or a small fixed element set.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 027 Avocado orbital menu

**Loop:** 12s · **Type:** CSS substitute · **Three.js pair:** [027 — Three avocados on a wheel](100-threejs-loop-prompts.md#027-three-avocados-on-a-wheel)

```text
Create a responsive no-build HTML/CSS loop titled "Avocado orbital menu" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 027.

Arrange three avocado icons around a circular parent using rotated positioning wrappers. Spin the parent for 12 seconds and counter-spin each icon for the same duration so the icons stay upright. Keep labels in the counter-rotating wrappers and avoid a JavaScript orbit calculation.

Move this work into CSS: Replace the circular positions and counter-rotation with nested CSS transforms.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 028 Bottle fill meter

**Loop:** 4s · **Type:** CSS substitute · **Three.js pair:** [028 — Bottle hydration pulse](100-threejs-loop-prompts.md#028-bottle-hydration-pulse)

```text
Create a responsive no-build HTML/CSS loop titled "Bottle fill meter" with a complete repeat period of 4 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 028.

Draw a bottle outline and clip a blue rectangular fill inside it. Animate the fill with scaleY from 0.25 to 0.85 and back over 4 seconds, with transform-origin:bottom. Keep the outline above the fill and avoid animating height.

Move this work into CSS: Replace the graphic meter plane with a CSS fill animation; this is not liquid simulation.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 029 Duck window peek

**Loop:** 6s · **Type:** CSS wrapper · **Three.js pair:** [029 — Duck peekaboo](100-threejs-loop-prompts.md#029-duck-peekaboo)

```text
Create a responsive no-build HTML/CSS loop titled "Duck window peek" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 029.

Put a duck cutout inside an overflow-hidden window with a foreground sill. Translate it upward, hold it above the sill, then lower it over 6 seconds. Start and finish completely below the sill, and keep the sill outside the animated wrapper.

Move this work into CSS: Move the reveal and clipping choreography into CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 030 Toy seesaw loop

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [030 — Two-duck seesaw](100-threejs-loop-prompts.md#030-two-duck-seesaw)

```text
Create a responsive no-build HTML/CSS loop titled "Toy seesaw loop" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 030.

Build a beam with two duck icons at its ends and a static triangular support below. Animate the entire beam assembly between -8 and +8 degrees over 8 seconds with transform-origin:center. Use a nested counter-rotation only if you want the duck icons upright.

Move this work into CSS: Replace rigid seesaw group transforms with CSS rotation.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

## 31–40: Vehicles and travel

### 031 Car showcase card

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [031 — Toy car showroom](100-threejs-loop-prompts.md#031-toy-car-showroom)

```text
Create a responsive no-build HTML/CSS loop titled "Car showcase card" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 031.

Place front and side car illustrations on two faces of a flat card and rotate the card once over 10 seconds. Use perspective and backface-visibility:hidden. Make the card's thickness decorative and explain that this substitutes a rotating preview card for actual car geometry.

Move this work into CSS: Replace the 3D turntable with a CSS product card.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 032 Delivery truck crossing

**Loop:** 8s · **Type:** CSS wrapper · **Three.js pair:** [032 — Milk truck lane loop](100-threejs-loop-prompts.md#032-milk-truck-lane-loop)

```text
Create a responsive no-build HTML/CSS loop titled "Delivery truck crossing" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 032.

Draw a truck icon or use a side-view cutout. Translate its wrapper completely across an overflow-hidden lane over 8 seconds using linear timing. Include the truck's full width in both offscreen endpoints so its reset remains invisible. Keep the road static.

Move this work into CSS: Replace the truck path and offscreen reset calculation with a CSS translation.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 033 Road-bump car bounce

**Loop:** 3s · **Type:** CSS wrapper · **Three.js pair:** [033 — Car suspension impression](100-threejs-loop-prompts.md#033-car-suspension-impression)

```text
Create a responsive no-build HTML/CSS loop titled "Road-bump car bounce" with a complete repeat period of 3 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 033.

Use a side-view car cutout and keyframe a tiny translateY bounce with a 1-degree rotation over 3 seconds. Move a separate road-dash strip underneath at constant speed. Keep the car silhouette rigid and give the scene a static reduced-motion state.

Move this work into CSS: Move rigid vehicle bounce and scrolling road decoration to CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 034 Wobbling caution cone

**Loop:** 4s · **Type:** CSS substitute · **Three.js pair:** [034 — Traffic-cone caution wobble](100-threejs-loop-prompts.md#034-traffic-cone-caution-wobble)

```text
Create a responsive no-build HTML/CSS loop titled "Wobbling caution cone" with a complete repeat period of 4 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 034.

Draw a striped cone with a static triangular clip-path and rectangular base. Animate rotate(-6deg) to rotate(6deg) and back over 4 seconds with transform-origin:50% 100%. Keep the stripes inside the same wrapper so they move with the cone.

Move this work into CSS: Replace the cone's pivot animation with CSS transform-origin and keyframes.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 035 Opposing delivery lanes

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [035 — Two trucks passing](100-threejs-loop-prompts.md#035-two-trucks-passing)

```text
Create a responsive no-build HTML/CSS loop titled "Opposing delivery lanes" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 035.

Place two truck icons in separate clipped lanes and translate them in opposite directions over 10 seconds. Flip only the second icon's artwork wrapper, not its path wrapper. Ensure both endpoints are fully offscreen and use separate labels so mirrored text never appears.

Move this work into CSS: Replace two path update loops with opposing CSS translations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 036 Top-view circular car

**Loop:** 12s · **Type:** CSS substitute · **Three.js pair:** [036 — Toy-car circular track](100-threejs-loop-prompts.md#036-toy-car-circular-track)

```text
Create a responsive no-build HTML/CSS loop titled "Top-view circular car" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 036.

Place a top-view car icon at the end of a radius wrapper and rotate that wrapper once in 12 seconds. Adjust the icon's fixed local rotation so it faces the tangent. Draw the track as a static circular border and use no motion-path library.

Move this work into CSS: Replace circular path and heading calculations with a rotating CSS parent.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 037 Endless cone strip

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [037 — Cone conveyor](100-threejs-loop-prompts.md#037-cone-conveyor)

```text
Create a responsive no-build HTML/CSS loop titled "Endless cone strip" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 037.

Create two identical strips of four cone icons, each with identical spacing and explicit width. Translate the combined track by exactly one strip width over 8 seconds. Clip its outer container and remove the gap between the duplicated strips so the repeat is seamless.

Move this work into CSS: Replace repeating clone positions with a duplicated CSS marquee strip.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 038 Delivery notification ripple

**Loop:** 5s · **Type:** CSS companion · **Three.js pair:** [038 — Truck delivery ring](100-threejs-loop-prompts.md#038-truck-delivery-ring)

```text
Create a responsive no-build HTML/CSS loop titled "Delivery notification ripple" with a complete repeat period of 5 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 038.

Center a truck icon or static canvas above two expanding circular outlines. Animate scale and opacity over 5 seconds, with one ring delayed by half a cycle. Keep the rings behind the truck and do not display a percentage or imply actual delivery progress.

Move this work into CSS: Move the repeating status rings to CSS while leaving the truck static.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 039 Car layered parallax sway

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [039 — Car inspection camera arc](100-threejs-loop-prompts.md#039-car-inspection-camera-arc)

```text
Create a responsive no-build HTML/CSS loop titled "Car layered parallax sway" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 039.

Compose a flat car image, foreground road edge and background panel on three layers. Translate them horizontally at different small amplitudes over 10 seconds to suggest an inspection arc. Keep the car image intact and explicitly describe the result as layered parallax rather than a new 3D viewpoint.

Move this work into CSS: Replace a camera orbit with a CSS parallax approximation when depth accuracy is unnecessary.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 040 Cone depth layers

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [040 — Cone slalom camera illusion](100-threejs-loop-prompts.md#040-cone-slalom-camera-illusion)

```text
Create a responsive no-build HTML/CSS loop titled "Cone depth layers" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 040.

Create three cone icons on near, middle and far layers. Move the layers left and right over 8 seconds with decreasing amplitudes to suggest camera travel. Set their scales statically to imply depth and use one shared duration so all layers return together.

Move this work into CSS: Replace camera translation with CSS layer motion for a flat scene.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

## 41–50: Interiors and decor

### 041 Sofa perspective panel

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [041 — Sofa slow inspection](100-threejs-loop-prompts.md#041-sofa-slow-inspection)

```text
Create a responsive no-build HTML/CSS loop titled "Sofa perspective panel" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 041.

Draw a sofa with three cushions, arms and legs in a compact HTML illustration. Apply a gentle rotateY sway over 10 seconds to its shared wrapper with perspective on the parent. Use fixed shading to suggest cushion depth without simulating velvet or changing the view of real geometry.

Move this work into CSS: Replace the live sofa inspection with a CSS illustration when approximate depth is enough.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 042 Floating chair poster

**Loop:** 6s · **Type:** CSS wrapper · **Three.js pair:** [042 — Chair floating seat display](100-threejs-loop-prompts.md#042-chair-floating-seat-display)

```text
Create a responsive no-build HTML/CSS loop titled "Floating chair poster" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 042.

Put a chair cutout or render-once canvas above a soft elliptical shadow. Animate translateY over 6 seconds and animate the shadow's scale and opacity with the same phase. Keep the blur radius constant and reserve enough space to avoid clipping the chair back.

Move this work into CSS: Move chair translation and its graphic shadow to CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 043 Flower-vase sway

**Loop:** 8s · **Type:** CSS wrapper · **Three.js pair:** [043 — Vase gentle sway](100-threejs-loop-prompts.md#043-vase-gentle-sway)

```text
Create a responsive no-build HTML/CSS loop titled "Flower-vase sway" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 043.

Use a complete vase-and-flowers cutout in a wrapper with transform-origin:bottom center. Rotate it between -2 and +2 degrees over 8 seconds. Keep all stems inside that wrapper and draw the floor shadow as a separate static element.

Move this work into CSS: Replace the whole-assembly screen-plane sway with CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 044 Appliance rise-and-hide

**Loop:** 8s · **Type:** CSS wrapper · **Three.js pair:** [044 — Refrigerator reveal from below](100-threejs-loop-prompts.md#044-refrigerator-reveal-from-below)

```text
Create a responsive no-build HTML/CSS loop titled "Appliance rise-and-hide" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 044.

Put an appliance cutout inside an overflow-hidden panel. Animate translateY from 110% to 0, hold briefly, then return over 8 seconds. Position a static plinth over the panel edge to make the reveal deliberate and keep the title outside the moving element.

Move this work into CSS: Move the appliance entrance and crop logic to CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 045 Cushion side wobble

**Loop:** 6s · **Type:** CSS wrapper · **Three.js pair:** [045 — Pouf side-to-side roll impression](100-threejs-loop-prompts.md#045-pouf-side-to-side-roll-impression)

```text
Create a responsive no-build HTML/CSS loop titled "Cushion side wobble" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 045.

Animate a cushion illustration through translateX(-12px) rotate(-5deg), the opposite pose, and back over 6 seconds. Use one wrapper for the combined transform and keep its baseline visually consistent. Give the cushion a static shaded edge.

Move this work into CSS: Move the small translation-and-roll impression into one CSS keyframe animation.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 046 Chair wave row

**Loop:** 6s · **Type:** CSS substitute · **Three.js pair:** [046 — Three chairs staggered lift](100-threejs-loop-prompts.md#046-three-chairs-staggered-lift)

```text
Create a responsive no-build HTML/CSS loop titled "Chair wave row" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 046.

Arrange three chair icons in a row and animate each with the same 6-second translateY cycle. Apply negative delays of 0, -2 and -4 seconds to form a continuous wave. Use a fixed gap and keep icon labels in separate nonmoving elements.

Move this work into CSS: Replace three clone-position calculations with staggered CSS keyframes.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 047 Drifting interior panels

**Loop:** 12s · **Type:** CSS companion · **Three.js pair:** [047 — Sofa with drifting room cards](100-threejs-loop-prompts.md#047-sofa-with-drifting-room-cards)

```text
Create a responsive no-build HTML/CSS loop titled "Drifting interior panels" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 047.

Place two rounded background panels behind a static sofa image or canvas. Animate their translateX values in opposite directions over 12 seconds with gentle easing. Keep their colors and shadows fixed and reserve foreground stacking for the sofa.

Move this work into CSS: Replace background plane animation with CSS while the sofa view remains static.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 048 Hanging lantern trio

**Loop:** 9s · **Type:** CSS substitute · **Three.js pair:** [048 — Lantern trio wave](100-threejs-loop-prompts.md#048-lantern-trio-wave)

```text
Create a responsive no-build HTML/CSS loop titled "Hanging lantern trio" with a complete repeat period of 9 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 048.

Build three lantern icons hanging from separate lines. Set transform-origin at each handle and use a shared 9-second swing with delays of 0, -3 and -6 seconds. Keep the line anchor points fixed and the glow static.

Move this work into CSS: Replace three pivot calculations with delayed CSS swing animations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 049 Breathing decor spotlight

**Loop:** 7s · **Type:** CSS companion · **Three.js pair:** [049 — Vase spotlight oval](100-threejs-loop-prompts.md#049-vase-spotlight-oval)

```text
Create a responsive no-build HTML/CSS loop titled "Breathing decor spotlight" with a complete repeat period of 7 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 049.

Put a soft oval behind the base of a vase poster. Animate its scale and opacity over 7 seconds while keeping its blur constant. Ensure the vase stays on a separate foreground layer and its glass appearance comes from the image rather than the glow.

Move this work into CSS: Move the decorative floor accent from a mesh to CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 050 Decor catalog marquee

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [050 — Furniture card conveyor](100-threejs-loop-prompts.md#050-furniture-card-conveyor)

```text
Create a responsive no-build HTML/CSS loop titled "Decor catalog marquee" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 050.

Make two identical strips of three furniture cards using pouf illustrations. Translate the combined track by one exact strip width over 10 seconds and clip the outer container. Keep gaps inside each repeated strip and hide the duplicated content from assistive technology.

Move this work into CSS: Replace repeated 3D product motion with a CSS catalog strip.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

## 51–60: Characters and mascots

### 051 Paper fox walking illusion

**Loop:** 4s · **Type:** CSS substitute · **Three.js pair:** [051 — Fox walk in place](100-threejs-loop-prompts.md#051-fox-walk-in-place)

```text
Create a responsive no-build HTML/CSS loop titled "Paper fox walking illusion" with a complete repeat period of 4 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 051.

Build a paper fox from a body, head, tail and four leg elements. Swing opposing leg pairs with CSS rotations and add a tiny body bob over 4 seconds. Keep pivots at the hips and label the result a simplified paper-character approximation of skeletal walking.

Move this work into CSS: Replace skeletal playback with articulated HTML shapes when a stylized mascot is sufficient.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 052 Fox looking around

**Loop:** 6s · **Type:** CSS substitute · **Three.js pair:** [052 — Fox survey loop](100-threejs-loop-prompts.md#052-fox-survey-loop)

```text
Create a responsive no-build HTML/CSS loop titled "Fox looking around" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 052.

Create a fox body and a separate head wrapper with pointed ears. Rotate the head gently left and right around its neck during a 6-second loop, with short rests at each side. Keep the eyes attached to the head and avoid rapid movement.

Move this work into CSS: Replace a detailed survey clip with a CSS head-turn illustration.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 053 Running fox emblem

**Loop:** 2s · **Type:** CSS substitute · **Three.js pair:** [053 — Fox running badge](100-threejs-loop-prompts.md#053-fox-running-badge)

```text
Create a responsive no-build HTML/CSS loop titled "Running fox emblem" with a complete repeat period of 2 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 053.

Make a compact fox icon with separate legs and tail. Animate faster opposing leg swings and a short upward body bounce within a 2-second loop. Keep the badge background static and use transform-only motion on the character pieces.

Move this work into CSS: Replace skeletal running with a compact CSS mascot animation.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 054 Geometric dancing figure

**Loop:** 4s · **Type:** CSS substitute · **Three.js pair:** [054 — Cesium character dance cycle](100-threejs-loop-prompts.md#054-cesium-character-dance-cycle)

```text
Create a responsive no-build HTML/CSS loop titled "Geometric dancing figure" with a complete repeat period of 4 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 054.

Construct a simple figure from a circular head and rounded limb segments. Rotate arms and legs around shoulder and hip pivots while bobbing the torso in a 4-second cycle. Use opposing phases and keep the body visible at every point.

Move this work into CSS: Replace a full character rig with a small CSS articulated illustration.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 055 Stick-figure sway

**Loop:** 5s · **Type:** CSS substitute · **Three.js pair:** [055 — Rigged figure clip showcase](100-threejs-loop-prompts.md#055-rigged-figure-clip-showcase)

```text
Create a responsive no-build HTML/CSS loop titled "Stick-figure sway" with a complete repeat period of 5 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 055.

Build a minimal head, torso, arms and legs from HTML elements. Sway the torso and swing both arms in a friendly 5-second cycle with fixed limb lengths. Present this as a similar character motion rather than a reproduction of the downloaded rig's exact pose sequence.

Move this work into CSS: Replace skeletal playback with CSS limb transforms for a simple character.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 056 Fox collectible card spin

**Loop:** 12s · **Type:** CSS substitute · **Three.js pair:** [056 — Fox on a rotating pedestal](100-threejs-loop-prompts.md#056-fox-on-a-rotating-pedestal)

```text
Create a responsive no-build HTML/CSS loop titled "Fox collectible card spin" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 056.

Place a fox illustration on a collectible card with a separate back face. Rotate the card through 360 degrees over 12 seconds using perspective and hidden backfaces. Keep its border and label attached to the card, and describe it as a flat collectible display.

Move this work into CSS: Replace the frozen-character turntable with a CSS card spin.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 057 Duck greeting bow

**Loop:** 4s · **Type:** CSS substitute · **Three.js pair:** [057 — Duck friendly nod](100-threejs-loop-prompts.md#057-duck-friendly-nod)

```text
Create a responsive no-build HTML/CSS loop titled "Duck greeting bow" with a complete repeat period of 4 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 057.

Draw a duck silhouette and animate its whole wrapper from upright to a slight rotateX bow and back over 4 seconds. Add perspective to the parent and a short pause at the deepest bow. Keep the beak and eye inside the same wrapper.

Move this work into CSS: Replace a rigid model greeting with a CSS perspective bow.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 058 Iridescent mascot sticker

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [058 — Iridescent monkey head spin](100-threejs-loop-prompts.md#058-iridescent-monkey-head-spin)

```text
Create a responsive no-build HTML/CSS loop titled "Iridescent mascot sticker" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 058.

Use a simple monkey-head silhouette with a fixed multicolor gradient. Rotate the sticker in the image plane over 10 seconds and move a translucent highlight layer across it. State that the gradient is decorative and does not reproduce view-dependent iridescence.

Move this work into CSS: Replace real material response and mesh rotation with a CSS graphic treatment.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 059 Mascot orbit dots

**Loop:** 8s · **Type:** CSS companion · **Three.js pair:** [059 — Character with orbiting dots](100-threejs-loop-prompts.md#059-character-with-orbiting-dots)

```text
Create a responsive no-build HTML/CSS loop titled "Mascot orbit dots" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 059.

Place a static character image in the center and three dots on rotating radius wrappers. Rotate their parent one turn over 8 seconds, with dots spaced by 120 degrees. Use fixed dot sizes and keep the character on a separate layer.

Move this work into CSS: Move the decorative dot orbit to CSS; the frozen character only needs an initial render.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 060 Mascot ground scroll

**Loop:** 4s · **Type:** CSS companion · **Three.js pair:** [060 — Fox with drifting ground](100-threejs-loop-prompts.md#060-fox-with-drifting-ground)

```text
Create a responsive no-build HTML/CSS loop titled "Mascot ground scroll" with a complete repeat period of 4 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 060.

Under a fox image or animated WebGL canvas, place two identical strips of simple ground marks. Translate the track by exactly one strip width over 4 seconds. Keep this decorative ground loop independent of the character and use a shared duration variable if the two should feel synchronized.

Move this work into CSS: Move ground decoration to CSS; skeletal fox playback still requires Three.js.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

## 61–70: Small group choreography

### 061 Two-icon greeting

**Loop:** 6s · **Type:** CSS substitute · **Three.js pair:** [061 — Two ducks greeting](100-threejs-loop-prompts.md#061-two-ducks-greeting)

```text
Create a responsive no-build HTML/CSS loop titled "Two-icon greeting" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 061.

Place two duck icons in separate wrappers facing one another. Animate their translateX values inward and outward over 6 seconds and add a tiny bow at the closest point. Keep any artwork mirroring on an inner wrapper so it does not reverse the motion.

Move this work into CSS: Replace two coordinated rigid-object paths with CSS keyframes.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 062 Bottle fan display

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [062 — Three-bottle expanding fan](100-threejs-loop-prompts.md#062-three-bottle-expanding-fan)

```text
Create a responsive no-build HTML/CSS loop titled "Bottle fan display" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 062.

Create three bottle illustrations whose wrappers pivot near their bases. Keep the center still and animate the side wrappers from small starting angles to plus or minus 18 degrees and back over 8 seconds. Add fixed horizontal offsets so their silhouettes remain readable.

Move this work into CSS: Replace a synchronized product fan with CSS rotations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 063 Two-product stack spread

**Loop:** 8s · **Type:** CSS wrapper · **Three.js pair:** [063 — Sneaker stack separation](100-threejs-loop-prompts.md#063-sneaker-stack-separation)

```text
Create a responsive no-build HTML/CSS loop titled "Two-product stack spread" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 063.

Stack two separate sneaker posters in a centered container. Animate the upper one upward and the lower one downward over 8 seconds, hold briefly, then restore their starting offsets. Use transform keyframes and leave their captions on a separate static layer.

Move this work into CSS: Move the two fixed-view product translations into CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 064 Avocado spiral drift

**Loop:** 12s · **Type:** CSS substitute · **Three.js pair:** [064 — Avocado helix elevator](100-threejs-loop-prompts.md#064-avocado-helix-elevator)

```text
Create a responsive no-build HTML/CSS loop titled "Avocado spiral drift" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 064.

Use three flat avocado stickers with nested horizontal and vertical wrappers. Approximate a spiral with sideways oscillation during a steady rise over 12 seconds, varying scale slightly to suggest depth. Stagger the stickers and hide each reset at zero opacity.

Move this work into CSS: Replace a 3D helix with a CSS layered motion approximation.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 065 Caution-cone lean sequence

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [065 — Cone domino wave](100-threejs-loop-prompts.md#065-cone-domino-wave)

```text
Create a responsive no-build HTML/CSS loop titled "Caution-cone lean sequence" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 065.

Build five cone icons and animate a short 12-degree lean-and-return segment within an 8-second keyframe cycle. Stagger the starts evenly with negative delays. Set every transform-origin at the base and leave enough spacing so no icon overlaps its neighbor.

Move this work into CSS: Replace the timed cone pivot wave with CSS animation delays.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 066 Twelve-dot circular chase

**Loop:** 12s · **Type:** CSS companion · **Three.js pair:** [066 — Watch marker chase](100-threejs-loop-prompts.md#066-watch-marker-chase)

```text
Create a responsive no-build HTML/CSS loop titled "Twelve-dot circular chase" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 066.

Position twelve dots around a static watch image using rotated wrappers. Give each a 12-second opacity animation with a one-second bright interval and successive one-second delays. Keep all positions fixed so only opacity changes, and restore the first dot cleanly at the repeat.

Move this work into CSS: Move the marker chase from scene objects and JS timing to CSS opacity animations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 067 Checkerboard tile flips

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [067 — Checkerboard cube flips](100-threejs-loop-prompts.md#067-checkerboard-cube-flips)

```text
Create a responsive no-build HTML/CSS loop titled "Checkerboard tile flips" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 067.

Build a two-by-two grid of double-sided CSS cards. Flip diagonal pairs through a full turn during alternating halves of an 8-second cycle, using separate keyframe schedules or delays. Keep perspective on each cell and labels attached to the correct card face.

Move this work into CSS: Replace grouped cube flips with CSS card flips.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 068 Accessory rosette pulse

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [068 — Sunglasses burst rosette](100-threejs-loop-prompts.md#068-sunglasses-burst-rosette)

```text
Create a responsive no-build HTML/CSS loop titled "Accessory rosette pulse" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 068.

Place six sunglasses icons in fixed-angle radial wrappers. Animate each icon's distance from the center with translateX inside its radial wrapper over 10 seconds, and counter-rotate the icon to stay upright. Keep the angular arrangement static.

Move this work into CSS: Replace radial position updates with nested CSS translations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 069 Sequential lantern lifts

**Loop:** 9s · **Type:** CSS wrapper · **Three.js pair:** [069 — Lantern lift in sequence](100-threejs-loop-prompts.md#069-lantern-lift-in-sequence)

```text
Create a responsive no-build HTML/CSS loop titled "Sequential lantern lifts" with a complete repeat period of 9 seconds. Apply the shared CSS brief. This is a CSS wrapper for Three.js prompt 069.

Place three lantern posters in a row. Define a 9-second keyframe animation containing one short lift-and-return followed by rest, then offset the three animations by 3 seconds. Keep the glow static and make the first and last transform states identical.

Move this work into CSS: Move the sequential lift scheduling into CSS delays and keyframes.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 070 Paper-fox walking chorus

**Loop:** 4s · **Type:** CSS substitute · **Three.js pair:** [070 — Three-fox walking chorus](100-threejs-loop-prompts.md#070-three-fox-walking-chorus)

```text
Create a responsive no-build HTML/CSS loop titled "Paper-fox walking chorus" with a complete repeat period of 4 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 070.

Create three copies of a simple paper-fox component with separately pivoted legs. Run the same 4-second walking illusion on each and offset their phases evenly. Keep all body sizes fixed and let CSS custom properties control each component's delay.

Move this work into CSS: Replace several skeletal animation mixers with repeated CSS character components.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

## 71–80: Geometric loops from a downloaded model

### 071 Six-face CSS cube

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [071 — Single cube diagonal spin](100-threejs-loop-prompts.md#071-single-cube-diagonal-spin)

```text
Create a responsive no-build HTML/CSS loop titled "Six-face CSS cube" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 071.

Construct a cube from six square HTML faces with translateZ and fixed face rotations. Rotate the enclosing preserve-3d group around a fixed diagonal axis over 8 seconds. Use perspective and static face colors. Keep clipping and group opacity on an outer wrapper to preserve the faces' depth.

Move this work into CSS: Replace a simple geometric WebGL scene with a CSS 3D cube.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 072 Elastic block illusion

**Loop:** 6s · **Type:** CSS substitute · **Three.js pair:** [072 — Morph cube shape cycle](100-threejs-loop-prompts.md#072-morph-cube-shape-cycle)

```text
Create a responsive no-build HTML/CSS loop titled "Elastic block illusion" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 072.

Build a flat shaded block from a front face and two fixed side facets. Over 6 seconds, animate its wrapper through scaleX, scaleY and a gentle skew to suggest thinning and leaning. Clearly describe this as a graphic approximation; CSS transforms do not morph the GLB vertices.

Move this work into CSS: Replace true mesh morphing with a CSS squash-and-skew illustration.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 073 Accordion block row

**Loop:** 6s · **Type:** CSS substitute · **Three.js pair:** [073 — Cube accordion](100-threejs-loop-prompts.md#073-cube-accordion)

```text
Create a responsive no-build HTML/CSS loop titled "Accordion block row" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 073.

Create five colored blocks with fixed layout positions and animate their translateX offsets outward and back over 6 seconds. Give the center block zero displacement and symmetric amplitudes to its neighbors. Avoid animating gap or width so the movement stays transform-based.

Move this work into CSS: Replace per-cube position updates with CSS translations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 074 Cube-and-orbit badge

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [074 — Cube with satellite orbit](100-threejs-loop-prompts.md#074-cube-with-satellite-orbit)

```text
Create a responsive no-build HTML/CSS loop titled "Cube-and-orbit badge" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 074.

Build a small central CSS cube and two flat satellite squares on rotating radius wrappers. Tilt one orbit wrapper to suggest a second plane and run both for 10 seconds. Keep orbit rings static and use flat-color satellites to limit DOM complexity.

Move this work into CSS: Replace satellite path calculations with rotating CSS wrappers.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 075 Breathing four-dot square

**Loop:** 5s · **Type:** CSS substitute · **Three.js pair:** [075 — Four-cube breathing square](100-threejs-loop-prompts.md#075-four-cube-breathing-square)

```text
Create a responsive no-build HTML/CSS loop titled "Breathing four-dot square" with a complete repeat period of 5 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 075.

Place four square elements at fixed corner positions and animate paired translateX and translateY offsets outward and back over 5 seconds. Use symmetric offsets through custom properties. Keep dimensions and colors static, with identical start and end transforms.

Move this work into CSS: Replace a simple four-object expansion with CSS transforms.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 076 Isometric bar wave

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [076 — Staircase height wave](100-threejs-loop-prompts.md#076-staircase-height-wave)

```text
Create a responsive no-build HTML/CSS loop titled "Isometric bar wave" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 076.

Build five shaded bar elements with transform-origin:bottom. Animate scaleY through a staggered 8-second wave and use static skewed side facets to suggest depth. Keep all bars attached to one baseline and avoid changing their CSS height during playback.

Move this work into CSS: Replace column scale calculations with CSS scaleY animations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 077 Rolling square loader

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [077 — Cube rolling in place](100-threejs-loop-prompts.md#077-cube-rolling-in-place)

```text
Create a responsive no-build HTML/CSS loop titled "Rolling square loader" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 077.

Animate a square through four 90-degree rotations in 8 seconds. Combine each step with a small upward translation and return to its baseline between steps. Use a static floor line and design the transform sequence so the final 360-degree pose visually matches the first.

Move this work into CSS: Replace a stylized rolling cube with a CSS square loader.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 078 Opening two-panel booklet

**Loop:** 6s · **Type:** CSS substitute · **Three.js pair:** [078 — Book-like cube panels](100-threejs-loop-prompts.md#078-book-like-cube-panels)

```text
Create a responsive no-build HTML/CSS loop titled "Opening two-panel booklet" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 078.

Create two rectangular CSS panels hinged along adjacent vertical edges. Animate their rotateY angles symmetrically open and closed over 6 seconds with perspective on the parent. Give each front and back a fixed color and keep the hinge position stationary.

Move this work into CSS: Replace simple hinged meshes with CSS 3D panels.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 079 Telescoping columns

**Loop:** 7s · **Type:** CSS substitute · **Three.js pair:** [079 — Telescoping block stack](100-threejs-loop-prompts.md#079-telescoping-block-stack)

```text
Create a responsive no-build HTML/CSS loop titled "Telescoping columns" with a complete repeat period of 7 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 079.

Place three rectangular columns in nested clipped wrappers. Animate the inner columns upward and back with translateY over 7 seconds while the outer shell stays still. Use fixed dimensions and layering to hide retracted portions rather than animating height.

Move this work into CSS: Replace extension-position logic with CSS transforms and clipping.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 080 Seven-block sine wave

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [080 — Cube ribbon wave](100-threejs-loop-prompts.md#080-cube-ribbon-wave)

```text
Create a responsive no-build HTML/CSS loop titled "Seven-block sine wave" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 080.

Create seven fixed-size squares in a row and give each the same 8-second translateY keyframes with evenly spaced negative delays. Keep horizontal positions static and use small amplitudes so neighboring blocks never collide. The CSS wave should repeat indefinitely.

Move this work into CSS: Replace seven time-based position calculations with delayed CSS animations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

## 81–90: Lighting and graphic accents

### 081 Scanning highlight line

**Loop:** 6s · **Type:** CSS companion · **Three.js pair:** [081 — Helmet scanning stripe](100-threejs-loop-prompts.md#081-helmet-scanning-stripe)

```text
Create a responsive no-build HTML/CSS loop titled "Scanning highlight line" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 081.

Place a thin translucent horizontal stripe over a static helmet poster or canvas. Move it from bottom to top over 6 seconds with translateY and fade it out before the reset. Clip it to a dedicated panel and keep its glow static.

Move this work into CSS: Replace the scanning plane and its position updates with a CSS overlay.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 082 Sliding color backdrop

**Loop:** 8s · **Type:** CSS companion · **Three.js pair:** [082 — Bottle sliding color backdrop](100-threejs-loop-prompts.md#082-bottle-sliding-color-backdrop)

```text
Create a responsive no-build HTML/CSS loop titled "Sliding color backdrop" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 082.

Create two oversized background panels behind a static bottle image or canvas. Animate opposite translateX motions over 8 seconds and clip them at the scene boundary. Keep the product in its own foreground layer and use fixed gradients on the panels.

Move this work into CSS: Move decorative background-plane animation into CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 083 Single bezel sparkle

**Loop:** 7s · **Type:** CSS companion · **Three.js pair:** [083 — Watch sparkle moment](100-threejs-loop-prompts.md#083-watch-sparkle-moment)

```text
Create a responsive no-build HTML/CSS loop titled "Single bezel sparkle" with a complete repeat period of 7 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 083.

Make a four-point sparkle from two intersecting tapered elements or a static SVG. Place it over the bezel of a watch poster and animate scale and opacity briefly within a 7-second loop. Keep most of the cycle at zero opacity and avoid repeated flashing.

Move this work into CSS: Replace a decorative sprite pulse with CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 084 Orbiting product accent

**Loop:** 8s · **Type:** CSS companion · **Three.js pair:** [084 — Sneaker orbiting ground accent](100-threejs-loop-prompts.md#084-sneaker-orbiting-ground-accent)

```text
Create a responsive no-build HTML/CSS loop titled "Orbiting product accent" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 084.

Put a small soft oval beneath a static sneaker image. Use nested rotating and counter-rotating wrappers inside a vertically compressed parent to create an 8-second elliptical orbit. Keep the true product shadow as a separate still element.

Move this work into CSS: Move the decorative floor orbit to CSS without changing lighting.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 085 Three-color backdrop wash

**Loop:** 12s · **Type:** CSS companion · **Three.js pair:** [085 — Iridescent head with color washes](100-threejs-loop-prompts.md#085-iridescent-head-with-color-washes)

```text
Create a responsive no-build HTML/CSS loop titled "Three-color backdrop wash" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 085.

Stack three fixed-color or fixed-gradient background layers behind a static mascot image or canvas. Crossfade their opacity over 12 seconds with overlapping holds and matching loop endpoints. Keep the product isolated above the layers so its colors are not directly tinted.

Move this work into CSS: Replace animated background materials with CSS layer crossfades.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 086 Warm-cool lantern mood

**Loop:** 12s · **Type:** CSS substitute · **Three.js pair:** [086 — Lantern day-to-night light](100-threejs-loop-prompts.md#086-lantern-day-to-night-light)

```text
Create a responsive no-build HTML/CSS loop titled "Warm-cool lantern mood" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 086.

Place two pre-rendered lantern views, one cool and one warm, at the same size and crossfade between them over 12 seconds. Keep both views registered to identical camera framing. Explain that pre-rendered lighting views replace the real-time light-color interpolation.

Move this work into CSS: Replace dynamic illumination with CSS opacity between prepared views.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 087 Camera blueprint crossfade

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [087 — Camera wireframe pulse](100-threejs-loop-prompts.md#087-camera-wireframe-pulse)

```text
Create a responsive no-build HTML/CSS loop titled "Camera blueprint crossfade" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 087.

Stack a normal camera poster and a matching prepared outline illustration. Fade the outline layer in and out over 8 seconds using opacity. Keep both images registered to the same view; CSS should not attempt to infer edges from a GLB file.

Move this work into CSS: Replace live edge rendering with a CSS crossfade to a prepared outline image.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 088 Garment wipe reveal

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [088 — Corset vertical reveal](100-threejs-loop-prompts.md#088-corset-vertical-reveal)

```text
Create a responsive no-build HTML/CSS loop titled "Garment wipe reveal" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 088.

Place a garment cutout inside a fixed-size wrapper and animate clip-path:inset() from fully covered to fully visible, hold, then cover it again over 8 seconds. Mark this as a clipping effect that must be profiled for painting cost, and provide a simple opacity fallback.

Move this work into CSS: Replace 3D clipping-plane updates with a CSS image reveal; clip-path is not guaranteed to be compositor-only.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 089 Fading product reflection

**Loop:** 6s · **Type:** CSS substitute · **Three.js pair:** [089 — Bottle reflection breath](100-threejs-loop-prompts.md#089-bottle-reflection-breath)

```text
Create a responsive no-build HTML/CSS loop titled "Fading product reflection" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 089.

Duplicate a bottle cutout below the original, flip the lower image vertically with scaleY(-1), and apply a fixed gradient mask. Animate only the reflection's opacity over 6 seconds. Keep the main bottle completely still and treat the lower image as a decorative reflection.

Move this work into CSS: Replace mirrored model rendering with a CSS image reflection.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 090 Product ghost echoes

**Loop:** 8s · **Type:** CSS substitute · **Three.js pair:** [090 — Helmet echo trails](100-threejs-loop-prompts.md#090-helmet-echo-trails)

```text
Create a responsive no-build HTML/CSS loop titled "Product ghost echoes" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 090.

Stack three matching helmet images with the main one on top. Move the two lower copies outward with translateX while fading them to zero over 8 seconds. Reset only when invisible, and retain a fully opaque main image throughout the loop.

Move this work into CSS: Replace translucent clone rendering and echo transforms with CSS image layers.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

## 91–100: Carrd hero and interface loops

### 091 Breathing editorial frame

**Loop:** 8s · **Type:** CSS companion · **Three.js pair:** [091 — T-shirt with moving editorial frame](100-threejs-loop-prompts.md#091-t-shirt-with-moving-editorial-frame)

```text
Create a responsive no-build HTML/CSS loop titled "Breathing editorial frame" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 091.

Surround a static T-shirt poster or transparent canvas with four thin positioned HTML strips. Animate the side strips outward and back over 8 seconds using translateX, keeping the top and bottom strips still. Keep the heading and call-to-action outside the frame animation.

Move this work into CSS: Move the frame strips into CSS and render the garment only when its view changes.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 092 Scroll-cue chevron

**Loop:** 3s · **Type:** CSS companion · **Three.js pair:** [092 — Bottle hero with scroll cue](100-threejs-loop-prompts.md#092-bottle-hero-with-scroll-cue)

```text
Create a responsive no-build HTML/CSS loop titled "Scroll-cue chevron" with a complete repeat period of 3 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 092.

Draw a chevron with borders below a static product image or canvas. Animate translateY and opacity over 3 seconds with a smooth return. Keep any actual anchor link as a separate accessible control and disable decorative motion for reduced-motion users.

Move this work into CSS: Replace the arrow meshes and their animation with CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 093 Rotating feature callouts

**Loop:** 9s · **Type:** CSS companion · **Three.js pair:** [093 — Sneaker feature labels](100-threejs-loop-prompts.md#093-sneaker-feature-labels)

```text
Create a responsive no-build HTML/CSS loop titled "Rotating feature callouts" with a complete repeat period of 9 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 093.

Place three HTML callouts at fixed percentage positions around a static sneaker view. Give each a 9-second opacity cycle with a distinct visible interval and short overlaps. Keep the semantic feature text available outside the decorative animation so it never becomes inaccessible.

Move this work into CSS: Move label visibility timing to CSS; fixed-view labels need no continuous 3D projection.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 094 Duck and three waiting dots

**Loop:** 3s · **Type:** CSS companion · **Three.js pair:** [094 — Duck waiting indicator](100-threejs-loop-prompts.md#094-duck-waiting-indicator)

```text
Create a responsive no-build HTML/CSS loop titled "Duck and three waiting dots" with a complete repeat period of 3 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 094.

Put three circular elements below a static duck illustration. Pulse scale and opacity sequentially over 3 seconds using negative delays. Keep the illustration still, add accessible loading text when appropriate, and never show fake percentage completion.

Move this work into CSS: Replace the repeating marker loop with CSS animations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 095 Twelve-piece confetti burst

**Loop:** 6s · **Type:** CSS substitute · **Three.js pair:** [095 — Downloaded-cube confetti burst](100-threejs-loop-prompts.md#095-downloaded-cube-confetti-burst)

```text
Create a responsive no-build HTML/CSS loop titled "Twelve-piece confetti burst" with a complete repeat period of 6 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 095.

Create twelve small rectangular elements with preassigned directions and distances stored in custom properties. Animate their transforms outward and fade them to zero during a 6-second loop, with a quiet pause before restarting. Use a fixed DOM set and no particle JavaScript.

Move this work into CSS: Replace a small deterministic confetti update loop with CSS keyframes.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 096 Focus-corner contraction

**Loop:** 5s · **Type:** CSS companion · **Three.js pair:** [096 — Camera focus brackets](100-threejs-loop-prompts.md#096-camera-focus-brackets)

```text
Create a responsive no-build HTML/CSS loop titled "Focus-corner contraction" with a complete repeat period of 5 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 096.

Draw four L-shaped corners with CSS borders around a camera poster. Animate the corner wrappers toward the center and back over 5 seconds with a short hold at the closest state. Use transforms, fixed dimensions and no animated border widths.

Move this work into CSS: Move the bracket geometry and focus-like timing to CSS.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 097 Streetwear poster marquee

**Loop:** 12s · **Type:** CSS substitute · **Three.js pair:** [097 — T-shirt floating gallery strip](100-threejs-loop-prompts.md#097-t-shirt-floating-gallery-strip)

```text
Create a responsive no-build HTML/CSS loop titled "Streetwear poster marquee" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 097.

Make two identical strips of four T-shirt posters with equal spacing. Move the track by one complete strip width over 12 seconds and clip the outer container. Keep the duplicate strip hidden from assistive technology and expose a pause control for the visible animation.

Move this work into CSS: Replace continuously rendered model clones with a CSS poster marquee.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 098 Delivery route chase

**Loop:** 8s · **Type:** CSS companion · **Three.js pair:** [098 — Truck with route dots](100-threejs-loop-prompts.md#098-truck-with-route-dots)

```text
Create a responsive no-build HTML/CSS loop titled "Delivery route chase" with a complete repeat period of 8 seconds. Apply the shared CSS brief. This is a CSS companion for Three.js prompt 098.

Place eight fixed dots along a horizontal line leading to a truck icon. Use an 8-second opacity keyframe animation on each with successive one-second delays. Keep the route and truck static and do not imply that the animation reflects actual tracking data.

Move this work into CSS: Replace route-marker timing with CSS opacity animations.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 099 Furniture pedestal lift

**Loop:** 10s · **Type:** CSS substitute · **Three.js pair:** [099 — Chair presentation elevator](100-threejs-loop-prompts.md#099-chair-presentation-elevator)

```text
Create a responsive no-build HTML/CSS loop titled "Furniture pedestal lift" with a complete repeat period of 10 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 099.

Combine a chair cutout and a CSS oval-topped pedestal in one wrapper. Translate the assembly upward 18px, hold briefly, then lower it over 10 seconds. Keep the floor shadow on a separate layer and ensure the assembly returns to the same baseline.

Move this work into CSS: Replace rigid chair-and-plinth motion with a CSS wrapper.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

### 100 Three-product featured sequence

**Loop:** 12s · **Type:** CSS substitute · **Three.js pair:** [100 — Three-product spotlight sequence](100-threejs-loop-prompts.md#100-three-product-spotlight-sequence)

```text
Create a responsive no-build HTML/CSS loop titled "Three-product featured sequence" with a complete repeat period of 12 seconds. Apply the shared CSS brief. This is a CSS substitute for Three.js prompt 100.

Arrange three static product cutouts in fixed slots. Over a 12-second master loop, lift the first, then second, then third and fade a background accent behind the active slot. Use transform and opacity keyframes with 4-second offsets. Keep all product links and labels continuously usable.

Move this work into CSS: Replace the full three-model presentation sequence with CSS product images, lifts and accents.

Deliver the working markup, styles and any required static artwork. Include reduced-motion and pause behavior.
```

