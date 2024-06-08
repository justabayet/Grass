uniform float uTime;
uniform sampler2D uPerlinTexture;
uniform sampler2D uDisplacementTextureX;
uniform sampler2D uDisplacementTextureY;
uniform float uGroundSize;

varying vec2 vUv;
varying float vOscillation;
varying vec2 vGroundUv;

void main()
{
  mat4 modelInstanceMatrix = modelMatrix * instanceMatrix;
  vec3 worldPosition = vec3(modelInstanceMatrix * vec4(0., 0., 0., 1.));

  float perlinValue = texture(uPerlinTexture, (worldPosition.xz + uTime) / 50.0).r; // [0;0.5]
  float uniqueOffset = (perlinValue - 0.25) * 2.0; // [-0.5;0.5]

  float oscillation = uniqueOffset * pow(uv.y, 2.0); // [-0.5;0.5]

  vec4 newPos = vec4(position, 1.0);
  newPos.z += -oscillation;

  vGroundUv = ((instanceMatrix * vec4(0., 0., 0., 1.)).xz + (uGroundSize / 2.0)) / uGroundSize;
  vGroundUv.y = 1.0 - vGroundUv.y; // [0; 1]

  vec4 swipeX = texture(uDisplacementTextureX, vGroundUv); // [0; 1]
  float forceX = swipeX.g - swipeX.r; // [-1; 1]

  vec4 swipeY = texture(uDisplacementTextureY, vGroundUv); // [0; 1]
  float forceY = swipeY.g - swipeY.r; // [-1; 1]

  newPos.x += forceX * uv.y;
  newPos.z -= forceY * uv.y;

  oscillation = clamp(forceY + uniqueOffset, -0.5, 0.5) * pow(uv.y, 2.0);

  vec4 modelPosition = modelInstanceMatrix * newPos;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  vOscillation = oscillation;
}