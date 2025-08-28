/*
 * TouchDesigner Shader Integration Notes:
 *
 * - TouchDesigner exposes output resolution and other info via the `uTDOutputInfo` struct.
 * - Output resolution is available as `uTDOutputInfo.res.z` (width) and `uTDOutputInfo.res.w` (height).
 * - Do NOT redeclare `uTDOutputInfo` or add a `#version` line—TouchDesigner injects these automatically.
 */
// constants
const vec2  CIRCLE_CENTER = vec2(0.5, 0.5);
const float CIRCLE_RADIUS = 0.2;
const float EDGE_SOFTNESS = 0.01;
const vec3  BASE_COLOR    = vec3(1.0, 0.8, 0.2);

out vec4 fragColor;

void main() {
    // normalize fragment coords (0..1 across the output)
    vec2 uv = gl_FragCoord.xy / vec2(uTDOutputInfo.res.z, uTDOutputInfo.res.w);

    // distance from circle center
    float dist  = distance(uv, CIRCLE_CENTER);

    // soft alpha mask for circle edge
    float alpha = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, dist);

    // final color
    fragColor = vec4(BASE_COLOR, alpha);
}