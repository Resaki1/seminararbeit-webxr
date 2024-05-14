import { useFrame } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import { useEffect, useRef } from "react";
import { Matrix4, Mesh } from "three";

interface ARSceneProps {
  placedObjectsCount: number;
}

const ARScene = ({ placedObjectsCount }: ARSceneProps) => {
  const boxRef = useRef<Mesh>(null!);

  const xrHitTestSource = useRef<XRHitTestSource>();
  const xrViewerSpace = useRef<XRReferenceSpace | XRBoundedReferenceSpace>();
  const xrRefSpace = useRef<XRReferenceSpace | XRBoundedReferenceSpace>();

  const { session } = useXR();

  useEffect(() => {
    if (session) {
      session.requestReferenceSpace("viewer").then((refSpace) => {
        xrViewerSpace.current = refSpace;
        if (
          xrViewerSpace.current &&
          session.requestHitTestSource !== undefined
        ) {
          session
            .requestHitTestSource({ space: xrViewerSpace.current })!
            .then((hitTestSource) => {
              xrHitTestSource.current = hitTestSource;
            });
        }
      });

      session.requestReferenceSpace("local").then((refSpace) => {
        xrRefSpace.current = refSpace;
      });
    }
  }, [session]);

  useFrame((state, delta, frame) => {
    if (!frame) return;

    const pose = frame.getViewerPose(xrRefSpace.current);

    if (xrHitTestSource && pose) {
      const hitTestResults = frame.getHitTestResults(xrHitTestSource.current);
      if (hitTestResults.length > 0) {
        const pose = hitTestResults[0].getPose(xrRefSpace.current);

        boxRef.current.visible = true;
        const hitMatrix = new Matrix4().fromArray(pose.transform.matrix);
        hitMatrix.decompose(
          boxRef.current.position,
          boxRef.current.quaternion,
          boxRef.current.scale
        );
      } else boxRef.current.visible = false;
    } else boxRef.current.visible = false;
  });

  useEffect(() => {
    const handlePlaceObject = () => {
      console.log("ARScene: Object placed!");
    };

    handlePlaceObject();
  }, [placedObjectsCount]);

  return (
    <mesh ref={boxRef} visible={false}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="blue" />
    </mesh>
  );
};

export default ARScene;
