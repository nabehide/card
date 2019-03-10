<template>
  <div id="container">
    <canvas id="canvas" />
  </div>
</template>

<script>
import * as THREE from 'three';
// import OrbitControls from '~/assets/OrbitControls'
import OrbitControls from 'three-orbitcontrols'
// const OrbitControls = require('three-orbitcontrols')
import Canvas from '~/assets/Canvas'

const DEFAULT_VERTEX_SHADER = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export default {
  mounted () {
    /*
    const canvas = new Canvas('canvas');
    const canvas2 = new Canvas('canvas2');
    */
    this.scene = new THREE.Scene();
    this.init('canvas');
  },
  methods: {
    init ( id ) {
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

      // this.createPlane(require('~/assets/glsl/orb.frag'), 2*this.aspect, 2, 0);
      this.createPlane(require('~/assets/glsl/logo.frag'), 2, 2, 1);

      /*
      const loader = new THREE.TextureLoader();
      loader.load("logo.png", image => {
        const material = new THREE.MeshLambertMaterial({
          map: image
        });
        const geometry = new THREE.PlaneGeometry(1.5, 1.5);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0.01);
        this.scene.add(mesh);

        const light = new THREE.PointLight(0xffffff, 1, 0);
        light.position.set(1, 1, 100);
        this.scene.add(light);

        this.animate();

        // save image
        // const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        // window.location.href = image;
      })
      */
      this.animate();
      // save image
      // const png = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      // window.location.href = png;
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
    createPlane ( frag, width, height, z ) {
      const uniforms = {
        resolution: { type: 'v2', value: new THREE.Vector2(this.width, this.height) },
        time: { type: 'f', value: 1.1 },

        zoom: { type: 'f', value: 0.5 },
      }
      const material = new THREE.ShaderMaterial({
        vertexShader: DEFAULT_VERTEX_SHADER,
        fragmentShader: frag,
        uniforms: uniforms,
      });
      const geometry = new THREE.PlaneGeometry(width, height);
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, z);
      this.scene.add(plane);
    },

    _createTextMesh ( font, options ) {
      const color = 0x006699;
      // const color = 0x004466;
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
      const text = this._createTextMesh(font, { message: 'nabehide', size: 0.2 });
      text.position.set(-0.7, 0.2, 0);
      this.scene.add(text);

      const job = this._createTextMesh(font, { message: 'Engineer', size: 0.06 });
      job.position.set(-1.1, 0.55, 0);
      this.scene.add(job);

      const web = this._createTextMesh(font, { message: 'Portfolio: https://nabehide.github.io', size: 0.06 });
      web.position.set(-0.61, -0.6, 0);
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
</style>
