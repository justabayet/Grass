import { ThreeEvent } from '@react-three/fiber'
// import Ground from './Ground'
import GrassDynamic from './GrassDynamic'
import { Vector2 } from 'three'
import { useRef } from 'react'
import { useCanvasTexture } from '../hooks/useCanvasTexture'
import InteractionPanel from './InteractionPanel'
import { drawImageX, drawImageY } from '../utils/canvas'

function Experience(): JSX.Element {
  const groundSize = 20

  const previousPosition = useRef<Vector2 | null>(null)

  const { drawTrail: drawSwipeX, texture: textureSwipeX } = useCanvasTexture('canvas-swipe-x', { drawImage: drawImageX })
  const { drawTrail: drawSwipeY, texture: textureSwipeY } = useCanvasTexture('canvas-swipe-y', { x: 300, drawImage: drawImageY })

  return (
    <group position={[0, 0, 0]}>
      <GrassDynamic
        size={groundSize}
        textureInteractionX={textureSwipeX}
        textureInteractionY={textureSwipeY} />

      <InteractionPanel
        size={groundSize}
        position={[0, 1.3, 0]}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => {
          if (event.uv) {
            if (previousPosition.current != null) {
              drawSwipeX(previousPosition.current, event.uv)
              drawSwipeY(previousPosition.current, event.uv)
            }
            previousPosition.current = event.uv
          }
        }}
        onPointerOut={() => {
          previousPosition.current = null
        }} />

      {/* <Ground size={groundSize} /> */}
    </group>
  )
}

export default Experience