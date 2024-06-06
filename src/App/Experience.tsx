import { useMemo, useState } from 'react'
import { Vector3, Quaternion, Euler } from 'three'
import Grass from './Grass'
import { useFrame } from '@react-three/fiber'


function Experience(): JSX.Element {
  const size = 20

  const boundaries: [number, number, number, number] = useMemo(() => [-size / 2, size / 2, -size / 2, size / 2], [])
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
      {segments == 1 && <Grass instances={instances} nbVSegments={1} />}
      {segments == 2 && <Grass instances={instances} nbVSegments={2} />}
      {segments == 3 && <Grass instances={instances} nbVSegments={3} />}
    </>
  )
}

export default Experience