varying vec2 vUv;
uniform vec3 uBaseColor;
uniform vec3 uTipColor;

void main()
{
    gl_FragColor = vec4(mix(uBaseColor, uTipColor, vUv.y), 1.0);
    #include <colorspace_fragment>;
}