/*
 * AI-DIRECTIVE: TouchDesigner GLSL TOP Shader
 * Reference: https://docs.derivative.ca/Write_a_GLSL_TOP
 *
 * Rules for AI-generated code:
 * - This is a TouchDesigner GLSL TOP, not generic OpenGL/Shadertoy.
 * - Use vUV.xy as normalized coordinates in [0..1].
 * - Use fragColor for output (vec4 RGBA).
 * - Do NOT redeclare TD-provided structs/uniforms (uTDOutputInfo, vUV, etc.).
 * - Do NOT add a #version line, TouchDesigner injects it automatically.
 * - Add new uniforms (e.g. iTime) via TD's parameter system, not hardcoded.
 */
// constants
const vec2  CIRCLE_CENTER = vec2(0.5, 0.5);
const float CIRCLE_RADIUS = 0.2;
const float EDGE_SOFTNESS = 0.04;
const vec3  BASE_COLOR    = vec3(1.0, 0.2, 0.4);

out vec4 fragColor;

void main() {
    // TouchDesigner already provides normalized UV coordinates
    vec2 uv = vUV.xy;

    // distance from circle center
    float dist  = distance(uv, CIRCLE_CENTER);

    // soft alpha mask for circle edge
    float alpha = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, dist);

    // final color
    fragColor = vec4(BASE_COLOR, alpha);
}