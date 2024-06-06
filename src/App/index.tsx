import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Grass from './Grass'
// import { Perf } from 'r3f-perf'

function App(): JSX.Element {
  const size = 20
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [- 4, 3, 6]
      }} >

      <Grass boundaries={[-size / 2, size / 2, -size / 2, size / 2]} count={10 * 1000} />

      {/* <Ground position={[0, 0, 0]} /> */}
      <OrbitControls />

      {/* <Perf position="top-left" /> */}
    </Canvas>
  )
}

export default App
