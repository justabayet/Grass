import { MeshProps } from '@react-three/fiber'

interface InteractionPanelProps extends MeshProps {
  size?: number
}

function InteractionPanel({ size = 5, ...props }: InteractionPanelProps): JSX.Element {
  return (
    <mesh {...props} rotation={[- Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size, 1, 1]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

export default InteractionPanel
