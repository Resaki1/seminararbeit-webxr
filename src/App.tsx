import { useEffect, useRef, useState } from "react";
import { ARButton, XR } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import "./App.css";

function App() {
  const overlayRef = useRef<HTMLDivElement>(null!);
  const [isOverlayReady, setIsOverlayReady] = useState(false);

  const placeObject = () => {
    console.log("object placed!");
  };

  useEffect(() => {
    if (overlayRef.current) {
      setIsOverlayReady(true);
    }
  }, []);

  return (
    <>
      {isOverlayReady && (
        <ARButton
          sessionInit={{
            optionalFeatures: ["dom-overlay"],
            domOverlay: {
              root: overlayRef.current,
            },
          }}
          className="xr-button"
        />
      )}
      <Canvas>
        <XR>
          <mesh position={[0, 0, -2]}>
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh>
        </XR>
      </Canvas>
      <div ref={overlayRef} className="xr-overlay">
        <button onClick={placeObject} className="place-button">
          place
        </button>
      </div>
    </>
  );
}

export default App;
