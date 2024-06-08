import { Vector2 } from 'three'

export const glowGreenImage = new Image()
glowGreenImage.src = './glow_green.png'

export const glowRedImage = new Image()
glowRedImage.src = './glow_red.png'

export function createCanvas(id: string, position = new Vector2(), isVisible = false) {
  let canvas = document.getElementById(id) as HTMLCanvasElement | null
  if(canvas != null) return canvas

  canvas = document.createElement('canvas')
  canvas.id = id
  canvas.width = 128
  canvas.height = 128

  if (!isVisible) return canvas

  document.body.appendChild(canvas)

  canvas.style.position = 'fixed'
  canvas.style.width = '256px'
  canvas.style.height = '256px'
  canvas.style.top = `${position.y}px`
  canvas.style.left = `${position.x}px`
  canvas.style.zIndex = '10'

  return canvas
}

export type DrawImageFn = ({
  pos,
  size,
  direction,
  context,
  image1,
  image2
}: {
  pos: Vector2,
  size: number,
  direction: Vector2,
  context: CanvasRenderingContext2D,
  image1: HTMLImageElement,
  image2: HTMLImageElement
}) => void

export const drawImageY: DrawImageFn = ({
  pos,
  size,
  direction,
  context,
  image1,
  image2
}) => {
  context.globalCompositeOperation = 'lighten'
  context.globalAlpha = Math.abs(direction.y) / 10
  context.drawImage(
    direction.y > 0 ? image1 : image2,
    (pos.x * context.canvas.width) - size / 2,
    ((1 - pos.y) * context.canvas.height) - size / 2,
    size,
    size
  )
}

export const drawImageX: DrawImageFn = ({
  pos,
  size,
  direction,
  context,
  image1,
  image2
}) => {
  context.globalCompositeOperation = 'lighten'
  context.globalAlpha = Math.abs(direction.x) / 10
  context.drawImage(
    direction.x > 0 ? image1 : image2,
    (pos.x * context.canvas.width) - size / 2,
    ((1 - pos.y) * context.canvas.height) - size / 2,
    size,
    size
  )
}