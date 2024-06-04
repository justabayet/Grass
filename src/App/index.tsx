import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Ground from './Ground'
import Grass from './Grass'
import { Perf } from 'r3f-perf'
import Blade from './Blade'

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
      <Grass boundaries={[-2, 2, -2, 2]} />

      <Blade position={[0, 0, 0]} />

      <Ground position={[0, 0, 0]} />
      <OrbitControls />

      <Perf position="top-left" />

      <axesHelper />
    </Canvas>
  )
}

export default App
