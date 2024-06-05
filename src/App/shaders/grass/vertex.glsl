varying vec2 vUv;

uniform float uTime;

float random(vec2 st)
{
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main()
{
  vec3 worldPosition = vec3(modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.));
  float uiqueOffset = random(worldPosition.xz) * 10.0;

  float oscillation = sin(uv.y + uTime + uiqueOffset) * uv.y / 5.0;

  vec4 newPos = vec4(position, 1.0);

  vec4 worldPos = modelMatrix * instanceMatrix * newPos;

  newPos.z += oscillation;

  vec4 instancePosition = instanceMatrix * newPos;

  vec4 modelPosition = modelMatrix * instancePosition;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  vUv = uv;
}