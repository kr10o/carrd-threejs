from pathlib import Path
import json, struct, hashlib

out = Path(__file__).resolve().parent
root = out.parent
source = (root / 'script.js').read_text(encoding='utf-8')
s = source
def replace(a,b):
    global s
    assert a in s, a
    s = s.replace(a,b)

replace("shirtRoughness: num('--ts-shirt-roughness', 0.84),", """shirtRoughness: num('--ts-shirt-roughness', 0.84),
      microStrength: Math.max(0, num('--ts-micro-strength', 0.012)),
      microWale: Math.max(1, num('--ts-micro-wale', 650)),
      microCourse: Math.max(1, num('--ts-micro-course', 850)),
      microRoughness: Math.max(0, num('--ts-micro-roughness', 0.015)),""")
replace('uKnitRepeat: { value: cssTokens.knitRepeat }', '''uKnitRepeat: { value: cssTokens.knitRepeat },
        uMicroStrength: { value: cssTokens.microStrength },
        uMicroWale: { value: cssTokens.microWale },
        uMicroCourse: { value: cssTokens.microCourse },
        uMicroRoughness: { value: cssTokens.microRoughness }''')
replace('uniform float uKnitCavity;', '''uniform float uKnitCavity;
          uniform float uMicroStrength;
          uniform float uMicroWale;
          uniform float uMicroCourse;
          uniform float uMicroRoughness;''')
replace('vRestPos.x * 165.0', 'vRestPos.x * uMicroWale')
replace('vRestPos.x * 26.26', 'vRestPos.x * (uMicroWale / 6.28318530718)')
replace('vRestPos.y * 220.0', 'vRestPos.y * uMicroCourse')
replace('float knitCrown = sin(waleFreq) * sin(courseFreq);', '''// Fade unresolved stitch waves to avoid shimmer at distance.
          float microFootprint = max(fwidth(waleFreq), fwidth(courseFreq));
          float microFade = 1.0 - smoothstep(1.0, 3.14159, microFootprint);
          float knitCrown = sin(waleFreq) * sin(courseFreq) * microFade;''')
replace('knitCrown * 0.12, 0.35, 0.98', 'knitCrown * uMicroRoughness, 0.04, 1.0')
replace('cos(waleFreq) * 0.24', 'cos(waleFreq) * uMicroStrength * microFade')
replace('cos(courseFreq) * 0.26', 'cos(courseFreq) * uMicroStrength * microFade')
replace('torsoMaterial.onBeforeCompile = (shader) => {', '''torsoMaterial.extensions = { derivatives: true };
      torsoMaterial.onBeforeCompile = (shader) => {''')
replace('cssTokens = readCssTokens(rootEl);\n        const curDpr', '''const nextTokens = readCssTokens(rootEl);
        const nextSignature = JSON.stringify(nextTokens);
        if (nextSignature === cssSignature) return;
        cssSignature = nextSignature;
        cssTokens = nextTokens;
        const curDpr''')
replace('function syncFromCssVariables() {', '''let cssSignature = '';
      function syncFromCssVariables() {''')
replace('shirtUniforms.uKnitRepeat.value = cssTokens.knitRepeat;', '''shirtUniforms.uKnitRepeat.value = cssTokens.knitRepeat;
        shirtUniforms.uMicroStrength.value = cssTokens.microStrength;
        shirtUniforms.uMicroWale.value = cssTokens.microWale;
        shirtUniforms.uMicroCourse.value = cssTokens.microCourse;
        shirtUniforms.uMicroRoughness.value = cssTokens.microRoughness;''')
replace("rootEl.style.setProperty('--ts-cursor-", "frameEl.style.setProperty('--ts-cursor-")
replace("rootEl.style.setProperty('--ts-turn-", "frameEl.style.setProperty('--ts-turn-")
replace("if (!rootEl || !stageEl) return;", "if (!rootEl || !stageEl) return;\n    const frameEl = rootEl.querySelector('.tshirt-squircle-frame') || stageEl;")
a = s.index('      const styleObserver = new MutationObserver')
b = s.index('\n      window.rotateTShirt',a)
s = s[:a] + '''      let cssSyncPending = false;
      const styleObserver = new MutationObserver(() => {
        if (cssSyncPending) return;
        cssSyncPending = true;
        requestAnimationFrame(() => {
          cssSyncPending = false;
          syncFromCssVariables();
        });
      });
      styleObserver.observe(rootEl, { attributes: true,
        attributeFilter: ['style', 'class', 'data-fabric'] });
''' + s[b:]
replace("sunIntensity:   num('--ts-sun-intensity', 1.38),", "sunIntensity:   num('--ts-sun-intensity', 1.38),\n      beamOpacity: Math.min(1, Math.max(0, num('--ts-beam-opacity', 0.18))),")
replace('scene.add(morningSunSpot.target);', '''scene.add(morningSunSpot.target);
      // r128 has no LightShadow.intensity. Split the sun into shadowed and
      // unshadowed contributions, retaining the same total direct illumination.
      const softSunFill = morningSunSpot.clone();
      softSunFill.castShadow = false;
      softSunFill.target = morningSunSpot.target;
      softSunFill.intensity = cssTokens.sunIntensity * (1 - cssTokens.beamOpacity);
      morningSunSpot.intensity = cssTokens.sunIntensity * cssTokens.beamOpacity;
      scene.add(softSunFill);''')
replace('morningSunSpot.intensity = cssTokens.sunIntensity;', '''morningSunSpot.intensity = cssTokens.sunIntensity * cssTokens.beamOpacity;
        softSunFill.color.set(cssTokens.sunColor);
        softSunFill.intensity = cssTokens.sunIntensity * (1 - cssTokens.beamOpacity);''')
replace('morningSunSpot.position.y = 3.8 + Math.cos(t * 0.09) * 0.35;', '''morningSunSpot.position.y = 3.8 + Math.cos(t * 0.09) * 0.35;
        softSunFill.position.copy(morningSunSpot.position);''')
replace('skyRimSpot.position.set(5.4, 2.8, 4.4);', 'skyRimSpot.position.set(3.4, 3.0, -2.2);')
replace('skyRimSpot.target.position.set(-0.3, -0.1, -1.4);', 'skyRimSpot.target.position.set(0.0, 0.1, 0.0);')
replace("  'use strict';", "  'use strict';\n  const fabricAssetBase = new URL('./assets/fabric030/', document.currentScript.src).href;")
start = s.index('      const { normalMap: cottonNormalMap, roughnessMap: cottonRoughnessMap } = createCottonJerseyTextures(')
end = s.index('      const { normalMap: plasterNormalMap', start)
s = s[:start] + '''      // Load the complete surface set before creating any garment materials.
      // Albedo is sRGB; normal/roughness remain linear data. OpenGL normals.
      const fabricLoader = new THREE.TextureLoader();
      const loadFabricMap = (suffix) => new Promise((resolve, reject) => {
        fabricLoader.load(fabricAssetBase + 'Fabric030_1K-JPG_' + suffix + '.jpg', resolve, undefined, reject);
      });
      const [fabricColorMap, cottonNormalMap, cottonRoughnessMap] = await Promise.all([
        loadFabricMap('Color'), loadFabricMap('NormalGL'), loadFabricMap('Roughness')
      ]);
      const fabricMaps = [fabricColorMap, cottonNormalMap, cottonRoughnessMap];
      fabricMaps.forEach((tex) => {
        tex.flipY = false;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(cssTokens.knitRepeat, cssTokens.knitRepeat);
        tex.anisotropy = maxAniso;
      });
      fabricColorMap.encoding = THREE.sRGBEncoding;
      rootEl.setAttribute('data-fabric-source', 'ambientCG-Fabric030');
''' + s[end:]
replace('normalMap: cottonNormalMap,', 'map: fabricColorMap,\n        normalMap: cottonNormalMap,')
replace('metalness: 0.03,', 'metalness: 0.0,')
replace('child.material.aoMap || child.material.map || null', 'child.material.aoMap || null')
replace("        upgradeSwTex('/__sw-tex/cotton-normal-v3.png', cottonNormalMap);", '')
replace("        upgradeSwTex('/__sw-tex/cotton-rough-v3.png', cottonRoughnessMap);", '')
replace('const repY = Math.round(repX * 1.18);\n        cottonNormalMap.repeat.set(repX, repY);\n        cottonRoughnessMap.repeat.set(repX, repY);', 'fabricMaps.forEach((tex) => tex.repeat.set(repX, repX));')
# Frame-rate-independent flip with a strong middle and a soft, stable landing.
start = s.index('      function triggerTShirtFlip() {')
end = s.index('      let pointerDownX', start)
s = s[:start] + '''      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let turnAccent = 0;
      let lastFrameTime = performance.now();
      function triggerTShirtFlip() {
        // Permit a follow-up flip, but don't build an unbounded spin queue.
        if (targetTurnAngle - currentTurnAngle > Math.PI * 1.1) return;
        turnStepIndex += 1;
        targetTurnAngle = turnStepIndex * Math.PI;
        if (reducedMotion.matches) {
          currentTurnAngle = targetTurnAngle;
          turnVelocity = 0;
          turnAccent = 0;
        }
        rootEl.setAttribute('data-view-side', turnStepIndex % 2 === 0 ? 'front' : 'back');
      }

''' + s[end:]
replace("if (e.code === 'Space' || e.code === 'Enter') {", "if (!e.repeat && (e.code === 'Space' || e.code === 'Enter')) {")
replace('''        if (!isVisible) return;

        const t''', '''        const now = performance.now();
        const delta = Math.min((now - lastFrameTime) / 1000, 0.05);
        lastFrameTime = now;
        if (!isVisible) return;

        const t''')
replace('''        const angleDiff = targetTurnAngle - currentTurnAngle;
        turnVelocity = turnVelocity * 0.82 + angleDiff * 0.018;
        currentTurnAngle += turnVelocity;''', '''        // Exact critically damped spring: velocity is radians/second.
        // Continuous position/velocity when a second click changes the target.
        const omega = 9.5;
        const offset = currentTurnAngle - targetTurnAngle;
        const springTerm = turnVelocity + omega * offset;
        const decay = Math.exp(-omega * delta);
        currentTurnAngle = targetTurnAngle + (offset + springTerm * delta) * decay;
        turnVelocity = (turnVelocity - omega * springTerm * delta) * decay;
        if (Math.abs(targetTurnAngle - currentTurnAngle) < 0.0005 && Math.abs(turnVelocity) < 0.004) {
          currentTurnAngle = targetTurnAngle;
          turnVelocity = 0;
        }
        const accentTarget = reducedMotion.matches ? 0 : Math.min(Math.abs(turnVelocity) / 10, 1);
        turnAccent += (accentTarget - turnAccent) * (1 - Math.exp(-14 * delta));''')
replace('const isCurrentlyTurning = absVel > 0.002;', 'const isCurrentlyTurning = absVel > 0.004 || Math.abs(targetTurnAngle - currentTurnAngle) > 0.0005;')
replace('Math.min(absVel * 8.0, 1.0)', 'Math.min(absVel / 10, 1.0)')
replace('const idleSwayY = Math.sin(t * 0.35) * 0.08 + Math.cos(t * 0.19) * 0.04;', 'const idleSwayY = reducedMotion.matches ? 0 : (Math.sin(t * 0.35) * 0.04 + Math.cos(t * 0.19) * 0.02);')
replace('const turnTiltZ = -turnVelocity * 0.18;', 'const turnTiltZ = -turnAccent * 0.065;')
replace('tshirtPivotGroup.rotation.z = Math.sin(t * 0.21) * 0.01 + turnTiltZ;', 'tshirtPivotGroup.rotation.z = (reducedMotion.matches ? 0 : Math.sin(t * 0.21) * 0.006) + turnTiltZ;')
replace('tshirtPivotGroup.position.y = -0.05 + Math.sin(t * 0.42) * 0.03;', '''tshirtPivotGroup.position.y = -0.05 + (reducedMotion.matches ? 0 : Math.sin(t * 0.42) * 0.018) + turnAccent * 0.065;
        tshirtPivotGroup.scale.setScalar(1 + turnAccent * 0.025);''')
(out / 'script.js').write_text(s,encoding='utf-8')
css = (root / 'style.css').read_text(encoding='utf-8').replace('--ts-ao-intensity: 0,5;', '--ts-ao-intensity: 0.5;').replace('--ts-wall-roughness: 3.5;', '--ts-wall-roughness: 0.95;')
css = css.replace('--ts-sun-intensity: 0.9;', '--ts-sun-intensity: 1.2;').replace('--ts-rim-intensity: 0.62;', '--ts-rim-intensity: 2.4;').replace('--ts-hemi-intensity: 0.32;', '--ts-hemi-intensity: 0.45;').replace('--ts-fill-intensity: 0.10;', '--ts-fill-intensity: 0.30;')
# Starting values for cotton/jersey appearance studies, not measured material scans.
presets = [
 ('combed-cotton',.88,.035,18,.004,.012,650,850,.015),
 ('ringspun-cotton',.9,.045,20,.006,.016,620,820,.018),
 ('organic-cotton',.94,.055,17,.008,.020,580,780,.022),
 ('heavyweight-jersey',.92,.070,14,.010,.028,480,650,.025),
 ('compact-jersey',.85,.025,23,.003,.009,800,1000,.012),
 ('mercerized-cotton',.65,.020,25,.003,.007,850,1100,.010),
 ('washed-cotton',.97,.060,16,.009,.018,600,760,.020),
 ('fine-interlock',.89,.030,22,.004,.010,780,980,.012),
 ('soft-cotton-blend',.79,.025,24,.003,.009,820,1050,.011),
 ('dry-jersey',.98,.065,15,.011,.025,520,720,.026),
]
keys=['shirt-roughness','shirt-bump','knit-repeat','knit-cavity','micro-strength','micro-wale','micro-course','micro-roughness']
css += '\n/* Beam shadow strength: 0 = none, 1 = original. */\n#carrd-app-root.tshirt-hero-bg { --ts-beam-opacity: 0.18; }\n'
css += '\n/* Appearance studies. Select data-fabric; edit these values here. */\n'
for i,(name,*values) in enumerate(presets):
    selector=f'#carrd-app-root.tshirt-hero-bg[data-fabric="{name}"]'
    if i == 0: selector='#carrd-app-root.tshirt-hero-bg,\n'+selector
    css += selector+' {\n'+''.join(f'  --ts-{k}: {v};\n' for k,v in zip(keys,values))+'}\n'
css += '''
/* Downloaded ambientCG Fabric030 surface maps. Overrides procedural detail.
   Repeat is UV tiling, not a physical cm measurement. */
#carrd-app-root.tshirt-hero-bg,
#carrd-app-root.tshirt-hero-bg[data-fabric] {
  --ts-knit-repeat: 5;
  --ts-shirt-bump: 0.45;
  --ts-micro-strength: 0;
  --ts-micro-roughness: 0;
  --ts-knit-cavity: 0;
}
'''
(out/'style.css').write_text(css,encoding='utf-8')
data=(root/'tshirt.glb').read_bytes()
glb=json.loads(data[20:20+struct.unpack_from('<I',data,12)[0]])
triangles=sum(glb['accessors'][p['indices']]['count']//3 for m in glb['meshes'] for p in m['primitives'])
evidence={'baseline':'e90ce5a45105ac0042c0b5863e6b8f60c4ff6fce','triangles':triangles,'vertices':glb['accessors'][0]['count'],'glbBytes':len(data),'originalSha256':{n:hashlib.sha256((root/n).read_bytes()).hexdigest() for n in ['script.js','style.css','tshirt.glb']},'presetCount':len(presets)}
(out/'evidence.json').write_text(json.dumps(evidence,indent=2),encoding='utf-8')
options=''.join(f'<option>{p[0]}</option>' for p in presets)
(out/'preview.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fabric study</title><link rel="stylesheet" href="style.css"><style>html,body{height:100%;overflow:hidden}body{display:flex;flex-direction:column;margin:0;background:#dedbd5;font:16px system-ui}header{padding:12px;display:flex;gap:20px;align-items:center}main{flex:1;min-height:0;height:auto!important}header{flex-shrink:0;flex-wrap:wrap}#carrd-app-root.tshirt-hero-bg{height:100%;aspect-ratio:auto;max-height:none}</style><header><strong>Fabric study</strong><label>Fabric <select id="fabric">'''+options+'''</select></label><a href="technical-breakdown.html">Technical breakdown</a><span>Click shirt to flip</span></header><main><div id="carrd-app-root" class="tshirt-hero-bg" data-fabric="combed-cotton" data-glb-url="../tshirt.glb"><div class="tshirt-squircle-frame"><div id="tshirt-canvas-stage" class="tshirt-canvas-stage" tabindex="0" role="button" aria-label="Flip shirt"></div></div></div></main><script>document.getElementById('fabric').onchange=e=>document.getElementById('carrd-app-root').dataset.fabric=e.target.value;</script><script src="script.js"></script></html>''',encoding='utf-8')
print(json.dumps(evidence,indent=2))
