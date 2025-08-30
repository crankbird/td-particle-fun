# Shader Coding Standards

## General Rules

- This project uses TouchDesigner GLSL TOP shaders, not generic OpenGL or Shadertoy shaders.
- Use `vUV.xy` as normalized coordinates in the range [0..1].
- Output colors using `fragColor` (a `vec4` representing RGBA).
- Do **NOT** redeclare TouchDesigner-provided structs or uniforms (e.g., `uTDOutputInfo`, `vUV`).
- Do **NOT** add a `#version` line; TouchDesigner injects it automatically.
- Add new uniforms (e.g., `iTime`) via TouchDesigner’s parameter system, not hardcoded in the shader.

## Naming Conventions

To maintain consistency and clarity, follow these conventions:

### Uniforms

- `u*` : Reserved for TouchDesigner-provided system uniforms.  
  **Example:** `uniform vec2 uTDOutputInfo;`

- `i*` : Custom uniforms provided via TouchDesigner’s GLSL TOP parameter system (usually from the Vectors tab).  
  **Example:** `uniform float iTime;`

### Varyings

- `v*` : Varyings provided by TouchDesigner.  
  **Example:** `vec2 UV_Coords = vUV.xy;`

### Fragment Outputs

- `frag*` : Reserved for fragment shader outputs only.  
  **Example:** `out vec4 fragColor;`

### Constants

- `ALL_CAPS` : Constants defined in the shader.  
  **Example:**  
  ```glsl
  const float CIRCLE_RADIUS = 0.2;
  const vec3 BASE_COLOR = vec3(1.0, 0.2, 0.4);
  ```

- `DIR_*` : Constants for direction vectors, used to indicate particle motion axes or arbitrary directions.  
  **Examples:**  
  ```glsl
  const vec2 DIR_X  = vec2(1.0, 0.0);   // Horizontal axis
  const vec2 DIR_Y  = vec2(0.0, 1.0);   // Vertical axis
  const vec2 DIR_D1 = vec2(1.0, 1.0);   // Diagonal (↘)
  const vec2 DIR_D2 = vec2(-1.0, 1.0);  // Diagonal (↙)
  ```
  > **Note:** `DIR_*` constants are **generic direction vectors** and are not tied to a specific particle.  
  Use them as building blocks (e.g., `DIR_X`, `DIR_Y`, diagonals) to define particle motion,  
  but do not rename them to `ParticleX_Dir` or similar. Per-particle attributes should follow  
  the `ParticleX_*` naming style instead (e.g., `ParticleX_Center`, `ParticleX_Color`).

- **Per-Particle Constants**  
  - `AMP_*` : Oscillation amplitude constants per particle.  
    **Example:** `const float AMP_X = 0.4;`

  - `FREQ_*` : Oscillation frequency constants per particle.  
    **Example:** `const float FREQ_Y = 2.0;`

  - `COLOR_*` : RGB color constants per particle.  
    **Example:** `const vec3 COLOR_D1 = vec3(0.2, 0.2, 1.0);`

  - `RADIUS_*` : Particle radius constants (for different particle sizes).  
    **Example:** `const float RADIUS_SMALL = 0.1;`

  - `SOFTNESS_*` : Edge softness constants for particle masks.  
    **Example:** `const float SOFTNESS_DEFAULT = 0.02;`

  - `PHASE_*` : Phase offset constants for oscillation, useful for staggering particle motion.  
    **Example:** `const float PHASE_ALT = 1.57; // ~π/2`

### Local Variables

- Use descriptive names with InitialCapital and underscores separating semantic elements for clarity.  
- Shorthand exceptions for common math variables: `x`, `y`, and `uv`.

**Examples:**

```glsl
vec2 Particle_Center = vec2(0.5, 0.5);
float Distance_From_Center = distance(UV_Coords, Particle_Center);
float Alpha_Value = smoothstep(CIRCLE_RADIUS, CIRCLE_RADIUS - EDGE_SOFTNESS, Distance_From_Center);
```

Shorthand:

```glsl
float x = 0.5;
float y = 0.5;
vec2 uv = vUV.xy;
```

### Subject–Attribute Naming

For entities with multiple related properties (such as particles), treat the entity name as the **subject** and append attributes as suffixes.  
This avoids ambiguity and keeps code self-explanatory.

**Examples:**
```glsl
vec2  ParticleX_Center = DEFAULT_PARTICLE_CENTER + DIR_X * AMP_X * sin(iTime);
float ParticleX_Alpha  = smoothstep(RADIUS_DEFAULT, RADIUS_DEFAULT - SOFTNESS_DEFAULT, distance(UV_Coords, ParticleX_Center));
vec3  ParticleX_Color  = vec3(1.0, 0.0, 0.0);
```

## On Naming Things

As Phil Karlton famously said:

> "There are only two hard things in Computer Science: cache invalidation and naming things."

Our conventions aim to reduce ambiguity while keeping names concise. When a name risks being overly verbose, prefer a shorter name with a clarifying comment. This balances readability with practicality, echoing Dijkstra’s principle that simplicity is a great virtue, but it requires hard work to achieve it.