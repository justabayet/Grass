varying vec2 vUv;
varying float uRedExtra;

uniform float uTime;
uniform vec3 uIntersection;
uniform float uHasIntersection;

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

  if(uHasIntersection > 0.5) {
    vec4 testWorldPos = modelMatrix * instancePosition;

    vec3 offsetMousePush = (uIntersection - testWorldPos.xyz) / 5.0;
    float dist = length(offsetMousePush);

    float shouldOffset = 1.0 - step(dist, 0.05);
    float newY = remap(dist - 0.01, 0.0, 0.05, 0.0, 1.0);
    instancePosition.y *= newY / pow(newY, shouldOffset);
  }

  vec4 modelPosition = modelMatrix * instancePosition;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  vUv = uv;

  float redExtra = 0.0;
  if(uHasIntersection > 0.5) {
      redExtra = 0.3 - clamp(distance(modelPosition.xyz, uIntersection) * 2.0, 0.0, 0.3);
  }
  uRedExtra = redExtra;
}