(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{138:function(e,n,t){var i=t(147);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);(0,t(41).default)("1585730c",i,!0,{})},145:function(e,n){e.exports="// uniform vec2 resolution;\n// void main() {\n//   gl_FragColor = vec4(0.1, 1.0, 0.5, 1.0);\n// }\n#ifdef GL_ES\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform float time;\nuniform vec2  resolution;\n\nuniform sampler2D tAudioData;\n\nuniform int   isColorInverted;\nuniform int   isGlitched;\nuniform float glitch;\nuniform float zoom;\n\nconst float PI = 3.14159265358979;\n\nconst float c1 = 0.8;\nconst float c2 = 0.11;\nconst float c3 = 0.49;\nconst float speed = 1.5;\n\nconst vec2 offsetCenter = vec2(-0.3, -0.0);\nconst float offsetZoom = 0.4;\n\nconst float lineWidth = 0.8;\nconst float senseAudio = 0.2;\n\nfloat rand(vec2 co){\n  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nmat2 rot(float t){\n    return mat2(cos(t), -sin(t), sin(t), cos(t));\n}\n\nfloat line(vec2 p, float w){\n    // return (1.0 - step(w, abs(p.y)));\n    return (1.0 - smoothstep(0.0, w, abs(p.y)));\n    // return smoothstep(w, -w, abs(p.y));\n}\n\nvoid main(void){\n    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);\n    p -= offsetCenter;\n    p.x *= 0.9;\n    p.y *= 0.9;\n\n    vec3 draw = vec3(0.0);\n\n    float period = 5.0;\n    float t = mod((time+5.2) * speed, period);\n\n    if(isGlitched == 1){\n      for(int i=0; i<5; i++){\n        float r1 = rand(vec2(t+0.0, float(i)))*2.-1.;\n        float r2 = rand(vec2(t+0.1, float(i)))*2.-1.;\n        float intensity = rand(vec2(t+0.2, float(i)))*glitch/255.;\n        if(min(r1, r2)<p.y && p.y<max(r1, r2)){\n          p.x += intensity;\n        }\n      }\n    }\n\n    p *= (zoom + offsetZoom);\n\n    float f = texture2D(tAudioData, p/256.0).r;\n    f = lineWidth - f*senseAudio;\n    \n    for (int i=0; i<3; i++) {\n\t    float b = (t + float(i) * period / 3.0) * PI * 0.4;\n      float s = sin(b);\n      float ss = s * 1.0 - 0.5;\n\n      vec2 pos = vec2(p.x*cos(b+1.0)/2.0, p.y*(sin(b+1.0)/2.0));\n      pos *= rot(ss * length(p-vec2(s, cos(b))));\n      pos *= rot(0.5 * PI);\n\n      vec3 color;\n      if (i == 0) {\n      \tcolor = vec3(c1, c2, c3);\n      } else if (i==1) {\n      \tcolor = vec3(c2, c3, c1);\n      } else {\n      \tcolor = vec3(c3, c1, c2);\n      }\n      draw += line(pos, f) * color;\n    }\n    \n    // if(isColorInverted != 0){\n    draw = 1.0 - draw;\n    // }\n    \n    gl_FragColor = vec4(draw,1.0);\n}\n"},146:function(e,n,t){"use strict";var i=t(138);t.n(i).a},147:function(e,n,t){(e.exports=t(40)(!1)).push([e.i,"body{color:#eee}#textContainer{z-index:10}",""])},151:function(e,n,t){"use strict";t.r(n);t(42);var i=t(4),o=t.n(i),s=t(137),a=(t(140),t(141),{mounted:function(){this.scene=new s.Scene,this.init("canvas")},methods:{init:function(){var e=o()(regeneratorRuntime.mark(function e(n){var t,i=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.width=1075,this.height=650,this.aspect=this.width/this.height,(t=document.getElementById(n)).width=this.width,t.height=this.height,this.renderer=new s.WebGLRenderer({canvas:t,antialias:!0,width:this.width,height:this.height}),this.createCamera(),this.createControls(),this.scene.background=new s.Color(15790320),this.createPlane(),(new s.FontLoader).load("helvetiker_regular.typeface.json",function(e){i.createText(e),(new s.TextureLoader).load("QR.png",function(e){var n=new s.MeshLambertMaterial({map:e}),t=new s.PlaneGeometry(.3,.3),o=new s.Mesh(t,n);o.position.set(.4,-.55,.01),i.scene.add(o);var a=new s.PointLight(16777215,1,0);a.position.set(1,1,100),i.scene.add(a),i.animate()})});case 13:case"end":return e.stop()}},e,this)}));return function(n){return e.apply(this,arguments)}}(),createCamera:function(){this.camera=new s.PerspectiveCamera(45,this.aspect,1,1e4),this.camera.position.set(0,0,2.42)},createControls:function(){var e=new s.OrbitControls(this.camera);e.target.set(0,0,0),e.update()},createPlane:function(){var e={resolution:{type:"v2",value:new s.Vector2(this.width,this.height)},time:{type:"f",value:1.1},zoom:{type:"f",value:.5}},n=new s.ShaderMaterial({vertexShader:"\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:t(145),uniforms:e}),i=new s.PlaneGeometry(2*this.aspect,2),o=new s.Mesh(i,n);this.scene.add(o)},_createTextMesh:function(e,n){var t=new s.MeshBasicMaterial({color:15658734,transparent:!0,opacity:1,side:s.DoubleSide}),i=e.generateShapes(n.message,n.size),o=new s.ShapeBufferGeometry(i);o.computeBoundingBox();var a=-.5*(o.boundingBox.max.x-o.boundingBox.min.x);return o.translate(a,0,0),new s.Mesh(o,t)},createText:function(e){var n=this._createTextMesh(e,{message:"Engineer",size:.06});n.position.set(-1.1,.55,0),this.scene.add(n);var t=this._createTextMesh(e,{message:"nabehide",size:.2});t.position.set(-.7,.2,0),this.scene.add(t);var i=this._createTextMesh(e,{message:"Github: nabehide",size:.06});i.position.set(-.96,-.4,0),this.scene.add(i);var o=this._createTextMesh(e,{message:"Twitter: @____nabehide",size:.06});o.position.set(-.81,-.55,0),this.scene.add(o);var s=this._createTextMesh(e,{message:"Portfolio: https://nabehide.github.io",size:.06});s.position.set(-.61,-.7,0),this.scene.add(s)},render:function(){this.renderer.render(this.scene,this.camera)},animate:function(){requestAnimationFrame(this.animate),this.render()}}}),r=(t(146),t(14)),c=Object(r.a)(a,function(){this.$createElement;this._self._c;return this._m(0)},[function(){var e=this.$createElement,n=this._self._c||e;return n("div",{attrs:{id:"container"}},[n("canvas",{attrs:{id:"canvas"}})])}],!1,null,null,null);c.options.__file="front.vue";n.default=c.exports}}]);