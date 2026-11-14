/* ==========================================================================
 * kr10o/carrd-threejs - script.js
 * Served via: https://cdn.jsdelivr.net/gh/kr10o/carrd-threejs@main/script.js
 * Features:
 *   1. Carrd Parent-Column Auto-Linker (stretches Carrd .embed wrapper & column
 *      cell, and fits camera to both horizontal & vertical container bounds)
 *   2. High-Relief Heavyweight Cotton Jersey Normal/Roughness Generator +
 *      Shader-Level 3D Micro-Knit Relief & Stitch-Pore Cavity Occlusion
 *   3. Two-Way CSSOM Bridge (--ts-*), Baked AO (aoMap + uv2), & onClick 180° Flip
 *   4. 12-Tap Bilinear Golden-Angle Bokeh DoF + ACES Filmic Tone Mapping
 * ========================================================================== */
(function () {
  'use strict';

  const CDN_LIBS = {
    THREE: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    DRACO_LOADER: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js',
    GLTF_LOADER: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
    DRACO_WASM_DIR: 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
  };

  function loadCdnScript(url) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${url}"]`);
      if (existing) {
        if (existing.getAttribute('data-loaded') === '1') return resolve();
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', reject);
        return;
      }
      const s = document.createElement('script');
      s.src = url;
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.onload = () => {
        s.setAttribute('data-loaded', '1');
        resolve();
      };
      s.onerror = () => reject(new Error(`Failed to load CDN script: ${url}`));
      document.head.appendChild(s);
    });
  }

  async function loadThreeAndLoaders() {
    if (!window.THREE || !window.THREE.WebGLRenderer) {
      await loadCdnScript(CDN_LIBS.THREE);
    }
    await Promise.all([
      window.THREE.DRACOLoader ? Promise.resolve() : loadCdnScript(CDN_LIBS.DRACO_LOADER),
      window.THREE.GLTFLoader ? Promise.resolve() : loadCdnScript(CDN_LIBS.GLTF_LOADER)
    ]);
    return window.THREE;
  }

  /* ==========================================================================
   * 1. CARRD PARENT-COLUMN DOM LINKER
   *    Ensures Carrd's <div id="embedXX"> wrapper and parent column cell
   *    allow 100% width & height stretching without collapsing
   * ========================================================================== */
  function syncParentColumnLayout(rootEl) {
    if (rootEl.getAttribute('data-layout') === 'fullscreen') return null;

    const embedWrapper = rootEl.parentElement;
    if (!embedWrapper || embedWrapper === document.body) return null;

    /* Style Carrd's immediate .embed wrapper to fill its column cell */
    embedWrapper.style.width = '100%';
    embedWrapper.style.height = '100%';
    embedWrapper.style.display = 'flex';
    embedWrapper.style.flexDirection = 'column';
    embedWrapper.style.flex = '1 1 auto';

    /* If inside a Carrd multi-column cell (div.inner > div), allow flex stretch */
    const columnCell = embedWrapper.parentElement;
    if (columnCell && columnCell !== document.body && !columnCell.classList.contains('inner')) {
      const colStyle = window.getComputedStyle(columnCell);
      if (colStyle.display === 'block') {
        columnCell.style.display = 'flex';
        columnCell.style.flexDirection = 'column';
      }
    }

    return columnCell || embedWrapper;
  }

  /* ==========================================================================
   * 2. CSS DOM API BRIDGE (Reads Normalized --ts-* CSS Tokens)
   * ========================================================================== */
  function readCssTokens(rootEl) {
    const cs = window.getComputedStyle(rootEl);
    const num = (prop, fallback) => {
      const v = parseFloat(cs.getPropertyValue(prop));
      return isNaN(v) ? fallback : v;
    };
    const str = (prop, fallback) => {
      const v = cs.getPropertyValue(prop).trim();
      return v || fallback;
    };

    return {
      bgStage:        str('--ts-bg-stage', '#dfdcd4'),
      shirtColor:     str('--ts-shirt-color', '#1f2229'),
      shirtRoughness: num('--ts-shirt-roughness', 0.84),
      shirtBump:      num('--ts-shirt-bump', 1.65),
      collarBump:     num('--ts-collar-bump', 2.25),
      knitRepeat:     num('--ts-knit-repeat', 36.0),
      knitCavity:     num('--ts-knit-cavity', 0.34),
      wallColor:      str('--ts-wall-color', '#e4e1d8'),
      wallRoughness:  num('--ts-wall-roughness', 0.95),
      wallBump:       num('--ts-wall-bump', 1.95),
      sunColor:       str('--ts-sun-color', '#ffe8c2'),
      sunIntensity:   num('--ts-sun-intensity', 1.38),
      rimColor:       str('--ts-rim-color', '#dcebff'),
      rimIntensity:   num('--ts-rim-intensity', 0.82),
      hemiIntensity:  num('--ts-hemi-intensity', 0.52),
      fillIntensity:  num('--ts-fill-intensity', 0.40),
      exposure:       num('--ts-exposure', 1.02),
      dofBlur:        num('--ts-dof-blur', 14.0),
      focalRange:     num('--ts-focal-range', 0.65),
      aoIntensity:    num('--ts-ao-intensity', 1.25),
      printRoughness: num('--ts-print-roughness', 0.40),
      printEmboss:    num('--ts-print-emboss', 1.10),
      knitBleed:      num('--ts-knit-bleed', 0.72)
    };
  }

  /* ==========================================================================
   * 3. HIGH-RELIEF HEAVYWEIGHT COTTON JERSEY & PLASTER TEXTURE GENERATORS
   *    Synthesizes deep interlocking V-stitch wales, twisted yarn micro-ridges,
   *    and high-contrast stitch-pore roughness
   * ========================================================================== */
  function createCottonJerseyTextures(THREE, maxAnisotropy, repeatCount) {
    const size = 128;
    const normCanvas = document.createElement('canvas');
    normCanvas.width = size;
    normCanvas.height = size;
    const nCtx = normCanvas.getContext('2d');
    const nImg = nCtx.createImageData(size, size);
    const nData = nImg.data;

    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = size;
    roughCanvas.height = size;
    const rCtx = roughCanvas.getContext('2d');
    const rImg = rCtx.createImageData(size, size);
    const rData = rImg.data;

    const twoPi = Math.PI * 2;
    const freqX = 24;
    const freqY = 36;

    for (let y = 0; y < size; y++) {
      const v = y / size;
      for (let x = 0; x < size; x++) {
        const u = x / size;
        const idx = (y * size + x) * 4;

        /* Deep stockinette V-stitch loop + diagonal spun-yarn twist */
        const walePhase = u * freqX * twoPi;
        const vChev = Math.abs(((u * freqX) % 1) - 0.5) * 1.85;
        const coursePhase = (v * freqY + vChev) * twoPi;
        const yarnTwist = (u * freqX * 2.0 + v * freqY * 2.0) * twoPi;

        /* Boosted normal slopes (2.6x stronger than previous build) */
        const nx = Math.cos(walePhase) * 1.18 + Math.sin(coursePhase) * 0.48 + Math.cos(yarnTwist) * 0.28;
        const ny = Math.cos(coursePhase) * 1.22 + Math.sin(yarnTwist) * 0.26;
        const nz = 1.0;
        const invLen = 1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz);

        const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const grain = (hash - Math.floor(hash) - 0.5) * 16;

        nData[idx]     = Math.min(255, Math.max(0, Math.round((nx * invLen * 0.5 + 0.5) * 255 + grain)));
        nData[idx + 1] = Math.min(255, Math.max(0, Math.round((ny * invLen * 0.5 + 0.5) * 255 + grain)));
        nData[idx + 2] = Math.round((nz * invLen * 0.5 + 0.5) * 255);
        nData[idx + 3] = 255;

        /* High-contrast stitch crown vs pore roughness [145..252] */
        const stitchCrown = Math.sin(walePhase) * Math.sin(coursePhase);
        const rVal = Math.min(252, Math.max(142, Math.round(208 - stitchCrown * 48 + grain)));
        rData[idx] = rData[idx + 1] = rData[idx + 2] = rVal;
        rData[idx + 3] = 255;
      }
    }

    nCtx.putImageData(nImg, 0, 0);
    rCtx.putImageData(rImg, 0, 0);

    const repX = repeatCount || 36;
    const repY = Math.round(repX * 1.18);

    const normalMap = new THREE.CanvasTexture(normCanvas);
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(repX, repY);
    normalMap.anisotropy = maxAnisotropy;

    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(repX, repY);
    roughnessMap.anisotropy = maxAnisotropy;

    return { normalMap, roughnessMap };
  }

  function createRoughPlasterTextures(THREE, maxAnisotropy) {
    const size = 128;
    const heightField = new Float32Array(size * size);
    const twoPi = Math.PI * 2;

    for (let y = 0; y < size; y++) {
      const ny = y / size;
      for (let x = 0; x < size; x++) {
        const nx = x / size;
        const trowel =
          Math.sin(nx * twoPi * 3.0 + Math.cos(ny * twoPi * 2.0) * 1.4) * 0.35 +
          Math.cos(ny * twoPi * 5.0 - Math.sin(nx * twoPi * 4.0) * 1.2) * 0.25;
        const h1 = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
        const grit = (h1 - Math.floor(h1)) - 0.5;
        heightField[y * size + x] = trowel + grit * 0.65;
      }
    }

    const normCanvas = document.createElement('canvas');
    normCanvas.width = size;
    normCanvas.height = size;
    const nCtx = normCanvas.getContext('2d');
    const nImg = nCtx.createImageData(size, size);
    const nData = nImg.data;

    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = size;
    roughCanvas.height = size;
    const rCtx = roughCanvas.getContext('2d');
    const rImg = rCtx.createImageData(size, size);
    const rData = rImg.data;

    const bumpStrength = 2.4;
    for (let y = 0; y < size; y++) {
      const yU = (y - 1 + size) % size;
      const yD = (y + 1) % size;
      for (let x = 0; x < size; x++) {
        const xL = (x - 1 + size) % size;
        const xR = (x + 1) % size;
        const idx = (y * size + x) * 4;

        const dX = (heightField[y * size + xL] - heightField[y * size + xR]) * bumpStrength;
        const dY = (heightField[yU * size + x] - heightField[yD * size + x]) * bumpStrength;
        const inv = 1.0 / Math.sqrt(dX * dX + dY * dY + 1.0);

        nData[idx]     = Math.round((dX * inv * 0.5 + 0.5) * 255);
        nData[idx + 1] = Math.round((dY * inv * 0.5 + 0.5) * 255);
        nData[idx + 2] = Math.round((inv * 0.5 + 0.5) * 255);
        nData[idx + 3] = 255;

        const rVal = Math.min(255, Math.max(210, Math.round(242 - heightField[y * size + x] * 16)));
        rData[idx] = rData[idx + 1] = rData[idx + 2] = rVal;
        rData[idx + 3] = 255;
      }
    }

    nCtx.putImageData(nImg, 0, 0);
    rCtx.putImageData(rImg, 0, 0);

    const normalMap = new THREE.CanvasTexture(normCanvas);
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(9, 7);
    normalMap.anisotropy = maxAnisotropy;

    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(9, 7);
    roughnessMap.anisotropy = maxAnisotropy;

    return { normalMap, roughnessMap };
  }

  function createEmptyFallbackTexture(THREE) {
    const data = new Uint8Array([0, 0, 0, 0]);
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }

  /* ==========================================================================
   * 4. FAST IMPORTED .GLB NORMALIZER
   * ========================================================================== */
  function prepareImportedGlbScene(THREE, gltfScene, torsoMaterial, aoIntensity, trackedFabricMaterials, isPreNormalized) {
    const wrapper = new THREE.Group();
    gltfScene.updateMatrixWorld(true);

    const rootInverse = new THREE.Matrix4().copy(gltfScene.matrixWorld).invert();
    const fabricGeometries = [];
    const fabricMeshes = [];

    gltfScene.traverse((child) => {
      if (!child.isMesh || !child.geometry) return;

      const nameLower = ((child.name || '') + ' ' + (child.material && child.material.name ? child.material.name : '')).toLowerCase();
      if (/hanger|hook|rod|metal|chrome|wire|clip|stand/.test(nameLower)) {
        return;
      }

      const geom = child.geometry;
      const relMatrix = new THREE.Matrix4().multiplyMatrices(rootInverse, child.matrixWorld);
      if (!relMatrix.equals(new THREE.Matrix4())) {
        geom.applyMatrix4(relMatrix);
      }

      let bakedAoTexture = null;
      if (child.material) {
        bakedAoTexture = child.material.aoMap || child.material.map || null;
      }

      let targetMat = torsoMaterial;
      if (bakedAoTexture) {
        bakedAoTexture.flipY = false;
        targetMat = torsoMaterial.clone();
        targetMat.aoMap = bakedAoTexture;
        targetMat.aoMapIntensity = aoIntensity;
        targetMat.onBeforeCompile = torsoMaterial.onBeforeCompile;
        trackedFabricMaterials.push(targetMat);
      }

      const fabMesh = new THREE.Mesh(geom, targetMat);
      fabMesh.castShadow = true;
      fabMesh.receiveShadow = true;
      fabricGeometries.push(geom);
      fabricMeshes.push(fabMesh);
    });

    if (fabricGeometries.length === 0) {
      throw new Error('No garment mesh found in .glb');
    }

    if (!isPreNormalized) {
      const combinedBox = new THREE.Box3();
      fabricGeometries.forEach((g) => {
        g.computeBoundingBox();
        combinedBox.union(g.boundingBox);
      });

      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      combinedBox.getCenter(center);
      combinedBox.getSize(size);

      const maxSpan = Math.max(size.y, size.x * 0.85, 0.001);
      if (Math.abs(maxSpan - 3.10) > 0.08 || center.length() > 0.25) {
        const normScale = 3.10 / maxSpan;
        const offsetX = -center.x * normScale;
        const offsetY = -0.10 - center.y * normScale;
        const offsetZ = -center.z * normScale;

        fabricGeometries.forEach((g) => {
          g.scale(normScale, normScale, normScale);
          g.translate(offsetX, offsetY, offsetZ);
        });
      }
    }

    fabricMeshes.forEach((mesh) => {
      const g = mesh.geometry;
      if (!g.attributes.normal) {
        g.computeVertexNormals();
      }
      if (!g.attributes.uv) {
        const pos = g.attributes.position;
        const uvs = new Float32Array(pos.count * 2);
        for (let i = 0; i < pos.count; i++) {
          const px = pos.getX(i);
          const py = pos.getY(i);
          const pz = pos.getZ(i);
          const u = (Math.atan2(px, pz) / (Math.PI * 2)) + 0.5;
          const v = (py + 1.68) / 3.10;
          uvs[i * 2] = u * 2.0;
          uvs[i * 2 + 1] = v;
        }
        g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      }
      if (!g.attributes.uv2 && g.attributes.uv) {
        g.setAttribute('uv2', g.attributes.uv);
      }
      wrapper.add(mesh);
    });

    return wrapper;
  }

  /* ==========================================================================
   * 5. LIGHTWEIGHT PROCEDURAL FALLBACK T-SHIRT
   * ========================================================================== */
  function buildProceduralFallbackTShirt(THREE, torsoMaterial, sleeveMaterial) {
    const group = new THREE.Group();

    function evaluateTorsoPoint(u, v, isFront) {
      const absU = Math.abs(u);
      const halfWidth = 1.24 + 0.14 * Math.pow(v, 1.35) - 0.04 * Math.sin(v * Math.PI);
      const neckRadiusU = 0.40;
      let shoulderDrop = 0.0;
      if (absU > neckRadiusU) {
        const tShoulder = (absU - neckRadiusU) / (1.0 - neckRadiusU);
        shoulderDrop = -0.34 * Math.pow(tShoulder, 1.15);
      }

      let neckScoop = 0.0;
      if (absU < neckRadiusU) {
        const tNeck = 1.0 - Math.pow(absU / neckRadiusU, 2.0);
        neckScoop = (isFront ? -0.38 : -0.11) * tNeck * Math.pow(v, 3.5);
      }

      const x = u * halfWidth;
      const baseHeight = -1.68 + v * 3.10;
      const y = baseHeight + shoulderDrop * Math.pow(v, 2.2) + neckScoop;

      const edgeArch = Math.sqrt(Math.max(0.0, 1.0 - u * u * 0.92));
      const chestContour = isFront
        ? (0.34 + 0.09 * Math.sin(v * Math.PI * 0.85))
        : (0.30 + 0.07 * Math.sin(v * Math.PI * 0.88));

      const foldPrimary = Math.sin((u * 5.8) + (isFront ? 0.25 : -0.35)) * 0.028 * (1.0 - v * 0.35);
      const catenary = isFront
        ? -0.026 * Math.exp(-Math.pow(u * 2.2, 2.0)) * Math.sin(v * Math.PI)
        : 0.024 * Math.exp(-Math.pow(u * 2.0, 2.0)) * Math.sin(v * Math.PI);

      const dir = isFront ? 1.0 : -1.0;
      const z = dir * (edgeArch * chestContour) + foldPrimary + catenary;

      return new THREE.Vector3(x, y, z);
    }

    const segTheta = 72;
    const segV = 48;
    const torsoPositions = [];
    const torsoUvs = [];
    const torsoIndices = [];

    for (let j = 0; j <= segV; j++) {
      const v = j / segV;
      for (let i = 0; i <= segTheta; i++) {
        const theta = (i / segTheta) * Math.PI * 2;
        const u = Math.cos(theta);
        const sinT = Math.sin(theta);

        const ptFront = evaluateTorsoPoint(u, v, true);
        const ptBack = evaluateTorsoPoint(u, v, false);

        const blend = sinT * 0.5 + 0.5;
        const smoothBlend = blend * blend * (3.0 - 2.0 * blend);

        const x = ptBack.x + (ptFront.x - ptBack.x) * smoothBlend;
        const y = ptBack.y + (ptFront.y - ptBack.y) * smoothBlend;
        const z = ptBack.z + (ptFront.z - ptBack.z) * smoothBlend;

        torsoPositions.push(x, y, z);
        torsoUvs.push((i / segTheta) * 2.0, v);
      }
    }

    for (let j = 0; j < segV; j++) {
      for (let i = 0; i < segTheta; i++) {
        const a = j * (segTheta + 1) + i;
        const b = a + 1;
        const c = (j + 1) * (segTheta + 1) + i;
        const d = c + 1;
        torsoIndices.push(a, b, d, a, d, c);
      }
    }

    const torsoGeo = new THREE.BufferGeometry();
    torsoGeo.setIndex(torsoIndices);
    torsoGeo.setAttribute('position', new THREE.Float32BufferAttribute(torsoPositions, 3));
    torsoGeo.setAttribute('uv', new THREE.Float32BufferAttribute(torsoUvs, 2));
    torsoGeo.setAttribute('uv2', new THREE.Float32BufferAttribute(torsoUvs, 2));
    torsoGeo.computeVertexNormals();

    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMaterial);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    group.add(torsoMesh);

    function buildSleeveGeometry(sideSign) {
      const sU = 28;
      const sV = 20;
      const positions = [];
      const uvs = [];
      const indices = [];

      const rootX = sideSign * 1.26;
      const rootY = 0.84;
      const sleeveLen = 1.08;
      const angle = sideSign * (-0.64);
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      for (let j = 0; j <= sV; j++) {
        const t = j / sV;
        const dist = t * sleeveLen;
        const radiusY = 0.44 * (1.0 - t * 0.16);
        const radiusZ = 0.30 * (1.0 - t * 0.12);

        const spineX = rootX + sideSign * dist * Math.cos(0.64);
        const spineY = rootY - dist * Math.sin(0.64) - 0.04 * Math.sin(t * Math.PI);

        for (let i = 0; i <= sU; i++) {
          const phi = (i / sU) * Math.PI * 2;
          const localY = Math.cos(phi) * radiusY;
          const localZ = Math.sin(phi) * radiusZ;

          const wx = spineX - localY * sinA;
          const wy = spineY + localY * cosA;
          const wz = localZ;

          positions.push(wx, wy, wz);
          uvs.push(i / sU, t * 0.6);
        }
      }

      for (let j = 0; j < sV; j++) {
        for (let i = 0; i < sU; i++) {
          const a = j * (sU + 1) + i;
          const b = a + 1;
          const c = (j + 1) * (sU + 1) + i;
          const d = c + 1;
          indices.push(a, b, d, a, d, c);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setIndex(indices);
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setAttribute('uv2', new THREE.Float32BufferAttribute(uvs, 2));
      geo.computeVertexNormals();
      return geo;
    }

    const leftSleeve = new THREE.Mesh(buildSleeveGeometry(-1), sleeveMaterial);
    leftSleeve.castShadow = true;
    leftSleeve.receiveShadow = true;
    group.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(buildSleeveGeometry(1), sleeveMaterial);
    rightSleeve.castShadow = true;
    rightSleeve.receiveShadow = true;
    group.add(rightSleeve);

    return group;
  }

  /* ==========================================================================
   * 6. PASS 2: 12-TAP BILINEAR GOLDEN-ANGLE BOKEH DOF + ACES FILMIC SHADER
   * ========================================================================== */
  const DOF_VERTEX_SHADER = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const DOF_FRAGMENT_SHADER = `
    uniform sampler2D tColor;
    uniform sampler2D tDepth;
    uniform vec2 uResolution;
    uniform float uCameraNear;
    uniform float uCameraFar;
    uniform float uFocusDistance;
    uniform float uFocalRange;
    uniform float uMaxBlurPx;
    uniform float uExposure;

    varying vec2 vUv;

    float readLinearDepth(vec2 uv) {
      float z_b = texture2D(tDepth, uv).x;
      float z_n = 2.0 * z_b - 1.0;
      return (2.0 * uCameraNear * uCameraFar) / (uCameraFar + uCameraNear - z_n * (uCameraFar - uCameraNear));
    }

    float computeCoC(float linearDepth) {
      float diff = abs(linearDepth - uFocusDistance);
      return clamp((diff - uFocalRange * 0.45) / (uFocalRange * 1.85), 0.0, 1.0);
    }

    vec3 acesFilmicToneMap(vec3 x) {
      const float a = 2.51;
      const float b = 0.03;
      const float c = 2.43;
      const float d = 0.59;
      const float e = 0.14;
      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    }

    vec3 finishColor(vec3 linearHdr) {
      vec3 mapped = acesFilmicToneMap(linearHdr * uExposure);
      float vig = 1.0 - smoothstep(0.45, 0.98, length(vUv - 0.5)) * 0.14;
      return mapped * vig;
    }

    void main() {
      vec4 baseColor = texture2D(tColor, vUv);
      if (uMaxBlurPx <= 0.1) {
        gl_FragColor = vec4(finishColor(baseColor.rgb), 1.0);
        return;
      }

      float centerDepth = readLinearDepth(vUv);
      float centerCoC = computeCoC(centerDepth);

      if (centerCoC < 0.02) {
        gl_FragColor = vec4(finishColor(baseColor.rgb), 1.0);
        return;
      }

      vec2 texel = 1.0 / uResolution;
      float blurRadius = centerCoC * uMaxBlurPx;
      float hashAngle = fract(sin(dot(vUv * uResolution, vec2(12.9898, 78.233))) * 43758.5453) * 6.2831853;

      vec3 accumColor = baseColor.rgb;
      float accumWeight = 1.0;

      const int SAMPLES = 12;
      const float GOLDEN_ANGLE = 2.39996323;

      for (int i = 1; i <= SAMPLES; i++) {
        float fi = float(i);
        float r = sqrt(fi / float(SAMPLES)) * blurRadius;
        float theta = fi * GOLDEN_ANGLE + hashAngle;

        vec2 sampleUv = clamp(vUv + vec2(cos(theta), sin(theta)) * r * texel, 0.001, 0.999);
        vec3 sColor = texture2D(tColor, sampleUv).rgb;
        float sDepth = readLinearDepth(sampleUv);
        float sCoC = computeCoC(sDepth);

        float depthGuard = (sDepth < centerDepth - 0.25) ? sCoC : 1.0;
        float weight = max(sCoC, 0.2) * depthGuard;

        accumColor += sColor * weight;
        accumWeight += weight;
      }

      vec3 blurredRgb = accumColor / max(accumWeight, 0.001);
      gl_FragColor = vec4(finishColor(blurredRgb), 1.0);
    }
  `;

  /* ==========================================================================
   * 7. SCENE INITIALIZATION, PARENT COLUMN SYNC & HIGH-RELIEF RENDER LOOP
   * ========================================================================== */
  async function initApp() {
    const rootEl = document.getElementById('carrd-app-root');
    const stageEl = document.getElementById('tshirt-canvas-stage');
    if (!rootEl || !stageEl) return;

    try {
      /* Link to parent Carrd column/embed container immediately */
      const parentColumnEl = syncParentColumnLayout(rootEl);

      const THREE = await loadThreeAndLoaders();
      let cssTokens = readCssTokens(rootEl);

      const rect = stageEl.getBoundingClientRect();
      const initW = Math.max(rect.width, 260);
      const initH = Math.max(rect.height, 320);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(initW, initH);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.NoToneMapping;
      stageEl.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(cssTokens.bgStage);
      scene.fog = new THREE.FogExp2(cssTokens.bgStage, 0.022);

      const camera = new THREE.PerspectiveCamera(34, initW / initH, 0.5, 28);

      const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
      const { normalMap: cottonNormalMap, roughnessMap: cottonRoughnessMap } = createCottonJerseyTextures(
        THREE,
        maxAniso,
        cssTokens.knitRepeat
      );
      const { normalMap: plasterNormalMap, roughnessMap: plasterRoughnessMap } = createRoughPlasterTextures(THREE, maxAniso);
      const emptyLogoTex = createEmptyFallbackTexture(THREE);

      const glbUrlAttr = (rootEl.getAttribute('data-glb-url') || '').trim();
      const isPreNormalized = rootEl.getAttribute('data-glb-prenormalized') === 'true';

      const frontUrlAttr = (
        rootEl.getAttribute('data-logo-front') ||
        rootEl.getAttribute('data-logo-url') ||
        ''
      ).trim();
      const frontScaleAttr = parseFloat(
        rootEl.getAttribute('data-logo-front-scale') ||
        rootEl.getAttribute('data-logo-scale')
      );
      const frontXAttr = parseFloat(rootEl.getAttribute('data-logo-front-x'));
      const frontYAttr = parseFloat(
        rootEl.getAttribute('data-logo-front-y') ||
        rootEl.getAttribute('data-logo-y')
      );

      const initFrontScale = !isNaN(frontScaleAttr) ? frontScaleAttr : 0.34;
      const initFrontX = !isNaN(frontXAttr) ? frontXAttr : 0.42;
      const initFrontY = !isNaN(frontYAttr) ? frontYAttr : 0.46;

      const backUrlAttr = (rootEl.getAttribute('data-logo-back') || '').trim();
      const backScaleAttr = parseFloat(rootEl.getAttribute('data-logo-back-scale'));
      const backXAttr = parseFloat(rootEl.getAttribute('data-logo-back-x'));
      const backYAttr = parseFloat(rootEl.getAttribute('data-logo-back-y'));

      const initBackScale = !isNaN(backScaleAttr) ? backScaleAttr : 1.18;
      const initBackX = !isNaN(backXAttr) ? backXAttr : 0.0;
      const initBackY = !isNaN(backYAttr) ? backYAttr : 0.18;

      const shirtUniforms = {
        uTime: { value: 0.0 },
        uFrontLogoMap: { value: emptyLogoTex },
        uHasFrontLogo: { value: 0.0 },
        uFrontOffset: { value: new THREE.Vector2(initFrontX, initFrontY) },
        uFrontScale: { value: new THREE.Vector2(initFrontScale, initFrontScale) },
        uFrontTexel: { value: new THREE.Vector2(1.0 / 512.0, 1.0 / 512.0) },
        uBackLogoMap: { value: emptyLogoTex },
        uHasBackLogo: { value: 0.0 },
        uBackOffset: { value: new THREE.Vector2(initBackX, initBackY) },
        uBackScale: { value: new THREE.Vector2(initBackScale, initBackScale) },
        uBackTexel: { value: new THREE.Vector2(1.0 / 512.0, 1.0 / 512.0) },
        uPrintRoughness: { value: cssTokens.printRoughness },
        uPrintEmboss: { value: cssTokens.printEmboss },
        uKnitBleedThrough: { value: cssTokens.knitBleed },
        uKnitCavity: { value: cssTokens.knitCavity },
        uKnitRepeat: { value: cssTokens.knitRepeat }
      };

      function attachBaseCottonShader(material) {
        material.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = shirtUniforms.uTime;
          shader.uniforms.uKnitCavity = shirtUniforms.uKnitCavity;
          shader.vertexShader = `
            uniform float uTime;
            varying vec3 vRestPos;
          \n` + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            vRestPos = position;
            float hemWeight = clamp((1.25 - position.y) * 0.38, 0.0, 1.0);
            float breeze = sin(uTime * 0.85 + position.x * 2.1 + position.y * 1.4) * 0.018 * hemWeight;
            transformed.z += breeze;
            transformed.x += cos(uTime * 0.65 + position.y * 1.8) * 0.006 * hemWeight;
            `
          );
          shader.fragmentShader = `
            uniform float uKnitCavity;
            varying vec3 vRestPos;
          \n` + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #include <map_fragment>
            /* 3D Rest-Position Micro-Knit Stitch Pore Cavity Shadow */
            float wale = sin(vRestPos.x * 165.0 + abs(fract(vRestPos.x * 26.0) - 0.5) * 3.14);
            float course = sin(vRestPos.y * 220.0);
            float poreCavity = (wale * course) * 0.5 + 0.5;
            diffuseColor.rgb *= mix(1.0 - uKnitCavity, 1.0 + uKnitCavity * 0.45, poreCavity);
            `
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.8);
            gl_FragColor.rgb += vec3(0.13, 0.13, 0.12) * fresnel;
            #include <dithering_fragment>
            `
          );
        };
      }

      const torsoMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(cssTokens.shirtColor),
        roughness: cssTokens.shirtRoughness,
        metalness: 0.03,
        normalMap: cottonNormalMap,
        normalScale: new THREE.Vector2(cssTokens.shirtBump, cssTokens.shirtBump),
        roughnessMap: cottonRoughnessMap,
        side: THREE.DoubleSide,
        shadowSide: THREE.FrontSide
      });

      const trackedFabricMaterials = [torsoMaterial];

      torsoMaterial.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, shirtUniforms);

        shader.vertexShader = `
          uniform float uTime;
          uniform vec2 uFrontOffset;
          uniform vec2 uFrontScale;
          uniform vec2 uBackOffset;
          uniform vec2 uBackScale;
          varying vec2 vFrontLogoUv;
          varying vec2 vBackLogoUv;
          varying float vFrontMask;
          varying float vBackMask;
          varying vec3 vDecalTangent;
          varying vec3 vDecalBitangent;
          varying vec3 vRestPos;
        \n` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>
          vRestPos = position;

          vFrontLogoUv = vec2(
            (position.x - uFrontOffset.x) / max(uFrontScale.x, 0.001) + 0.5,
            (position.y - uFrontOffset.y) / max(uFrontScale.y, 0.001) + 0.5
          );
          float torsoSpanMask = 1.0 - smoothstep(0.82, 0.98, abs(position.x));
          vFrontMask = smoothstep(-0.02, 0.08, position.z) * smoothstep(0.15, 0.42, objectNormal.z) * torsoSpanMask;

          vBackLogoUv = vec2(
            (-position.x - uBackOffset.x) / max(uBackScale.x, 0.001) + 0.5,
            (position.y - uBackOffset.y) / max(uBackScale.y, 0.001) + 0.5
          );
          vBackMask = smoothstep(-0.02, 0.08, -position.z) * smoothstep(0.15, 0.42, -objectNormal.z) * torsoSpanMask;

          float sideSign = objectNormal.z >= 0.0 ? 1.0 : -1.0;
          vDecalTangent = normalize(normalMatrix * vec3(sideSign, 0.0, 0.0));
          vDecalBitangent = normalize(normalMatrix * vec3(0.0, 1.0, 0.0));

          float hemWeight = clamp((1.35 - position.y) * 0.38, 0.06, 1.0);
          float panelWave = sin(uTime * 0.78 + position.x * 3.8 - position.y * 1.6) * 0.007;
          float breeze = sin(uTime * 0.85 + position.x * 2.1 + position.y * 1.4) * 0.018 * hemWeight + panelWave;
          transformed.z += breeze;
          transformed.x += cos(uTime * 0.65 + position.y * 1.8) * 0.006 * hemWeight;
          `
        );

        shader.fragmentShader = `
          uniform sampler2D uFrontLogoMap;
          uniform float uHasFrontLogo;
          uniform vec2 uFrontTexel;
          uniform sampler2D uBackLogoMap;
          uniform float uHasBackLogo;
          uniform vec2 uBackTexel;
          uniform float uPrintRoughness;
          uniform float uPrintEmboss;
          uniform float uKnitBleedThrough;
          uniform float uKnitCavity;
          varying vec2 vFrontLogoUv;
          varying vec2 vBackLogoUv;
          varying float vFrontMask;
          varying float vBackMask;
          varying vec3 vDecalTangent;
          varying vec3 vDecalBitangent;
          varying vec3 vRestPos;
        \n` + shader.fragmentShader;

        /* 1. High-Contrast 3D Knit Stitch Pore Cavity + Front/Back Decal Composite */
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_fragment>',
          `
          #include <map_fragment>
          /* Evaluate physical stockinette stitch pores from 3D rest coordinates so even
           * stretched .glb UVs exhibit razor-sharp heavyweight cotton weave texture */
          float waleFreq = vRestPos.x * 165.0;
          float chev = abs(fract(vRestPos.x * 26.26) - 0.5) * 3.2;
          float courseFreq = vRestPos.y * 220.0 + chev;
          float knitCrown = sin(waleFreq) * sin(courseFreq);
          float poreCavity = knitCrown * 0.5 + 0.5;

          diffuseColor.rgb *= mix(1.0 - uKnitCavity, 1.0 + uKnitCavity * 0.48, poreCavity);

          float decalPrintAlpha = 0.0;
          bool isFrontDecalActive = false;
          bool isBackDecalActive = false;

          if (uHasFrontLogo > 0.5 && vFrontMask > 0.001) {
            if (vFrontLogoUv.x >= 0.0 && vFrontLogoUv.x <= 1.0 && vFrontLogoUv.y >= 0.0 && vFrontLogoUv.y <= 1.0) {
              isFrontDecalActive = true;
              vec4 frontTexel = texture2D(uFrontLogoMap, vFrontLogoUv);
              decalPrintAlpha = frontTexel.a * vFrontMask;
              diffuseColor.rgb = mix(diffuseColor.rgb, frontTexel.rgb, decalPrintAlpha);
            }
          } else if (uHasBackLogo > 0.5 && vBackMask > 0.001) {
            if (vBackLogoUv.x >= 0.0 && vBackLogoUv.x <= 1.0 && vBackLogoUv.y >= 0.0 && vBackLogoUv.y <= 1.0) {
              isBackDecalActive = true;
              vec4 backTexel = texture2D(uBackLogoMap, vBackLogoUv);
              decalPrintAlpha = backTexel.a * vBackMask;
              diffuseColor.rgb = mix(diffuseColor.rgb, backTexel.rgb, decalPrintAlpha);
            }
          }
          `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <roughnessmap_fragment>',
          `
          #include <roughnessmap_fragment>
          /* Modulate cotton roughness across stitch crowns vs valleys */
          roughnessFactor = clamp(roughnessFactor - knitCrown * 0.12, 0.35, 0.98);
          if (decalPrintAlpha > 0.001) {
            float knitMicroVariance = (roughnessFactor - roughness) * uKnitBleedThrough;
            float inkRoughness = clamp(uPrintRoughness + knitMicroVariance, 0.18, 0.92);
            roughnessFactor = mix(roughnessFactor, inkRoughness, decalPrintAlpha);
          }
          `
        );

        /* 2. Inject 3D Rest-Pose Micro-Knit Normal Perturbation + Ink-Edge Bevel */
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <normal_fragment_maps>',
          `
          vec3 baseGeoNormal = normal;
          #include <normal_fragment_maps>

          /* Reinforce UV normalMap with 3D rest-space stockinette stitch normals */
          float microNx = cos(waleFreq) * 0.24;
          float microNy = cos(courseFreq) * 0.26;
          normal = normalize(normal + vDecalTangent * microNx + vDecalBitangent * microNy);

          if (isFrontDecalActive || isBackDecalActive) {
            vec3 inkKnitNormal = normalize(mix(baseGeoNormal, normal, uKnitBleedThrough));
            normal = normalize(mix(normal, inkKnitNormal, decalPrintAlpha));

            vec4 sL; vec4 sR; vec4 sD; vec4 sU;
            float sideMask = 0.0;

            if (isFrontDecalActive) {
              sL = texture2D(uFrontLogoMap, vFrontLogoUv - vec2(uFrontTexel.x, 0.0));
              sR = texture2D(uFrontLogoMap, vFrontLogoUv + vec2(uFrontTexel.x, 0.0));
              sD = texture2D(uFrontLogoMap, vFrontLogoUv - vec2(0.0, uFrontTexel.y));
              sU = texture2D(uFrontLogoMap, vFrontLogoUv + vec2(0.0, uFrontTexel.y));
              sideMask = vFrontMask;
            } else {
              sL = texture2D(uBackLogoMap, vBackLogoUv - vec2(uBackTexel.x, 0.0));
              sR = texture2D(uBackLogoMap, vBackLogoUv + vec2(uBackTexel.x, 0.0));
              sD = texture2D(uBackLogoMap, vBackLogoUv - vec2(0.0, uBackTexel.y));
              sU = texture2D(uBackLogoMap, vBackLogoUv + vec2(0.0, uBackTexel.y));
              sideMask = vBackMask;
            }

            float hL = sL.a * (0.72 + 0.28 * dot(sL.rgb, vec3(0.299, 0.587, 0.114)));
            float hR = sR.a * (0.72 + 0.28 * dot(sR.rgb, vec3(0.299, 0.587, 0.114)));
            float hD = sD.a * (0.72 + 0.28 * dot(sD.rgb, vec3(0.299, 0.587, 0.114)));
            float hU = sU.a * (0.72 + 0.28 * dot(sU.rgb, vec3(0.299, 0.587, 0.114)));

            float bevelX = (hL - hR) * uPrintEmboss * sideMask;
            float bevelY = (hD - hU) * uPrintEmboss * sideMask;

            normal = normalize(normal + vDecalTangent * bevelX + vDecalBitangent * bevelY);
          }
          `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <dithering_fragment>',
          `
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.8);
          vec3 cottonSheen = vec3(0.13, 0.13, 0.12) * fresnel * (1.0 - decalPrintAlpha * 0.78);
          gl_FragColor.rgb += cottonSheen;
          #include <dithering_fragment>
          `
        );
      };

      const sleeveMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(cssTokens.shirtColor),
        roughness: cssTokens.shirtRoughness,
        metalness: 0.03,
        normalMap: cottonNormalMap,
        normalScale: new THREE.Vector2(cssTokens.shirtBump, cssTokens.shirtBump),
        roughnessMap: cottonRoughnessMap,
        side: THREE.DoubleSide,
        shadowSide: THREE.FrontSide
      });
      attachBaseCottonShader(sleeveMaterial);
      trackedFabricMaterials.push(sleeveMaterial);

      const textureLoader = new THREE.TextureLoader();
      textureLoader.setCrossOrigin('anonymous');

      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        const upgradeSwTex = (url, targetTex) => {
          textureLoader.load(url, (loaded) => {
            targetTex.image = loaded.image;
            targetTex.needsUpdate = true;
          });
        };
        upgradeSwTex('/__sw-tex/cotton-normal-v3.png', cottonNormalMap);
        upgradeSwTex('/__sw-tex/cotton-rough-v3.png', cottonRoughnessMap);
        upgradeSwTex('/__sw-tex/plaster-normal-v3.png', plasterNormalMap);
        upgradeSwTex('/__sw-tex/plaster-rough-v3.png', plasterRoughnessMap);
      }

      function loadDecalSide(side, url, options = {}) {
        const isFront = side === 'front';
        const mapUniform   = isFront ? shirtUniforms.uFrontLogoMap : shirtUniforms.uBackLogoMap;
        const flagUniform  = isFront ? shirtUniforms.uHasFrontLogo : shirtUniforms.uHasBackLogo;
        const scaleUniform = isFront ? shirtUniforms.uFrontScale   : shirtUniforms.uBackScale;
        const offUniform   = isFront ? shirtUniforms.uFrontOffset  : shirtUniforms.uBackOffset;
        const texelUniform = isFront ? shirtUniforms.uFrontTexel   : shirtUniforms.uBackTexel;

        const targetScaleW = options.scale !== undefined ? options.scale : scaleUniform.value.x;
        if (options.offsetX !== undefined) offUniform.value.x = options.offsetX;
        if (options.offsetY !== undefined) offUniform.value.y = options.offsetY;

        if (!url || typeof url !== 'string' || url.trim() === '') {
          flagUniform.value = 0.0;
          mapUniform.value = emptyLogoTex;
          return;
        }

        textureLoader.load(
          url.trim(),
          (tex) => {
            tex.anisotropy = maxAniso;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            tex.needsUpdate = true;

            const imgW = (tex.image && (tex.image.naturalWidth || tex.image.width)) || 512;
            const imgH = (tex.image && (tex.image.naturalHeight || tex.image.height)) || 512;
            const aspect = imgW / Math.max(imgH, 1);

            scaleUniform.value.set(targetScaleW, targetScaleW / aspect);
            texelUniform.value.set(1.35 / imgW, 1.35 / imgH);
            mapUniform.value = tex;
            flagUniform.value = 1.0;
          },
          undefined,
          () => {
            flagUniform.value = 0.0;
          }
        );
      }

      if (frontUrlAttr) {
        loadDecalSide('front', frontUrlAttr, {
          scale: initFrontScale,
          offsetX: initFrontX,
          offsetY: initFrontY
        });
      }

      if (backUrlAttr) {
        loadDecalSide('back', backUrlAttr, {
          scale: initBackScale,
          offsetX: initBackX,
          offsetY: initBackY
        });
      }

      /* 3. Mount Fallback Immediately, Swap in .GLB When Ready */
      const tshirtPivotGroup = new THREE.Group();
      tshirtPivotGroup.position.set(0, -0.05, 0.0);
      scene.add(tshirtPivotGroup);

      let activeGarmentNode = null;

      function mountGarmentNode(node) {
        if (activeGarmentNode) {
          tshirtPivotGroup.remove(activeGarmentNode);
        }
        activeGarmentNode = node;
        tshirtPivotGroup.add(node);
      }

      const initialFallback = buildProceduralFallbackTShirt(THREE, torsoMaterial, sleeveMaterial);
      mountGarmentNode(initialFallback);

      function loadTShirtGlbModel(glbUrl) {
        return new Promise((resolve) => {
          if (!glbUrl || typeof glbUrl !== 'string' || glbUrl.trim() === '') {
            resolve({ source: 'procedural-fallback' });
            return;
          }

          const dracoLoader = new THREE.DRACOLoader();
          dracoLoader.setDecoderPath(CDN_LIBS.DRACO_WASM_DIR);
          dracoLoader.setDecoderConfig({ type: 'wasm' });

          const gltfLoader = new THREE.GLTFLoader();
          gltfLoader.setDRACOLoader(dracoLoader);
          gltfLoader.setCrossOrigin('anonymous');

          gltfLoader.load(
            glbUrl.trim(),
            (gltf) => {
              try {
                const normalizedGlb = prepareImportedGlbScene(
                  THREE,
                  gltf.scene,
                  torsoMaterial,
                  cssTokens.aoIntensity,
                  trackedFabricMaterials,
                  isPreNormalized
                );
                mountGarmentNode(normalizedGlb);
                dracoLoader.dispose();
                resolve({ source: 'glb', url: glbUrl });
              } catch (parseErr) {
                console.warn('[GLB Normalization Fallback]:', parseErr);
                dracoLoader.dispose();
                resolve({ source: 'procedural-fallback' });
              }
            },
            undefined,
            () => {
              dracoLoader.dispose();
              resolve({ source: 'procedural-fallback' });
            }
          );
        });
      }

      if (glbUrlAttr) {
        loadTShirtGlbModel(glbUrlAttr);
      }

      /* 4. Interactive onClick 180° T-Shirt Flip */
      let turnStepIndex = 0;
      let targetTurnAngle = 0.0;
      let currentTurnAngle = 0.0;
      let turnVelocity = 0.0;

      function triggerTShirtFlip() {
        turnStepIndex += 1;
        targetTurnAngle = turnStepIndex * Math.PI;
        rootEl.setAttribute('data-view-side', turnStepIndex % 2 === 0 ? 'front' : 'back');

        if (typeof stageEl.animate === 'function') {
          stageEl.animate(
            [
              { transform: 'scale(1)' },
              { transform: 'scale(0.992)' },
              { transform: 'scale(1)' }
            ],
            { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
          );
        }
      }

      let pointerDownX = 0;
      let pointerDownY = 0;
      let pointerDownTime = 0;

      stageEl.addEventListener('pointermove', (e) => {
        const bounds = stageEl.getBoundingClientRect();
        if (bounds.width > 0 && bounds.height > 0) {
          const xp = (((e.clientX - bounds.left) / bounds.width) * 100).toFixed(1) + '%';
          const yp = (((e.clientY - bounds.top) / bounds.height) * 100).toFixed(1) + '%';
          rootEl.style.setProperty('--ts-cursor-x', xp);
          rootEl.style.setProperty('--ts-cursor-y', yp);
        }
      }, { passive: true });

      stageEl.addEventListener('pointerdown', (e) => {
        pointerDownX = e.clientX;
        pointerDownY = e.clientY;
        pointerDownTime = performance.now();
      }, { passive: true });

      stageEl.addEventListener('pointerup', (e) => {
        const dx = Math.abs(e.clientX - pointerDownX);
        const dy = Math.abs(e.clientY - pointerDownY);
        const dt = performance.now() - pointerDownTime;
        if (dx < 8 && dy < 8 && dt < 500) {
          triggerTShirtFlip();
        }
      }, { passive: true });

      stageEl.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          triggerTShirtFlip();
        }
      });

      /* 5. Rough Off-White Plaster Architectural Room */
      const plasterWallMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(cssTokens.wallColor),
        roughness: cssTokens.wallRoughness,
        metalness: 0.0,
        normalMap: plasterNormalMap,
        normalScale: new THREE.Vector2(cssTokens.wallBump, cssTokens.wallBump),
        roughnessMap: plasterRoughnessMap
      });

      const backWall = new THREE.Mesh(new THREE.PlaneGeometry(34, 22), plasterWallMaterial);
      backWall.position.set(0, 1.2, -2.05);
      backWall.receiveShadow = true;
      scene.add(backWall);

      const floorPlane = new THREE.Mesh(new THREE.PlaneGeometry(34, 24), plasterWallMaterial);
      floorPlane.rotation.x = -Math.PI * 0.5;
      floorPlane.position.set(0, -2.10, 3.5);
      floorPlane.receiveShadow = true;
      scene.add(floorPlane);

      /* 6. Normalized Studio Lighting Rig */
      const morningHemiLight = new THREE.HemisphereLight(0xf4f7fb, 0x8c867a, cssTokens.hemiIntensity);
      scene.add(morningHemiLight);

      const studioKeyFill = new THREE.DirectionalLight(0xffffff, cssTokens.fillIntensity);
      studioKeyFill.position.set(1.8, 1.6, 6.5);
      scene.add(studioKeyFill);

      const morningSunSpot = new THREE.SpotLight(new THREE.Color(cssTokens.sunColor), cssTokens.sunIntensity);
      morningSunSpot.position.set(-5.2, 3.8, 5.8);
      morningSunSpot.target.position.set(0.3, -0.2, -1.8);
      morningSunSpot.angle = Math.PI / 3.8;
      morningSunSpot.penumbra = 0.45;
      morningSunSpot.decay = 1.25;
      morningSunSpot.distance = 28;
      morningSunSpot.castShadow = true;
      morningSunSpot.shadow.mapSize.width = 1024;
      morningSunSpot.shadow.mapSize.height = 1024;
      morningSunSpot.shadow.camera.near = 2.5;
      morningSunSpot.shadow.camera.far = 16.0;
      morningSunSpot.shadow.bias = -0.0006;
      morningSunSpot.shadow.normalBias = 0.025;
      scene.add(morningSunSpot);
      scene.add(morningSunSpot.target);

      const skyRimSpot = new THREE.SpotLight(new THREE.Color(cssTokens.rimColor), cssTokens.rimIntensity);
      skyRimSpot.position.set(5.4, 2.8, 4.4);
      skyRimSpot.target.position.set(-0.3, -0.1, -1.4);
      skyRimSpot.angle = Math.PI / 3.5;
      skyRimSpot.penumbra = 0.58;
      skyRimSpot.decay = 1.3;
      skyRimSpot.distance = 26;
      skyRimSpot.castShadow = false;
      scene.add(skyRimSpot);
      scene.add(skyRimSpot.target);

      const goboGroup = new THREE.Group();
      const slatMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      for (let i = -2; i <= 2; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.13, 6.2, 0.04), slatMat);
        slat.position.set(i * 0.78, 0, 0);
        slat.castShadow = true;
        goboGroup.add(slat);
      }
      goboGroup.position.set(-2.8, 2.1, 3.2);
      goboGroup.lookAt(morningSunSpot.position);
      scene.add(goboGroup);

      /* 7. Hardware DepthTexture FBO & 12-Tap Bokeh Depth-of-Field Pass */
      const rtW = Math.floor(initW * dpr);
      const rtH = Math.floor(initH * dpr);

      const depthTexture = new THREE.DepthTexture(rtW, rtH);
      depthTexture.type = THREE.UnsignedShortType;
      depthTexture.minFilter = THREE.NearestFilter;
      depthTexture.magFilter = THREE.NearestFilter;

      const renderTarget = new THREE.WebGLRenderTarget(rtW, rtH, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        depthBuffer: true,
        stencilBuffer: false,
        depthTexture: depthTexture
      });

      const postScene = new THREE.Scene();
      const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const dofUniforms = {
        tColor: { value: renderTarget.texture },
        tDepth: { value: renderTarget.depthTexture },
        uResolution: { value: new THREE.Vector2(rtW, rtH) },
        uCameraNear: { value: camera.near },
        uCameraFar: { value: camera.far },
        uFocusDistance: { value: 6.0 },
        uFocalRange: { value: cssTokens.focalRange },
        uMaxBlurPx: { value: cssTokens.dofBlur * dpr },
        uExposure: { value: cssTokens.exposure }
      };

      const dofMaterial = new THREE.ShaderMaterial({
        vertexShader: DOF_VERTEX_SHADER,
        fragmentShader: DOF_FRAGMENT_SHADER,
        uniforms: dofUniforms,
        depthWrite: false,
        depthTest: false
      });

      const fullScreenQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), dofMaterial);
      postScene.add(fullScreenQuad);

      /* 8. Live CSSOM MutationObserver */
      function syncFromCssVariables() {
        cssTokens = readCssTokens(rootEl);
        const curDpr = renderer.getPixelRatio();

        scene.background.set(cssTokens.bgStage);
        scene.fog.color.set(cssTokens.bgStage);

        const repX = cssTokens.knitRepeat;
        const repY = Math.round(repX * 1.18);
        cottonNormalMap.repeat.set(repX, repY);
        cottonRoughnessMap.repeat.set(repX, repY);

        trackedFabricMaterials.forEach((mat) => {
          mat.color.set(cssTokens.shirtColor);
          mat.roughness = cssTokens.shirtRoughness;
          mat.normalScale.set(cssTokens.shirtBump, cssTokens.shirtBump);
          if (mat.aoMap) {
            mat.aoMapIntensity = cssTokens.aoIntensity;
          }
        });

        plasterWallMaterial.color.set(cssTokens.wallColor);
        plasterWallMaterial.roughness = cssTokens.wallRoughness;
        plasterWallMaterial.normalScale.set(cssTokens.wallBump, cssTokens.wallBump);

        morningSunSpot.color.set(cssTokens.sunColor);
        morningSunSpot.intensity = cssTokens.sunIntensity;
        skyRimSpot.color.set(cssTokens.rimColor);
        skyRimSpot.intensity = cssTokens.rimIntensity;
        morningHemiLight.intensity = cssTokens.hemiIntensity;
        studioKeyFill.intensity = cssTokens.fillIntensity;

        shirtUniforms.uPrintRoughness.value = cssTokens.printRoughness;
        shirtUniforms.uPrintEmboss.value = cssTokens.printEmboss;
        shirtUniforms.uKnitBleedThrough.value = cssTokens.knitBleed;
        shirtUniforms.uKnitCavity.value = cssTokens.knitCavity;
        shirtUniforms.uKnitRepeat.value = cssTokens.knitRepeat;

        dofUniforms.uFocalRange.value = cssTokens.focalRange;
        dofUniforms.uMaxBlurPx.value = cssTokens.dofBlur * curDpr;
        dofUniforms.uExposure.value = cssTokens.exposure;
      }

      const styleObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.attributeName === 'style' || m.attributeName === 'class') {
            syncFromCssVariables();
          }
        }
      });
      styleObserver.observe(rootEl, { attributes: true, attributeFilter: ['style', 'class'] });

      window.rotateTShirt = triggerTShirtFlip;
      window.syncTShirtCssTokens = syncFromCssVariables;
      window.loadTShirtGlb = loadTShirtGlbModel;
      window.setTShirtLogos = function (config = {}) {
        if (config.front !== undefined) {
          if (typeof config.front === 'string') loadDecalSide('front', config.front);
          else if (config.front) loadDecalSide('front', config.front.url, config.front);
        }
        if (config.back !== undefined) {
          if (typeof config.back === 'string') loadDecalSide('back', config.back);
          else if (config.back) loadDecalSide('back', config.back.url, config.back);
        }
      };
      window.setTShirtLogo = function (url, opts = {}) {
        loadDecalSide(opts.side === 'back' ? 'back' : 'front', url, opts);
      };

      /* 9. Bi-Directional (Horizontal + Vertical) Parent-Column Camera Fitter */
      let baseCamZ = 6.2;
      function updateViewportSize(width, height) {
        const aspect = width / Math.max(height, 1);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        /* Fit both the 3.85-unit sleeve width AND 3.55-unit collar-to-hem height
         * so the T-shirt fits any narrow, square, or wide Carrd column cleanly */
        const targetSpanWidth = 3.85;
        const targetSpanHeight = 3.55;
        const vFovRad = (camera.fov * Math.PI) / 180;
        const tanHalfFov = Math.tan(vFovRad / 2);

        const reqZWidth = (targetSpanWidth / aspect) / (2 * tanHalfFov);
        const reqZHeight = targetSpanHeight / (2 * tanHalfFov);

        baseCamZ = Math.max(5.5, Math.min(Math.max(reqZWidth, reqZHeight), 11.5));
      }

      updateViewportSize(initW, initH);

      const resizeObserver = new ResizeObserver(() => {
        const bounds = stageEl.getBoundingClientRect();
        const width = Math.floor(bounds.width);
        const height = Math.floor(bounds.height);
        if (width > 0 && height > 0) {
          const curDpr = Math.min(window.devicePixelRatio || 1, 1.35);
          const wPx = Math.floor(width * curDpr);
          const hPx = Math.floor(height * curDpr);
          renderer.setSize(width, height);
          renderTarget.setSize(wPx, hPx);
          dofUniforms.uResolution.value.set(wPx, hPx);
          dofUniforms.uMaxBlurPx.value = cssTokens.dofBlur * curDpr;
          updateViewportSize(width, height);
        }
      });
      resizeObserver.observe(stageEl);
      if (parentColumnEl) {
        resizeObserver.observe(parentColumnEl);
      }

      /* 10. Performance Guard */
      let isVisible = true;
      const io = new IntersectionObserver((entries) => {
        isVisible = entries[0] ? entries[0].isIntersecting : true;
      }, { threshold: 0.01 });
      io.observe(rootEl);

      document.addEventListener('visibilitychange', () => {
        isVisible = document.visibilityState === 'visible';
      });

      /* 11. Reveal Stage & Start 60fps Loop */
      rootEl.setAttribute('data-state', 'ready');
      const clock = new THREE.Clock();
      const focalTargetPoint = new THREE.Vector3();
      let lastTurningState = false;

      function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;

        const t = clock.getElapsedTime();
        shirtUniforms.uTime.value = t;

        const angleDiff = targetTurnAngle - currentTurnAngle;
        turnVelocity = turnVelocity * 0.82 + angleDiff * 0.018;
        currentTurnAngle += turnVelocity;

        const frontPhase = 0.5 + 0.5 * Math.cos(currentTurnAngle);
        const backPhase = 1.0 - frontPhase;

        const absVel = Math.abs(turnVelocity);
        const isCurrentlyTurning = absVel > 0.002;
        if (isCurrentlyTurning || lastTurningState) {
          rootEl.style.setProperty('--ts-turn-progress', backPhase.toFixed(4));
          rootEl.style.setProperty('--ts-turn-velocity', Math.min(absVel * 8.0, 1.0).toFixed(4));
          if (isCurrentlyTurning !== lastTurningState) {
            rootEl.setAttribute('data-turning', isCurrentlyTurning ? 'true' : 'false');
            lastTurningState = isCurrentlyTurning;
          }
        }

        const idleSwayY = Math.sin(t * 0.35) * 0.08 + Math.cos(t * 0.19) * 0.04;
        const turnTiltZ = -turnVelocity * 0.18;

        tshirtPivotGroup.rotation.y = currentTurnAngle + idleSwayY;
        tshirtPivotGroup.rotation.z = Math.sin(t * 0.21) * 0.01 + turnTiltZ;
        tshirtPivotGroup.position.y = -0.05 + Math.sin(t * 0.42) * 0.03;

        const orbitAngle = Math.sin(t * 0.18) * 0.24 + frontPhase * 0.10;
        const radiusZ = baseCamZ - frontPhase * 0.28 + Math.cos(t * 0.16) * 0.18;

        const camX = Math.sin(orbitAngle) * radiusZ * 0.42;
        const camY = (0.14 * frontPhase + 0.04 * backPhase) + Math.sin(t * 0.15) * 0.15;
        const camZ = Math.cos(orbitAngle) * radiusZ;

        camera.position.set(camX, camY, camZ);

        const lookX = frontPhase * 0.12 + Math.sin(t * 0.14) * 0.05;
        const lookY = frontPhase * 0.14 + backPhase * 0.04 + Math.cos(t * 0.17) * 0.05;
        focalTargetPoint.set(lookX, lookY, 0.08);
        camera.lookAt(focalTargetPoint);

        dofUniforms.uFocusDistance.value = camera.position.distanceTo(focalTargetPoint);

        morningSunSpot.position.x = -5.2 + Math.sin(t * 0.11) * 0.65;
        morningSunSpot.position.y = 3.8 + Math.cos(t * 0.09) * 0.35;

        renderer.setRenderTarget(renderTarget);
        renderer.clear();
        renderer.render(scene, camera);

        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
      }

      animate();
    } catch (err) {
      console.error('[Carrd GLB T-Shirt Hero Error]:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
