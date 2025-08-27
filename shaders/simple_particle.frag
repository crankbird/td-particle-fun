// simple_particle.frag
// GLSL fragment shader for a single circle particle

void main() {
    vec2 uv = gl_FragCoord.xy / vec2(RESOLUTION.xy);
    vec2 center = vec2(0.5, 0.5);
    float radius = 0.2;
    float dist = distance(uv, center);
    float alpha = smoothstep(radius, radius - 0.01, dist);
    gl_FragColor = vec4(1.0, 0.8, 0.2, alpha);
}
