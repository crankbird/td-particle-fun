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

## On Naming Things

As Phil Karlton famously said:

> "There are only two hard things in Computer Science: cache invalidation and naming things."

Our conventions aim to reduce ambiguity while keeping names concise. When a name risks being overly verbose, prefer a shorter name with a clarifying comment. This balances readability with practicality, echoing Dijkstra’s principle that simplicity is a great virtue, but it requires hard work to achieve it.