import { InstancedMeshProps, ReactThreeFiber, useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { type InstancedMesh, Matrix4, Vector3, Quaternion, DoubleSide, ShaderMaterial, Color, RepeatWrapping, Texture } from 'three'
import TrianglePlaneGeometry from '../Components/TrianglePlaneGeometry'
import { extend } from '@react-three/fiber'

import grassVertexShader from './shaders/grass/vertex.glsl'
import grassFragmentShader from './shaders/grass/fragment.glsl'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { useControls } from 'leva'

interface GrassMaterial extends ShaderMaterial {
  uTime: number
  uBaseColor: Color
  uTipColor: Color
  uPerlinTexture: Texture
}

const defaultBaseColor = new Color(0.3, .0, 1.0)
const defaultTipColor = new Color(1.0, .7, 1.0)

const GrassMaterial = shaderMaterial(
  {
    uTime: 0,
    uBaseColor: defaultBaseColor,
    uTipColor: defaultTipColor,
    uPerlinTexture: null
  },
  grassVertexShader,
  grassFragmentShader
)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      grassMaterial: ReactThreeFiber.Object3DNode<GrassMaterial, typeof GrassMaterial>
    }
  }
}

extend({ GrassMaterial })

interface GrassProps extends InstancedMeshProps {
  instances: {
    translation: Vector3
    rotation: Quaternion
    scale: Vector3
  }[]
  nbVSegments: number
}

function Grass({ instances, nbVSegments, ...props }: GrassProps): JSX.Element {
  const blades = useRef<InstancedMesh>(null)
  const grassMaterial = useRef<GrassMaterial>(null)
  const { baseColor, tipColor } = useControls({
    baseColor: `#${defaultBaseColor.getHexString()}`,
    tipColor: `#${defaultTipColor.getHexString()}`
  })

  const perlinTexture = useTexture('./perlin.png', (texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
  })

  useFrame(({ clock }) => {
    if (grassMaterial.current != null) {
      grassMaterial.current.uTime = clock.elapsedTime
    }
  })

  useLayoutEffect(() => {
    let i = 0
    for (const { translation, rotation, scale } of instances) {
      const matrix = new Matrix4()

      matrix.compose(translation, rotation, scale)
      blades.current!.setMatrixAt(i, matrix)

      i++
    }
  }, [instances])

  return (
    <instancedMesh {...props} ref={blades} args={[undefined, undefined, instances.length]}>
      <TrianglePlaneGeometry nbVSegments={nbVSegments} />
      <grassMaterial
        ref={grassMaterial}
        side={DoubleSide}
        uPerlinTexture={perlinTexture}
        uBaseColor={baseColor}
        uTipColor={tipColor} />
    </instancedMesh>
  )
}

export default Grass
