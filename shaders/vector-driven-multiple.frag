

/* AI-DIRECTIVE: TouchDesigner GLSL TOP Shader
 * Reference: https://docs.derivative.ca/Write_a_GLSL_TOP
 *
 * Rules:
 * - This is a TouchDesigner GLSL TOP, not generic OpenGL/Shadertoy.
 * - Use vUV.xy as normalized coordinates in [0..1].
 * - Use fragColor for output (vec4 RGBA).
 * - Do NOT redeclare TD-provided structs/uniforms (uTDOutputInfo, vUV, etc.).
 * - Do NOT add a #version line, TouchDesigner injects it automatically.
 * - New uniforms (iAmpX, iFreqX, iColorX, etc.) should be passed via TD's Vectors tab.
 */

// === Defaults (fallbacks) ===
const float AMP_X_DEFAULT  = 0.4;
const float FREQ_X_DEFAULT = 3.0;

const float AMP_Y_DEFAULT  = 0.3;
const float FREQ_Y_DEFAULT = 2.0;

const float AMP_D1_DEFAULT  = 0.5;
const float FREQ_D1_DEFAULT = 4.0;

const float AMP_D2_DEFAULT  = 0.6;
const float FREQ_D2_DEFAULT = 1.5;

const float PARTICLE_BRIGHTNESS_DEFAULT = 0.5;
const float CIRCLE_RADIUS  = 0.25;
const float EDGE_SOFTNESS  = 0.04;

const vec2 DEFAULT_PARTICLE_CENTER = vec2(0.5, 0.5);

// Direction vectors
const vec2 DIR_X  = vec2(1.0, 0.0);
const vec2 DIR_Y  = vec2(0.0, 1.0);
const vec2 DIR_D1 = vec2(1.0, 1.0);
const vec2 DIR_D2 = vec2(-1.0, 1.0);

// === Uniforms (controllable via TD) ===
uniform float iAmpX;
uniform float iFreqX;
uniform vec3  iColorX;

uniform float iAmpY;
uniform float iFreqY;
uniform vec3  iColorY;

uniform float iAmpD1;
uniform float iFreqD1;
uniform vec3  iColorD1;

uniform float iAmpD2;
uniform float iFreqD2;
uniform vec3  iColorD2;

uniform float iBrightness;
uniform float iTime;

out vec4 fragColor;

void main() {
    vec2 UV_Coords = vUV.xy;
    float timeMod = mod(iTime, 60.0);

    // Resolve parameters with fallbacks
    float AmpX = (iAmpX > 0.0) ? iAmpX : AMP_X_DEFAULT;
    float FreqX = (iFreqX > 0.0) ? iFreqX : FREQ_X_DEFAULT;
    vec3 ColorX = (iColorX != vec3(0.0)) ? iColorX : vec3(1.0, 0.2, 0.2);

    float AmpY = (iAmpY > 0.0) ? iAmpY : AMP_Y_DEFAULT;
    float FreqY = (iFreqY > 0.0) ? iFreqY : FREQ_Y_DEFAULT;
    vec3 ColorY = (iColorY != vec3(0.0)) ? iColorY : vec3(0.2, 1.0, 0.2);

    float AmpD1 = (iAmpD1 > 0.0) ? iAmpD1 : AMP_D1_DEFAULT;
    float FreqD1 = (iFreqD1 > 0.0) ? iFreqD1 : FREQ_D1_DEFAULT;
    vec3 ColorD1 = (iColorD1 != vec3(0.0)) ? iColorD1 : vec3(0.2, 0.2, 1.0);

    float AmpD2 = (iAmpD2 > 0.0) ? iAmpD2 : AMP_D2_DEFAULT;
    float FreqD2 = (iFreqD2 > 0.0) ? iFreqD2 : FREQ_D2_DEFAULT;
    vec3 ColorD2 = (iColorD2 != vec3(0.0)) ? iColorD2 : vec3(1.0, 1.0, 0.2);

    float Brightness = (iBrightness > 0.0) ? iBrightness : PARTICLE_BRIGHTNESS_DEFAULT;

    // Particle centers
    vec2 ParticleX_Center  = DEFAULT_PARTICLE_CENTER + DIR_X  * AmpX  * sin(timeMod * FreqX);
    vec2 ParticleY_Center  = DEFAULT_PARTICLE_CENTER + DIR_Y  * AmpY  * sin(timeMod * FreqY);
    vec2 ParticleD1_Center = DEFAULT_PARTICLE_CENTER + normalize(DIR_D1) * AmpD1 * sin(timeMod * FreqD1);
    vec2 ParticleD2_Center = DEFAULT_PARTICLE_CENTER + normalize(DIR_D2) * AmpD2 * sin(timeMod * FreqD2);

    // Alphas
    float ParticleX_Alpha  = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, distance(UV_Coords, ParticleX_Center));
    float ParticleY_Alpha  = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, distance(UV_Coords, ParticleY_Center));
    float ParticleD1_Alpha = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, distance(UV_Coords, ParticleD1_Center));
    float ParticleD2_Alpha = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, distance(UV_Coords, ParticleD2_Center));

    // Final color
    vec3 Color = vec3(0.0);
    Color += Brightness * ColorX  * ParticleX_Alpha;
    Color += Brightness * ColorY  * ParticleY_Alpha;
    Color += Brightness * ColorD1 * ParticleD1_Alpha;
    Color += Brightness * ColorD2 * ParticleD2_Alpha;

    float Final_Alpha = max(max(ParticleX_Alpha, ParticleY_Alpha), max(ParticleD1_Alpha, ParticleD2_Alpha));
    fragColor = vec4(Color, Final_Alpha);
}