uniform vec3 uBaseColor;
uniform vec3 uTipColor;
varying vec2 vUv;
varying float vOscillation;

void main()
{
    vec3 color = mix(uBaseColor, uTipColor, vUv.y * vUv.y);

    float mixOscillation = (vOscillation + 0.5) * 0.8; // [0;0.8]
    gl_FragColor = vec4(color, 1.0 - mixOscillation);
    #include <colorspace_fragment>;
}