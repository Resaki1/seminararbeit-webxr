import { useFrame, useThree } from "@react-three/fiber";
import { useHitTest } from "@react-three/xr";
import { useEffect, useRef } from "react";
import { Matrix4, Mesh } from "three";

interface ARSceneProps {
  placedObjectsCount: number;
}

const ARScene = ({ placedObjectsCount }: ARSceneProps) => {
  const boxRef = useRef<Mesh>(null!);

  const xrAnchor = useRef<XRAnchor>();
  const lastHitRef = useRef<XRHitTestResult>(null!);

  const { gl } = useThree();

  useFrame((state, delta, frame: XRFrame) => {
    const referenceSpace = gl.xr.getReferenceSpace();
    if (!xrAnchor.current || !referenceSpace) return;

    if (!frame.trackedAnchors || !frame.trackedAnchors.has(xrAnchor.current))
      return;

    const anchorPose = frame.getPose(
      xrAnchor.current.anchorSpace,
      referenceSpace
    );
    if (anchorPose) {
      boxRef.current.matrix = new Matrix4().fromArray(
        anchorPose.transform.matrix
      );
      console.log(boxRef.current.matrix);
    }
  });

  useHitTest((hitMatrix, hit) => {
    if (xrAnchor.current) return;

    const referenceSpace = gl.xr.getReferenceSpace();
    if (referenceSpace) {
      lastHitRef.current = hit;
    }

    boxRef.current.visible = true;

    hitMatrix.decompose(
      boxRef.current.position,
      boxRef.current.quaternion,
      boxRef.current.scale
    );
  });

  useEffect(() => {
    const referenceSpace = gl.xr.getReferenceSpace();
    if (!lastHitRef.current?.createAnchor || !referenceSpace) return;

    const hitTestPose = lastHitRef.current.getPose(referenceSpace);
    lastHitRef.current.createAnchor(hitTestPose!.transform)?.then((anchor) => {
      xrAnchor.current = anchor;
    });
  }, [gl.xr, placedObjectsCount]);

  return (
    <mesh ref={boxRef} visible={false}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="blue" />
    </mesh>
  );
};

export default ARScene;
