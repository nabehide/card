#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif
uniform float time;
uniform vec2  resolution;
// uniform vec3  color;


uniform sampler2D tAudioData;
uniform int   isColorInverted;
uniform int   isGlitched;
uniform float glitch;
uniform float zoom;
const float c1 = 0.8;
const float c2 = 0.11;
const float c3 = 0.49;
const float speed = 1.5;
const vec2 offsetCenter = vec2(-0.5, -0.0);
const float offsetZoom = 0.9;
const float lineWidth = 0.8;
const float senseAudio = 0.2;

const vec3 bg    = vec3(0.00, 0.00, 0.00);


const float PI = 3.14159265;
const float period = 4.;

// const color = vec3(0.01, 0.01, 1.0);
const vec3 color = vec3(1.0, 1.0, 1.0);

// const vec3 bg = vec3(0.0, 0.0, 0.0);

mat2 rot(float t){
  return mat2(cos(t),-sin(t),sin(t),cos(t));
}

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(float s, float o, float period){
  float i = floor(s);
  float f = fract(s);
  float u = f * f * (3. - 2. * f);

  float s1 = rand(vec2(i/100.,i*o/100.));
  float s2;
  if(s < period-1.){
     s2 = rand(vec2((i+1.)/100.,(i+1.)*o/100.));
  }else{
     s2 = rand(vec2(0.,0.));
  }

  return mix(s1, s2, u);
}

float line(vec2 p, float width){
  return (1.0 - step(width*0.5, abs(p.y)));
  // return 0.1 / pow(length(p.y), 0.5);
}

float line_orb(vec2 p, float w){
    // return (1.0 - step(w, abs(p.y)));
    return (1.0 - smoothstep(0.0, w, abs(p.y)));
    // return smoothstep(w, -w, abs(p.y));
}

vec3 orb(){
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec3 draw_orb = vec3(0.0);

  float period = 5.0;
  float t_orb = mod((time+5.2) * speed, period);

  if(isGlitched == 1){
    for(int i=0; i<5; i++){
      float r1 = rand(vec2(t_orb+0.0, float(i)))*2.-1.;
      float r2 = rand(vec2(t_orb+0.1, float(i)))*2.-1.;
      float intensity = rand(vec2(t_orb+0.2, float(i)))*glitch/255.;
      if(min(r1, r2)<p.y && p.y<max(r1, r2)){
        p.x += intensity;
      }
    }
  }

  p += vec2(1.0, 1.0);
  p *= (zoom + offsetZoom);

  float f = texture2D(tAudioData, p/256.0).r;
  f = lineWidth - f*senseAudio;
  
  for (int i=0; i<3; i++) {
    float b = (t_orb + float(i) * period / 3.0) * PI * 0.4;
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
    draw_orb += line_orb(pos, f) * color;
  }
  
  // if(isColorInverted != 0){
  draw_orb = 1.0 - draw_orb;
  // }
  return draw_orb;
}

float circle(vec2 p, vec2 center, float size){
	return smoothstep(size+0.01, size, length(p-center));
}

float line_logo(vec2 p){
	float c = 2.5;
	float d = 0.13;
	return circle(p, vec2(0., -(c-d)), c) * circle(p, vec2(0., c-d), c);
}

vec3 logo(){
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  // float t = mod(time, period);
  float t = 0.15;

	vec3 draw = bg;
	
	mat2 b = rot(0.15 * PI * 0.5 - 3. * length(vec2(pow(p.x, 2.), pow(p.y, 2.))));
	
	// float f = texture2D(iChannel0, p).r;
	// float f = textureLod( iChannel0, (p)/256.0, 0.0 ).x;
	
	// vec2 pos = p * rot(f * PI) * b;
	vec2 pos = p * rot(1.3 * PI) * b;
	
	draw += line_logo(pos) * (color-bg);

  /*
  vec3 draw = vec3(0.);

  float lines = 0.0;

  p = vec2(p.x*0.75, (p.y*(0.5+pow(p.y, 1.5)))*0.8);
  p *= 0.5;

  float x = 0.3*noise(t, 0.0, period);
  float y = 0.3*noise(t, 0.1, period);

  mat2 b = rot(t*PI*0.5-3.0*pow(length(vec2(pow(p.x+x,2.0),pow(p.y+y,2.0))), 1.0));

  float c = sin(t*PI*0.25);

  int i = 0;
  float extent = 0.15*c*pow(float(i),1.0);
  // lines += line(vec2(p.x, p.y) * rot((0.5-extent)*PI*0.5)*b, 0.05) / float(i+1);
  lines += line(vec2(p.x, p.y) * rot((0.5-extent)*PI*0.5)*b, 0.1) / float(i+1);

  draw += lines * color;
  // draw.r = min(draw.r, 0.5);
  // draw.g = min(draw.g, 0.5);
  */

  return draw;
}

void main(void){
  vec3 orb = orb();
  vec3 logo = logo();

  float alpha = 1.;
  if ( logo == vec3(0.) ) {
    orb = vec3(0.);
    /*
    alpha = 0.;
    */
  }

  gl_FragColor = vec4(orb, alpha);
}
