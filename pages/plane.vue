<template>
  <canvas id="canvas" />
</template>

<script>
import * as THREE from 'three';
// import WebFontLoader from 'webfontloader';

const DEFAULT_VERTEX_SHADER = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const DEFAULT_FRAGMENT_SHADER = `
void main() {
  gl_FragColor = vec4(0.1, 1.0, 0.5, 1.0);
}
`

export default {
  mounted () {
    const scene = new THREE.Scene();

    const width = 512;
    const height = 512;
    const aspect = width/height;

    const canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      width: width,
      height: height,
    });

    const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
    camera.position.set(0,0,1);
    camera.lookAt(scene.position);
    scene.add(camera);

    const uniforms = {}
    const material = new THREE.ShaderMaterial({
      vertexShader: DEFAULT_VERTEX_SHADER,
      fragmentShader: DEFAULT_FRAGMENT_SHADER,
      uniforms: uniforms,
    });
    const geometry = new THREE.PlaneGeometry(2 * aspect, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    /*
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
    camera.position.set(0,0,100);
    camera.lookAt(scene.position);

    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    ctx.font = 'bold';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,1.0)';
    ctx.fillText('sample text', width/2, height/2);
    const texture = new THREE.CanvasTexture()
    texture.needsUpdate = false;

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        texture: { type: 'f', value: texture },
      },
      // vertexShader: DEFAULT_VERTEX_SHADER,
      // fragmentShader: DEFAULT_FRAGMENT_SHADER,
      transparent: true
    });
    const geometry = new THREE.PlaneBufferGeometry(width, width/2, 1, 1)
    const text = new THREE.Mesh(geometry, material);
    scene.add(text);
    */

    /*
    // const loader = new THREE.FontLoader();
    // loader.load('helvetiker_regular.typeface.json', font => {
    WebFontLoader.load({
      google: {
        families: ['Ubuntu']
      },
      active: () => {
        const textGeometry = new THREE.TextGeometry('sample text', {
          // font: font,
          font: 'Ubuntu',
          size: 20,
          height: 5,
          curveSegments: 12
        });
        const materials = [
          new THREE.MeshBasicMaterial({ color: Math.random * 0xffffff, overdraw: 0.5 }),
          new THREE.MeshBasicMaterial({ color: 0x000000, overdraw: 0.5 })
        ];
        const textMesh = new THREE.Mesh(textGeometry, mateials);
        scene.add(textMesh)
        renderer.render(scene, camera)
      }
    })
    */

    renderer.render(scene, camera)

    /*
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = image;
    */
  },
}
</script>

<style>
</style>
