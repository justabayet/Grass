varying vec2 vUv;
varying float uRedExtra;

void main()
{
    gl_FragColor = vec4(1.0, (vUv.y * 0.6 + uRedExtra), 0.0, 1.0);
    #include <colorspace_fragment>;
}