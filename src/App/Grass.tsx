import { InstancedMeshProps, ReactThreeFiber, useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { type InstancedMesh, Matrix4, Vector3, Quaternion, DoubleSide, ShaderMaterial, Color, RepeatWrapping, Texture, CanvasTexture } from 'three'
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
  uDisplacementTextureX: CanvasTexture
  uDisplacementTextureY: CanvasTexture
  uGroundSize: number
  sunInfluence: number
  sunIntensity: number
  sunColor: Color
  reflectionColor: Color
}

const defaultBaseColor = new Color(0.3, .0, 1.0)
const defaultTipColor = new Color(1.0, .7, 1.0)
const defaultSunColor = new Color(1.0, 1.0, 1.0)
const defaultReflectionColor = new Color(1.0, 1.0, 1.0)

const shaderDefault = {
  uTime: 0,
  uBaseColor: defaultBaseColor,
  uTipColor: defaultTipColor,
  uPerlinTexture: null,
  uDisplacementTextureX: null,
  uDisplacementTextureY: null,
  uGroundSize: 1,
  sunInfluence: 0.4,
  sunIntensity: 0,
  sunColor: defaultSunColor,
  reflectionColor: defaultReflectionColor
}

const GrassMaterial = shaderMaterial(
  shaderDefault,
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
  textureInteractionX: CanvasTexture
  textureInteractionY: CanvasTexture
  groundSize: number
  center: Vector3
}

// const daySetting = {
//   sunInfluence: 0.1,
//   sunIntensity: 0.2,
//   sunColor: new Color(0xFFFFFF),
//   reflectionColor: new Color(0xFFFFFF)
// }

// const nightSetting = {
//   sunInfluence: 0.2,
//   sunIntensity: 0.8,
//   sunColor: new Color(0x010048),
//   reflectionColor: new Color(0xFFFFFF)
// }

// function lerp(a: number, b: number, alpha: number) {
//   return a + alpha * (b - a)
// }

function Grass({ groundSize, textureInteractionX, textureInteractionY, instances, nbVSegments, center, ...props }: GrassProps): JSX.Element {
  const blades = useRef<InstancedMesh>(null)
  const grassMaterial = useRef<GrassMaterial>(null)
  const {
    baseColor,
    tipColor,
    // dayRatio,
    sunInfluence,
    sunColor,
    reflectionColor,
    sunIntensity
  } = useControls({
    baseColor: `#${defaultBaseColor.getHexString()}`,
    tipColor: `#${defaultTipColor.getHexString()}`,
    // dayRatio: {
    //   min: 0,
    //   max: 1,
    //   value: 0,
    // },
    sunInfluence: {
      min: 0,
      max: 1,
      value: shaderDefault.sunInfluence,
    },
    sunIntensity: {
      min: 0,
      max: 1,
      value: shaderDefault.sunIntensity,
    },
    sunColor: `#${shaderDefault.sunColor.getHexString()}`,
    reflectionColor: `#${shaderDefault.reflectionColor.getHexString()}`
  })


  // const sunInfluence = lerp(daySetting.sunInfluence, nightSetting.sunInfluence, dayRatio)
  // const sunIntensity = lerp(daySetting.sunIntensity, nightSetting.sunIntensity, dayRatio)
  // const sunColor = new Color(daySetting.sunColor).lerp(nightSetting.sunColor, dayRatio)
  // const reflectionColor = new Color(daySetting.reflectionColor).lerp(nightSetting.reflectionColor, dayRatio)

  const perlinTexture = useTexture('./perlin.png', (texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
  })

  const MIN_COUNT_FACTOR = 0.1

  const MIN_INSTANCES_COUNT = instances.length * MIN_COUNT_FACTOR
  const MAX_INSTANCES_COUNT = instances.length
  const RANGE_INTANCES = MAX_INSTANCES_COUNT - MIN_INSTANCES_COUNT

  const MIN_DISTANCE = 20
  const MAX_DISTANCE = 80
  const RANGE_DISTANCE = MAX_DISTANCE - MIN_DISTANCE

  useFrame(({ clock, camera }) => {
    if (grassMaterial.current != null) {
      grassMaterial.current.uTime = clock.elapsedTime
    }

    if (blades.current != null) {
      const distance = camera.position.distanceTo(center)

      let count: number
      if (distance < MIN_DISTANCE) {
        count = MAX_INSTANCES_COUNT
      } else if (distance > MAX_DISTANCE) {
        count = MIN_INSTANCES_COUNT
      } else {
        const currentRangeDistance = distance - MIN_DISTANCE
        const factor = 1 - (currentRangeDistance / RANGE_DISTANCE)
        count = MIN_INSTANCES_COUNT + RANGE_INTANCES * factor
      }

      blades.current.count = count
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
        uDisplacementTextureX={textureInteractionX}
        uDisplacementTextureY={textureInteractionY}
        uBaseColor={baseColor}
        uTipColor={tipColor}
        sunColor={sunColor}
        sunInfluence={sunInfluence}
        reflectionColor={reflectionColor}
        sunIntensity={sunIntensity}
        uGroundSize={groundSize} />
    </instancedMesh>
  )
}

export default Grass
