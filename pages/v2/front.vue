<template>
  <div id="container">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols'

const DEFAULT_VERTEX_SHADER = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export default {
  mounted () {
    this.scene = new THREE.Scene();
    this.init('canvas');
  },
  methods: {
    async init ( id ) {
      this.width = 1075;
      this.height = 650;
      this.aspect = this.width/this.height;

      const canvas = document.getElementById(id);
      canvas.width = this.width;
      canvas.height = this.height;
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        width: this.width,
        height: this.height,
      });

      this.createCamera();
      this.createControls();

      this.scene.background = new THREE.Color(0xf0f0f0);

      this.createPlane();

      const loader = new THREE.FontLoader();
      loader.load('helvetiker_regular.typeface.json', font => {
        this.createText(font);

        this.animate();
      });
    },
    createCamera () {
      this.camera = new THREE.PerspectiveCamera(45, this.aspect, 1, 10000);
      this.camera.position.set(0, 0, 2.42);
    },
    createControls () {
      const controls = new THREE.OrbitControls(this.camera);
      controls.target.set(0, 0, 0);
      controls.update();
    },
    createPlane () {
      const uniforms = {
        resolution: { type: 'v2', value: new THREE.Vector2(this.width, this.height) },
        time: { type: 'f', value: 1.1 },

        zoom: { type: 'f', value: 0.5 },
      }
      const material = new THREE.ShaderMaterial({
        vertexShader: DEFAULT_VERTEX_SHADER,
        fragmentShader: require('~/assets/v2/glsl/logo.frag'),
        uniforms: uniforms,
      });
      const geometry = new THREE.PlaneGeometry(2 * this.aspect, 2);
      const plane = new THREE.Mesh(geometry, material);
      this.scene.add(plane);
    },

    _createTextMesh ( font, options ) {
      const color = 0xEEEEEE;
      const matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
      });
      const shapes = font.generateShapes(options.message, options.size);
      const geometry = new THREE.ShapeBufferGeometry(shapes);
      geometry.computeBoundingBox();

      const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
      geometry.translate(xMid, 0, 0);

      return new THREE.Mesh(geometry, matLite);
    },

    createText (font) {
      const job = this._createTextMesh(font, { message: 'Engineer', size: 0.06 });
      job.position.set(0.3, 0.45, 0);
      this.scene.add(job);

      const text = this._createTextMesh(font, { message: 'nabehide', size: 0.2 });
      text.position.set(0.7, 0.1, 0);
      this.scene.add(text);

      const github = this._createTextMesh(font, { message: 'Github: nabehide', size: 0.06 });
      github.position.set(0.45, -0.2, 0);
      this.scene.add(github);

      const twitter = this._createTextMesh(font, { message: 'Twitter: @____nabehide', size: 0.06 });
      twitter.position.set(0.6, -0.35, 0);
      this.scene.add(twitter);

      const web = this._createTextMesh(font, { message: 'Portfolio: https://nabehide.github.io', size: 0.06 });
      web.position.set(0.8, -0.5, 0);
      this.scene.add(web);
    },
    render () {
      this.renderer.render(this.scene, this.camera)
    },
    animate () {
      requestAnimationFrame(this.animate);
      this.render();
    },
  },
}
</script>

<style>
body {
  color: #eee;
}
#textContainer {
  z-index: 10;
}
</style>
