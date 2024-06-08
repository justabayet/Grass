import { InstancedMeshProps, useFrame } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import { Vector3, Quaternion, Euler, CanvasTexture } from 'three'
import Grass from './Grass'

interface GrassDynamicProps extends InstancedMeshProps {
  size?: number
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

      const rotationFactor = (Math.random() - 0.5) * 1

      instances.push({
        translation: new Vector3(boundaries[0] + offsetWidth, 0, boundaries[2] + offsetHeight),
        rotation: new Quaternion().setFromEuler(new Euler(0, Math.PI * rotationFactor / 2, 0)),
        scale: new Vector3(1, 1, 1)
      })
    }
    return instances
  }, [boundaries, count])

  const [segments, setSegments] = useState<number>(3)

  useFrame(({ camera }) => {
    const distance = camera.position.distanceTo(new Vector3())
    const index = 3 - Math.floor(distance / 20)
    setSegments(Math.max(1, index))
  })

  return (
    <>
      {segments == 1 && <Grass instances={instances} groundSize={size} nbVSegments={1} textureInteractionX={textureInteractionX} textureInteractionY={textureInteractionY} {...props} />}
      {segments == 2 && <Grass instances={instances} groundSize={size} nbVSegments={2} textureInteractionX={textureInteractionX} textureInteractionY={textureInteractionY} {...props} />}
      {segments == 3 && <Grass instances={instances} groundSize={size} nbVSegments={3} textureInteractionX={textureInteractionX} textureInteractionY={textureInteractionY} {...props} />}
    </>
  )
}

export default GrassDynamic
