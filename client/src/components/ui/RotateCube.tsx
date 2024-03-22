import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";

type Props = {
  propMultiplier: number;
};

export default function RotateCube(props: Props) {
  const { propMultiplier } = props;

  function MyRotatingBox() {
    const myMesh = useRef<Mesh>(null!);
    const [doubleClicked, setDoubleClicked] = useState(false);
    const [multiplier, setMultiplier] = useState(propMultiplier);

    const width = 2 * multiplier;
    const length = 2 * multiplier;
    const depth = 2 * multiplier;

    useFrame(({ clock }) => {
      const a = clock.getElapsedTime() * 0.7;
      myMesh.current.rotation.x = a / 2;
      myMesh.current.rotation.y = a / 3;
    });

    return (
      <mesh
        ref={myMesh}
        onDoubleClick={() => {
          if (doubleClicked) {
            setDoubleClicked(false);
            console.log("unDoubleClick");
            setMultiplier(1);
          } else {
            setDoubleClicked(true);
            console.log("doubleClick");
            setMultiplier(1.5);
          }
        }}
      >
        <boxGeometry args={[length, width, depth]} />
        <meshPhongMaterial color="white" />
      </mesh>
    );
  }

  return (
    <div className="self-center invisible lg:visible" style={{ width: "200px", height: "200px" }}>
      <Canvas>
        <directionalLight
          position={[-10, 30, 10]}
          intensity={1.5}
          color={"cyan"}
        />
        <directionalLight
          position={[0, -30, 0]}
          intensity={1.5}
          color={"magenta"}
        />
        <directionalLight
          position={[30, 10, 10]}
          intensity={1.5}
          color={"yellow"}
        />
        <MyRotatingBox />
      </Canvas>
    </div>
  );
}
