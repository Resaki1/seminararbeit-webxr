import { useFrame, useThree } from "@react-three/fiber";
import { useHitTest, useXR } from "@react-three/xr";
import { useEffect, useRef } from "react";
import { DirectionalLight, Matrix4, Mesh } from "three";
import { XREstimatedLight } from "three/examples/jsm/Addons.js";

interface ARSceneProps {
  placedObjectsCount: number;
}

const ARScene = ({ placedObjectsCount }: ARSceneProps) => {
  const boxRef = useRef<Mesh>(null!);

  const xrAnchor = useRef<XRAnchor>();
  const lastHitRef = useRef<XRHitTestResult>(null!);
  const virtualLight = useRef<DirectionalLight>(null!);
  const lightProbe = useRef<XREstimatedLight>();

  const { gl, scene } = useThree();
  const { session } = useXR();

  useFrame((state, delta, frame: XRFrame) => {
    if (!session) return;

    if (lightProbe.current) {
      virtualLight.current.visible = true;
      virtualLight.current = lightProbe.current.directionalLight;
    }

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

  useEffect(() => {
    const xrLight = new XREstimatedLight(gl, true);

    xrLight.addEventListener("estimationstart", () => {
      scene.add(xrLight);
      lightProbe.current = xrLight;
      if (xrLight) {
        scene.environment = xrLight.environment;
        virtualLight.current.visible = true;
        virtualLight.current = xrLight.directionalLight;
      }
    });

    xrLight.addEventListener("estimationend", () => {
      scene.remove(xrLight);
      scene.environment = null;
    });

    return () => {
      scene.remove(xrLight);
    };
  }, [gl, scene, session]);

  if (!session) return;

  return (
    <>
      <directionalLight ref={virtualLight} visible={false} color={"white"} />
      <mesh ref={boxRef} visible={false}>
        <sphereGeometry args={[0.175, 32, 32]} />
        <meshStandardMaterial color={0xdddddd} roughness={0} metalness={1} />
      </mesh>
    </>
  );
};

export default ARScene;
