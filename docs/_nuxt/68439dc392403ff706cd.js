(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{152:function(e,n,a){"use strict";a.r(n);var t=a(137),i={mounted:function(){var e=new t.Scene,n=document.getElementById("canvas");n.width=512,n.height=512;var a=new t.WebGLRenderer({canvas:n,antialias:!0,width:512,height:512}),i=new t.OrthographicCamera(-1,1,1,-1,.1,10);i.position.set(0,0,1),i.lookAt(e.position),e.add(i);var o=new t.ShaderMaterial({vertexShader:"\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvoid main() {\n  gl_FragColor = vec4(0.1, 1.0, 0.5, 1.0);\n}\n",uniforms:{}}),r=new t.PlaneGeometry(2,2),s=new t.Mesh(r,o);e.add(s),a.render(e,i)}},o=a(14),r=Object(o.a)(i,function(){var e=this.$createElement;return(this._self._c||e)("canvas",{attrs:{id:"canvas"}})},[],!1,null,null,null);r.options.__file="plane.vue";n.default=r.exports}}]);