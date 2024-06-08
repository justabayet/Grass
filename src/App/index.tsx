import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
// import { Perf } from 'r3f-perf'
import Experience from './Experience'

function App(): JSX.Element {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-10, 6, 6]
      }} >
      <Experience />
      <OrbitControls maxPolarAngle={(Math.PI / 2) - Math.PI / 20} />

      {/* <Perf position="top-left" /> */}
    </Canvas>
  )
}

export default App
