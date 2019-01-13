import * as THREE from 'three'
const DEFAULT_VERTEX_SHADER = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const DEFAULT_FRAGMENT_SHADER = `
// uniform vec2 resolution;
// void main() {
//   gl_FragColor = vec4(0.1, 1.0, 0.5, 1.0);
// }
#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

uniform float time;
uniform vec2  resolution;

uniform sampler2D tAudioData;

uniform int   isColorInverted;
uniform int   isGlitched;
uniform float glitch;
uniform float zoom;

const float PI = 3.14159265358979;

const float c1 = 0.8;
const float c2 = 0.11;
const float c3 = 0.49;
const float speed = 1.5;

const vec2 offsetCenter = vec2(-0.5, 0.1);
const float offsetZoom = 0.5;

const float lineWidth = 0.8;
const float senseAudio = 0.2;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

mat2 rot(float t){
    return mat2(cos(t), -sin(t), sin(t), cos(t));
}

float line(vec2 p, float w){
    // return (1.0 - step(w, abs(p.y)));
    return (1.0 - smoothstep(0.0, w, abs(p.y)));
    // return smoothstep(w, -w, abs(p.y));
}

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    p -= offsetCenter;

    vec3 draw = vec3(0.0);

    float period = 5.0;
    float t = mod(time * speed, period);

    if(isGlitched == 1){
      for(int i=0; i<5; i++){
        float r1 = rand(vec2(t+0.0, float(i)))*2.-1.;
        float r2 = rand(vec2(t+0.1, float(i)))*2.-1.;
        float intensity = rand(vec2(t+0.2, float(i)))*glitch/255.;
        if(min(r1, r2)<p.y && p.y<max(r1, r2)){
          p.x += intensity;
        }
      }
    }

    p *= (zoom + offsetZoom);

    float f = texture2D(tAudioData, p/256.0).r;
    f = lineWidth - f*senseAudio;
    
    for (int i=0; i<3; i++) {
	    float b = (t + float(i) * period / 3.0) * PI * 0.4;
      float s = sin(b);
      float ss = s * 1.0 - 0.5;

      vec2 pos = vec2(p.x*cos(b+1.0)/2.0, p.y*(sin(b+1.0)/2.0));
      pos *= rot(ss * length(p-vec2(s, cos(b))));
      pos *= rot(0.5 * PI);

      vec3 color;
      if (i == 0) {
      	color = vec3(c1, c2, c3);
      } else if (i==1) {
      	color = vec3(c2, c3, c1);
      } else {
      	color = vec3(c3, c1, c2);
      }
      draw += line(pos, f) * color;
    }
    
    if(isColorInverted != 0){
      draw = 1.0 - draw;
    }
    
    gl_FragColor = vec4(draw,1.0);
}
`

export default class Canvas {
  constructor ( id ) {
    this.scene = new THREE.Scene();
    this.init(id);
  }

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

    this.createPlane();

    const loader = new THREE.FontLoader();
    loader.load('helvetiker_regular.typeface.json', font => {

      this.createText(font);

      this.animate();

      /*
      // save image
      const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      window.location.href = image;
      */
    })
  }
  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, this.aspect, 1, 10000);
    this.camera.position.set(0, 0, 2.42);
  }
  createControls () {
    const controls = new THREE.OrbitControls(this.camera);
    controls.target.set(0, 0, 0);
    controls.update();
  }
  createPlane () {
    const uniforms = {
      resolution: { type: 'v2', value: new THREE.Vector2(this.width, this.height) },
      time: { type: 'f', value: 1.1 },

      zoom: { type: 'f', value: 0.5 },
    }
    const material = new THREE.ShaderMaterial({
      vertexShader: DEFAULT_VERTEX_SHADER,
      fragmentShader: DEFAULT_FRAGMENT_SHADER,
      uniforms: uniforms,
    });
    const geometry = new THREE.PlaneGeometry(2 * this.aspect, 2);
    const plane = new THREE.Mesh(geometry, material);
    this.scene.add(plane);
  }

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
  }

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
  }
  render () {
    this.renderer.render(this.scene, this.camera)
  }
  animate () {
    requestAnimationFrame(this.animate);
    this.render();
  }
}
