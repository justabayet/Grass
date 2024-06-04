import { MeshProps } from '@react-three/fiber'
import { DoubleSide } from 'three'
import TrianglePlaneGeometry from '../Components/TrianglePlaneGeometry'

function Blade({ ...props }: MeshProps): JSX.Element {

  return (
    <mesh {...props} >
      <TrianglePlaneGeometry />
      <meshBasicMaterial color="tomato" side={DoubleSide} wireframe />
    </mesh>
  )
}

export default Blade