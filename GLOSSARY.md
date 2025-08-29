# Shader Glossary

## Quad
- A rectangle made of two triangles, used as the canvas for shaders.
- In TouchDesigner GLSL TOPs, the quad represents the entire TOP texture.
- UV coordinates are normalized over this quad ([0,0] bottom-left, [1,1] top-right).
- Analogy: Like a projector screen onto which your shader paints.

## UV Coordinates
- Normalized 2D coordinates (u,v) used to address texels in a texture.
- Range: [0,1] in both axes, regardless of actual texture resolution.
- Analogy: Like percentages — 0.5,0.5 is the exact middle.

## Fragment
- A "potential pixel" generated during rasterization.
- Each fragment runs the fragment shader to determine its final color.
- Not every fragment becomes a pixel (discard, depth test, blending).
