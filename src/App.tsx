import { useEffect, useRef, useState } from "react";
import { ARButton, XR } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import ARScene from "./ARScene";

function App() {
  const overlayRef = useRef<HTMLDivElement>(null!);
  const [isOverlayReady, setIsOverlayReady] = useState(false);
  const [placedObjects, setPlacedObjects] = useState(0);

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
            optionalFeatures: ["dom-overlay", "hit-test"],
            domOverlay: {
              root: overlayRef.current,
            },
          }}
          className="xr-button"
        />
      )}
      <Canvas>
        <XR>
          <ARScene placedObjectsCount={placedObjects} />
        </XR>
      </Canvas>
      <div ref={overlayRef} className="xr-overlay">
        <button
          onClick={() => setPlacedObjects(placedObjects + 1)}
          className="place-button"
        >
          place
        </button>
      </div>
    </>
  );
}

export default App;
