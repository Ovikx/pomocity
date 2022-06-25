import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, ReactThreeFiber, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { createBuilding } from './SkyscraperBuilder';
import { off } from 'process';

export interface Segment {
    length: number,
    height: number,
    width: number
}

const Base = (props: JSX.IntrinsicElements['mesh']) => {
    const ref = useRef<THREE.Mesh>(null!);

    return (
        <mesh 
            {...props}
            ref={ref}
            position={[0,0,0]}
        >
            <boxGeometry
                args={[1, 0.1, 1]}
            />
            <meshStandardMaterial
                metalness={1}
                roughness={0.4}
                color={new THREE.Color(0xffffff)}
            />
        </mesh>
    )
}

const Skyscraper = (props: JSX.IntrinsicElements['mesh']) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const numSegments = Number(Math.random()*3+3);
    let segments: Segment[] = createBuilding('spike-up', 'blue');

    let meshes: JSX.Element[] = [];
    let currentHeight = 0;
    let keyCounter = 0;
    segments.forEach((segment: Segment) => {
        const height = currentHeight + segment.height/2
        meshes.push(
            <mesh
                {...props}
                ref={mesh}
                position={[0, height, 0]}
                key={keyCounter}
            >
                <boxGeometry args={[segment.length, segment.height, segment.length]} />
                <meshStandardMaterial color={new THREE.Color(Math.floor(Math.random()*16777215))} />
            </mesh>
        )
        keyCounter++;
        currentHeight = height + segment.height/2;
    });

    return (
        <>
            <mesh
                {...props}
                ref={mesh}
            >
                {meshes}
            </mesh>
            <CustomCamera lookHeight={currentHeight/2}/>
        </>
    );
}

interface CameraProps {
    lookHeight: number
}

const CustomCamera = (props: CameraProps) => {
    const ref = useRef<THREE.PerspectiveCamera>(null!);
    const factor = 2;
    const offset = 2;

    useThree(({camera}) => {
        camera.translateY(1);
        camera.position.y = 1.5;
    });

    useFrame((state, delta) => {
        state.camera.lookAt(new THREE.Vector3(0,props.lookHeight,0));
        state.camera.position.x = Math.cos(state.clock.getElapsedTime()/factor)*offset;
        state.camera.position.z = Math.sin(state.clock.getElapsedTime()/factor)*offset;
        console.log(state.camera.position.x);
    });

    return (
        <perspectiveCamera
            ref={ref}
        />
    );
}

export const SkyscraperViewer = () => {
    const [render, rerender] = useState(0);
    
    return (
        <div>
            <Canvas style={{
                height: '500px',
                borderStyle: 'dotted'
            }}>
                <ambientLight />
                <pointLight position={[10,10,10]} />
                <Base />
                <Skyscraper />
            </Canvas>
            <button onClick={() => {rerender(render+1)}}>Reset view</button>
        </div>
    )
}