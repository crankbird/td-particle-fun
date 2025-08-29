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
// This is a starting/default position and not tied to the particle shape (circle/triangle/etc.)
const vec2 DEFAULT_PARTICLE_CENTER = vec2(QUAD_UV_CENTER, QUAD_UV_CENTER);
// Amplitude of horizontal oscillation in UV space
const float OSCILLATION_AMPLITUDE = 0.5;
// Frequency multiplier for oscillation
const float OSCILLATION_FREQUENCY = 4.0;

uniform float iTime;

out vec4 fragColor;

void main() {
    // TouchDesigner already provides normalized UV coordinates
    vec2 UV_Coords = vUV.xy;

    // Use mod to wrap iTime every 60 seconds to avoid precision issues with very large time values
    float x = QUAD_UV_CENTER + OSCILLATION_AMPLITUDE * sin(mod(iTime, 60.0) * OSCILLATION_FREQUENCY);
    float y = QUAD_UV_CENTER;
    vec2 Particle_Center = vec2(x, y);

    // distance from circle center
    float Distance_From_Center  = distance(UV_Coords, Particle_Center);

    // soft alpha mask for circle edge
    float Alpha_Value = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, Distance_From_Center);

    // final color
    fragColor = vec4(BASE_COLOR, Alpha_Value);
}