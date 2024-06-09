import { InstancedMeshProps, useFrame } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import { Quaternion, Euler, CanvasTexture, Vector3 } from 'three'
import Grass from './Grass'

interface GrassDynamicProps extends InstancedMeshProps {
  size?: number
  position?: [number, number, number]
  textureInteractionX: CanvasTexture
  textureInteractionY: CanvasTexture
}

function GrassDynamic({ textureInteractionX, textureInteractionY, size = 5, ...props }: GrassDynamicProps): JSX.Element {
  const boundaries: [number, number, number, number] = useMemo(() => [-size / 2, size / 2, -size / 2, size / 2], [size])
  const count = 10 * 1000

  const instances = useMemo(() => {
    const instances = []
    const width = boundaries[1] - boundaries[0]
    const height = boundaries[3] - boundaries[2]

    for (let i = 0; i < count; i++) {

      const offsetWidth = Math.random() * width
      const offsetHeight = Math.random() * height

      const rotationFactor = (Math.random() - 0.5) * 1.5

      instances.push({
        translation: new Vector3(boundaries[0] + offsetWidth, 0, boundaries[2] + offsetHeight),
        rotation: new Quaternion().setFromEuler(new Euler(0, Math.PI * rotationFactor / 2, 0)),
        scale: new Vector3(1, 1, 1)
      })
    }
    return instances
  }, [boundaries, count])

  const [distanceTier, setDistanceTier] = useState<number>(3)

  const center = useMemo(() => {
    return props.position ? new Vector3(...props.position) : new Vector3()
  }, [props.position])

  useFrame(({ camera }) => {
    const distance = camera.position.distanceTo(center)
    const index = Math.floor(distance / 20)
    setDistanceTier(Math.max(1, Math.min(3, index)))
  })

  const sharedParams = useMemo(() => {
    return {
      groundSize: size,
      textureInteractionX: textureInteractionX,
      textureInteractionY: textureInteractionY,
      center
    }
  }, [size, textureInteractionX, textureInteractionY, center])

  return (
    <>
      {distanceTier == 3 && <Grass instances={instances} nbVSegments={1} {...sharedParams} {...props} />}
      {distanceTier == 2 && <Grass instances={instances} nbVSegments={2} {...sharedParams} {...props} />}
      {distanceTier == 1 && <Grass instances={instances} nbVSegments={3} {...sharedParams} {...props} />}
    </>
  )
}

export default GrassDynamic
