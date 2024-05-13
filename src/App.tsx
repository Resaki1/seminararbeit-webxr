import { ARButton, XR } from "@react-three/xr";
import "./App.css";
import { Canvas } from "@react-three/fiber";

function App() {
  return (
    <>
      <ARButton />
      <Canvas>
        <XR>
          <mesh position={[0, 0, -2]}>
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}

export default App;
