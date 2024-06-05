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

  const { positions, normals, indices, uvs } = useMemo(() => {
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
      <bufferAttribute
        attach='attributes-normal'
        array={normals}
        count={normals.length / 3}
        itemSize={3}
      />
      <bufferAttribute
        attach='index'
        array={indices}
        count={indices.length}
        itemSize={1}
      />
      <bufferAttribute
        attach='attributes-uv'
        array={uvs}
        count={uvs.length / 2}
        itemSize={2}
      />
    </bufferGeometry>
  )
}

export default TrianglePlaneGeometry


function getVertices(
  width: number,
  height: number,
  nbVSegments: number
): {
  positions: Float32Array,
  normals: Float32Array,
  indices: Uint16Array,
  uvs: Float32Array
} {
  const positions: number[] = []

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
    positions.push(leftBotX)
    positions.push(botY)
    positions.push(0)
    //    bot right
    positions.push(rightBotX)
    positions.push(botY)
    positions.push(0)
    //    top right
    positions.push(rightTopX)
    positions.push(topY)
    positions.push(0)

    // Triangle 2
    //    bot left
    positions.push(leftBotX)
    positions.push(botY)
    positions.push(0)
    //    top right
    positions.push(rightTopX)
    positions.push(topY)
    positions.push(0)
    //    top left
    positions.push(leftTopX)
    positions.push(topY)
    positions.push(0)
  }

  // Tip
  //    bot left
  positions.push(- xDifference)
  positions.push(height - layerHeight)
  positions.push(0)
  //    bot right
  positions.push(xDifference)
  positions.push(height - layerHeight)
  positions.push(0)
  //    top middle
  positions.push(0)
  positions.push(height)
  positions.push(0)

  const newPositions: number[] = []
  const uvs: number[] = []
  const indicesDic: { [id: string]: number } = {}
  const indices: number[] = []

  for (let i = 0; i < positions.length / 3; i++) {
    const i1 = i * 3
    const i2 = i1 + 1
    const i3 = i1 + 2

    const x = positions[i1]
    const y = positions[i2]
    const z = positions[i3]

    const id = `${x.toFixed(3)}:${y.toFixed(3)}:${z.toFixed(3)}`

    if (!(id in indicesDic)) {
      const newIndex = newPositions.length / 3

      newPositions.push(x, y, z)
      uvs.push((x / width) + 0.5, y / height)

      indicesDic[id] = newIndex
    }

    indices.push(indicesDic[id])
  }

  const normals = (new Array(newPositions.length))
    .fill(0)
    .map((_, index) => {
      if ((index + 1) % 3 === 0) return 1
      return 0
    })

  return {
    positions: new Float32Array(newPositions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
    uvs: new Float32Array(uvs),
  }
}
