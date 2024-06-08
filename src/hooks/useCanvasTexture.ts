import { useCallback, useEffect, useMemo } from 'react'
import { CanvasTexture, Vector2 } from 'three'
import { DrawImageFn, createCanvas, glowGreenImage, glowRedImage } from '../utils/canvas'

const DEFAULT_COLOR = '#000000'
const DIST_INTERPOLATION = 0.01

interface CanvasProviderProps {
  x?: number
  drawImage: DrawImageFn
  isVisible?: boolean
}

export const useCanvasTexture = (id: string, { x = 0, drawImage, isVisible = false }: CanvasProviderProps) => {
  const canvas = useMemo(() => createCanvas(id, new Vector2(x, 0), isVisible), [id, x, isVisible]) 
  const texture = useMemo(() => new CanvasTexture(canvas), [canvas])

  const drawTrail = useCallback((origin: Vector2, destination: Vector2) => {
    const context = canvas.getContext('2d')
    if (context == null) {
      console.log('context is null')
      return
    }

    const size = 40

    const dist = origin.distanceTo(destination)
    const direction = (destination.clone().sub(origin))
    const factor = Math.abs(direction.x) + Math.abs(direction.y)
    direction.multiplyScalar(1 / factor) // [-1;1]

    const drawImageInternal = (pos: Vector2) => {
      drawImage({
        pos,
        size,
        direction,
        context,
        image1: glowGreenImage,
        image2: glowRedImage
      })
    }

    const nbSteps = Math.floor(dist / DIST_INTERPOLATION)
    for (let i = 1; i < nbSteps; i++) {
      const step = 1 / nbSteps
      const interPos = origin.clone().lerp(destination, step * i)
      drawImageInternal(interPos)
    }
    drawImageInternal(destination)
  }, [canvas, drawImage])

  const draw = useCallback(() => {
    const context = canvas.getContext('2d')
    if (context == null) {
      console.log('context is null')
      return
    }

    context.globalCompositeOperation = 'source-over'
    context.fillStyle = DEFAULT_COLOR
    context.globalAlpha = 0.05
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    if (texture != null) texture.needsUpdate = true
  }, [texture, canvas])

  useEffect(() => {
    const context = canvas.getContext('2d')

    if (context != null) {
      let animationFrameId: number
      
      context.fillStyle = DEFAULT_COLOR
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)

      const render = () => {
        draw()
        animationFrameId = window.requestAnimationFrame(render)
      }

      render()
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [draw, texture, canvas])

  return {
    texture,
    drawTrail
  }
}
