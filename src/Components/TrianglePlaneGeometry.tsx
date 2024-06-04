import { useMemo } from 'react'

interface TrianglePlaneGeometryProps {
  width?: number
  height?: number
  nbVSegments?: number
}

function TrianglePlaneGeometry({
  width = 1,
  height = 2,
  nbVSegments = 3
}: TrianglePlaneGeometryProps): JSX.Element {
  if (nbVSegments < 1) throw new Error(`At least one segment is required: nbVSegments=${nbVSegments}`)

  const positions = useMemo(() => {
    return getVertices(width, height, nbVSegments)
  }, [width, height, nbVSegments])

  return (
    <bufferGeometry>
      <bufferAttribute
        attach='attributes-position'
        array={positions}
        count={positions.length / 3}
        itemSize={3}
      />
    </bufferGeometry>
  )
}

export default TrianglePlaneGeometry


function getVertices(width: number, height: number, nbVSegments: number): Float32Array {
  const vertices: number[] = []

  const nbLayers = nbVSegments - 1 // Remove tip

  const layerHeight = height / nbVSegments

  const xDifference = (width / 2) / nbVSegments

  const limitLeftBotX = - width / 2

  for (let vSegmentIndex = 0; vSegmentIndex < nbLayers; vSegmentIndex++) {
    const botY = vSegmentIndex * layerHeight
    const topY = botY + layerHeight

    const leftBotX = limitLeftBotX + xDifference * vSegmentIndex
    const leftTopX = limitLeftBotX + xDifference * (vSegmentIndex + 1)
    const rightBotX = -leftBotX
    const rightTopX = -leftTopX

    // Triangle 1
    //    bot left
    vertices.push(leftBotX)
    vertices.push(botY)
    vertices.push(0)
    //    top left
    vertices.push(leftTopX)
    vertices.push(topY)
    vertices.push(0)
    //    top right
    vertices.push(rightTopX)
    vertices.push(topY)
    vertices.push(0)

    // Triangle 2
    //    bot left
    vertices.push(leftBotX)
    vertices.push(botY)
    vertices.push(0)
    //    top right
    vertices.push(rightTopX)
    vertices.push(topY)
    vertices.push(0)
    //    bot right
    vertices.push(rightBotX)
    vertices.push(botY)
    vertices.push(0)
  }


  // Tip
  //    bot left
  vertices.push(- xDifference)
  vertices.push(height - layerHeight)
  vertices.push(0)
  //    bot right
  vertices.push(xDifference)
  vertices.push(height - layerHeight)
  vertices.push(0)
  //    top middle
  vertices.push(0)
  vertices.push(height)
  vertices.push(0)

  return new Float32Array(vertices)
}
