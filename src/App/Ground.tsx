import { MeshProps } from '@react-three/fiber'

function Ground(props: MeshProps): JSX.Element {
  return (
    <mesh {...props} rotation={[- Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5, 5, 1, 1]} />
      <meshBasicMaterial color={'orange'} />
    </mesh>
  )
}

export default Ground
