import { InstancedMeshProps, ReactThreeFiber, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { type InstancedMesh, Matrix4, Vector3, Quaternion, DoubleSide, ShaderMaterial, } from 'three'
import TrianglePlaneGeometry from '../Components/TrianglePlaneGeometry'
import { extend } from '@react-three/fiber'

import grassVertexShader from './shaders/grass/vertex.glsl'
import grassFragmentShader from './shaders/grass/fragment.glsl'
import { shaderMaterial } from '@react-three/drei'

interface GrassMaterial extends ShaderMaterial {
  uTime: number
}

const GrassMaterial = shaderMaterial(
  {
    uTime: 0
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
  boundaries: [number, number, number, number]
  count?: number
}

function Grass({ boundaries, count = 100, ...props }: GrassProps): JSX.Element {
  const blades = useRef<InstancedMesh>(null)
  const grassMaterial = useRef<GrassMaterial>(null)

  useFrame((_, delta) => {
    if (grassMaterial.current != null) {
      grassMaterial.current.uTime += delta
    }
  })

  useEffect(() => {
    const width = boundaries[1] - boundaries[0]
    const height = boundaries[3] - boundaries[2]

    for (let i = 0; i < count; i++) {
      const matrix = new Matrix4()

      const offsetWidth = Math.random() * width
      const offsetHeight = Math.random() * height

      matrix.compose(
        new Vector3(boundaries[0] + offsetWidth, 0, boundaries[2] + offsetHeight),
        new Quaternion(),
        new Vector3(1, 1, 1)
      )
      blades.current!.setMatrixAt(i, matrix)
    }
  }, [boundaries, count])

  return (
    <instancedMesh {...props} ref={blades} args={[undefined, undefined, count]}>
      <TrianglePlaneGeometry nbVSegments={3} />
      <grassMaterial
        ref={grassMaterial}
        side={DoubleSide} />
    </instancedMesh>
  )
}

export default Grass
