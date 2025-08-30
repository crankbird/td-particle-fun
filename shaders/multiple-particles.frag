/* AI-DIRECTIVE: TouchDesigner GLSL TOP Shader
 * Reference: https://docs.derivative.ca/Write_a_GLSL_TOP
 *
 * Rules for AI-generated code:
 * - This is a TouchDesigner GLSL TOP, not generic OpenGL/Shadertoy.
 * - Use vUV.xy as normalized coordinates in [0..1].
 * - Use fragColor for output (vec4 RGBA).
 * - Do NOT redeclare TD-provided structs/uniforms (uTDOutputInfo, vUV, etc.).
 * - Do NOT add a #version line, TouchDesigner injects it automatically.
 * - Add new uniforms (e.g. iTime) via TD's parameter system, not hardcoded.
 *
 * For detailed naming conventions and coding style, see CODING_STANDARDS.md in the project root.
 */

// constants

const float CIRCLE_RADIUS = 0.2;
const float EDGE_SOFTNESS = 0.04;
const vec3  BASE_COLOR    = vec3(1.0, 0.2, 0.4);

// Normalized midpoint of UV space for the quad ([0..1])
const float QUAD_UV_CENTER = 0.5;

// Default starting position for the particle center (in UV space)
const vec2 DEFAULT_PARTICLE_CENTER = vec2(QUAD_UV_CENTER, QUAD_UV_CENTER);

// Direction vectors for particle motion
const vec2 DIR_X  = vec2(1.0, 0.0);   // horizontal
const vec2 DIR_Y  = vec2(0.0, 1.0);   // vertical
const vec2 DIR_D1 = vec2(1.0, 1.0);   // diagonal ↘
const vec2 DIR_D2 = vec2(-1.0, 1.0);  // diagonal ↙

// Per-particle colors
const vec3 ParticleX_Color  = vec3(1.0, 0.2, 0.2); // red
const vec3 ParticleY_Color  = vec3(0.2, 0.8, 0.2); // soft green
const vec3 ParticleD1_Color = vec3(0.2, 0.2, 1.0); // blue
const vec3 ParticleD2_Color = vec3(1.0, 0.8, 0.2); // soft yellow

// Per-particle oscillation amplitude and frequency
const float AMP_X  = 0.4;
const float FREQ_X = 3.0;

const float AMP_Y  = 0.3;
const float FREQ_Y = 2.0;

const float AMP_D1  = 0.5;
const float FREQ_D1 = 4.0;

const float AMP_D2  = 0.6;
const float FREQ_D2 = 1.5;

// Global brightness scale for all particles (0 = invisible, 1 = maximum brightness)
const float PARTICLE_BRIGHTNESS = 0.5;

uniform float iTime;

out vec4 fragColor;

void main() {
    vec2 UV_Coords = vUV.xy;

    float timeMod = mod(iTime, 60.0);

    vec2 ParticleX_Center  = DEFAULT_PARTICLE_CENTER + DIR_X  * AMP_X  * sin(timeMod * FREQ_X);
    vec2 ParticleY_Center  = DEFAULT_PARTICLE_CENTER + DIR_Y  * AMP_Y  * sin(timeMod * FREQ_Y);
    vec2 ParticleD1_Center = DEFAULT_PARTICLE_CENTER + normalize(DIR_D1) * AMP_D1 * sin(timeMod * FREQ_D1);
    vec2 ParticleD2_Center = DEFAULT_PARTICLE_CENTER + normalize(DIR_D2) * AMP_D2 * sin(timeMod * FREQ_D2);

    float ParticleX_Alpha  = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, distance(UV_Coords, ParticleX_Center));
    float ParticleY_Alpha  = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, distance(UV_Coords, ParticleY_Center));
    float ParticleD1_Alpha = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, distance(UV_Coords, ParticleD1_Center));
    float ParticleD2_Alpha = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, distance(UV_Coords, ParticleD2_Center));

    vec3 Color = vec3(0.0);
    Color += PARTICLE_BRIGHTNESS * ParticleX_Color  * ParticleX_Alpha;
    Color += PARTICLE_BRIGHTNESS * ParticleY_Color  * ParticleY_Alpha;
    Color += PARTICLE_BRIGHTNESS * ParticleD1_Color * ParticleD1_Alpha;
    Color += PARTICLE_BRIGHTNESS * ParticleD2_Color * ParticleD2_Alpha;

    float Final_Alpha = max(max(ParticleX_Alpha, ParticleY_Alpha), max(ParticleD1_Alpha, ParticleD2_Alpha));
    fragColor = vec4(Color, Final_Alpha);
}