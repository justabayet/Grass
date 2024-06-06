uniform sampler2D uPerlinTexture;
uniform float uTime;

varying vec2 vUv;
varying float vOscillation;

void main()
{
  mat4 modelInstanceMatrix = modelMatrix * instanceMatrix;
  vec3 worldPosition = vec3(modelInstanceMatrix * vec4(0., 0., 0., 1.));

  float perlinValue = texture(uPerlinTexture, (worldPosition.xz + uTime) / 50.0).r; // [0;0.5]
  float uiqueOffset = (perlinValue - 0.25) * 2.0; // [-0.5;0.5]

  float oscillation = uiqueOffset * pow(uv.y, 2.0);

  vec4 newPos = vec4(position, 1.0);
  newPos.z += -oscillation;

  vec4 modelPosition = modelInstanceMatrix * newPos;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  vOscillation = oscillation;
}