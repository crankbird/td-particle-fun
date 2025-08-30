

/* AI-DIRECTIVE: TouchDesigner GLSL TOP Shader
 * Reference: https://docs.derivative.ca/Write_a_GLSL_TOP
 *
 * Rules:
 * - This is a TouchDesigner GLSL TOP, not generic OpenGL/Shadertoy.
 * - Use vUV.xy as normalized coordinates in [0..1].
 * - Use fragColor for output (vec4 RGBA).
 * - Do NOT redeclare TD-provided structs/uniforms (uTDOutputInfo, vUV, etc.).
 * - Do NOT add a #version line, TouchDesigner injects it automatically.
 * - New uniforms (iAmpX, iFreqX, iBrightness, etc.) should be passed via TD's Vectors tab.
 */

// === Defaults (fallbacks) ===
const float AMP_X_DEFAULT  = 0.4;
const float FREQ_X_DEFAULT = 3.0;
const float PARTICLE_BRIGHTNESS_DEFAULT = 0.5;

const float CIRCLE_RADIUS = 0.25;
const float EDGE_SOFTNESS = 0.04;

const vec2 DEFAULT_PARTICLE_CENTER = vec2(0.5, 0.5);
const vec2 DIR_X = vec2(1.0, 0.0);

const vec3 PARTICLE_COLOR = vec3(1.0, 0.8, 0.2); // yellow-orange

// === Uniforms (controllable via TD) ===
uniform float iAmpX;
uniform float iFreqX;
uniform float iBrightness;
uniform float iTime;

out vec4 fragColor;

void main() {
    vec2 UV_Coords = vUV.xy;
    float timeMod = mod(iTime, 60.0);

    // Use uniforms if > 0, otherwise fallback to defaults
    float AmpX = (iAmpX > 0.0) ? iAmpX : AMP_X_DEFAULT;
    float FreqX = (iFreqX > 0.0) ? iFreqX : FREQ_X_DEFAULT;
    float Brightness = (iBrightness > 0.0) ? iBrightness : PARTICLE_BRIGHTNESS_DEFAULT;

    // Particle position
    vec2 Particle_Center = DEFAULT_PARTICLE_CENTER + DIR_X * AmpX * sin(timeMod * FreqX);

    // Alpha mask for circle
    float Particle_Alpha = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, distance(UV_Coords, Particle_Center));

    // Color output
    vec3 Color = Brightness * PARTICLE_COLOR * Particle_Alpha;
    fragColor = vec4(Color, Particle_Alpha);
}