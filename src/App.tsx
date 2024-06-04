import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

function App(): JSX.Element {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [- 4, 3, 6]
      }}
    >
      <mesh>
        <boxGeometry></boxGeometry>
        <meshBasicMaterial color={'white'}></meshBasicMaterial>
      </mesh>
      <OrbitControls />
    </Canvas>
  )
}

export default App
