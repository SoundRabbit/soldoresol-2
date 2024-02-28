import * as THREE from 'three';
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { DataBlockTableContext } from '@/component/context/DataBlockTableContext';
import { RoomContext } from '@/component/context/RoomContext';

import { useMutex } from '@/lib/hook/useMutex';
import { TableRendererChannel } from '@/lib/tableRenderer';
import { Camera } from '@/lib/tableRenderer/camera';

type MouseButtonEvent = {
  position: [number, number];
};

const intersectRayByZPlane = (
  vpMxInv: THREE.Matrix4,
  planeZ: number,
  position: [number, number],
): [THREE.Vector4, THREE.Vector4] | null => {
  // (a,b,0)をワールド座標、(X,Y,z)をスクリーン座標、Mをinv(vpMx)として
  // |a|   |M00 M01 M02 M03|   |w*X|
  // |b| = |M10 M11 M12 M13| * |w*Y|
  // |C|   |M20 M21 M22 M23|   |w*z|
  // |1|   |M30 M31 M32 M33|   | w |
  //ここでw*z=vとして
  // |a|   |M00*w*X + M01*w*Y + M02*v + M03*w|   |M02*v + (M00*X + M01*Y + M03)*w|   |M02 (M00*X + M01*Y + M03)|
  // |b| = |M10*w*X + M11*w*Y + M12*v + M13*w| = |M12*v + (M10*X + M11*Y + M13)*w| = |M12 (M10*X + M11*Y + M13)| * |v|
  // |C|   |M20*w*X + M21*w*Y + M22*v + M23*w|   |M22*v + (M20*X + M21*Y + M23)*w|   |M22 (M20*X + M21*Y + M23)|   |w|
  // |1|   |M30*w*X + M31*w*Y + M32*v + M33*w|   |M32*v + (M30*X + M31*Y + M33)*w|   |M32 (M30*X + M31*Y + M33)|
  //について
  // |m00 m01| = |M22 (M20*X + M21*Y + M23)|
  // |m10 m11|   |M32 (M30*X + M31*Y + M33)|
  //として
  // |C| = |m00 m01| * |v|
  // |1|   |m10 m11|   |w|
  //を解く

  const [X, Y] = position;
  const C = planeZ;
  const m00 = vpMxInv.elements[2 + 2 * 4];
  const m01 = vpMxInv.elements[2 + 0 * 4] * X + vpMxInv.elements[2 + 1 * 4] * Y + vpMxInv.elements[2 + 3 * 4];
  const m10 = vpMxInv.elements[3 + 2 * 4];
  const m11 = vpMxInv.elements[3 + 0 * 4] * X + vpMxInv.elements[3 + 1 * 4] * Y + vpMxInv.elements[3 + 3 * 4];

  // |m00 m01|^(-1) = |m11 -m01| / (m00*m11 - m01*m10)
  // |m10 m11|        |-m10 m00|
  const det = m00 * m11 - m01 * m10;
  if (det === 0) return null;
  const invDet = 1 / det;
  const v = (m11 * C - m01 * 1) * invDet;
  const w = (-m10 * C + m00 * 1) * invDet;

  const screenPosition = new THREE.Vector4(X * w, Y * w, v, w);
  const worldPosition = screenPosition.clone().applyMatrix4(vpMxInv);

  return [worldPosition, screenPosition];
};

export const useCanvas = () => {
  const roomContext = useContext(RoomContext);
  const tableContext = useContext(DataBlockTableContext);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvasRef.current && canvas && roomContext && tableContext) {
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
        const offscreen = canvas.transferControlToOffscreen();
        TableRendererChannel.run(roomContext.renderer, tableContext.channel, roomContext.roomId, offscreen);
      }
      canvasRef.current = canvas;
    },
    [roomContext, tableContext],
  );

  const handleChangeCanvasSize = useCallback(() => {
    if (canvasRef.current && roomContext) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      TableRendererChannel.setCanvasSize(roomContext.renderer, [
        canvasRef.current.clientWidth * devicePixelRatio,
        canvasRef.current.clientHeight * devicePixelRatio,
      ]);
    }
  }, [roomContext]);

  useEffect(() => {
    window.addEventListener('resize', handleChangeCanvasSize);
    return () => {
      window.removeEventListener('resize', handleChangeCanvasSize);
    };
  }, [handleChangeCanvasSize]);

  const defaultCamera = useMemo<Camera>(() => Camera.create(), []);
  const cameraRef = useRef<Camera>(defaultCamera);

  const defaultMouse = useMemo<{
    position: [number, number];
    dragging?: {
      intersectPosition: THREE.Vector4;
      screenPosition: THREE.Vector4;
      vpMx: THREE.Matrix4;
      vpMxInv: THREE.Matrix4;
    };
  }>(() => {
    return {
      position: [0, 0] as [number, number],
    };
  }, []);
  const mouseRef = useRef(defaultMouse);

  const { runImmediately } = useMutex();
  const handleMouseEvent = useCallback(
    (e: React.MouseEvent) => {
      runImmediately(async () => {
        const rect = e.currentTarget.getBoundingClientRect();
        const currentMouse = [e.clientX - rect.left, e.clientY - rect.top] as [number, number];
        const prevMouse = [...mouseRef.current.position] as [number, number];

        mouseRef.current.position = currentMouse;

        if (
          e.currentTarget === null ||
          e.target === null ||
          e.currentTarget !== e.target ||
          !roomContext ||
          !roomContext.renderer ||
          (e.buttons & 1) === 0
        ) {
          mouseRef.current.dragging = undefined;
          return;
        }

        const currentPosition = [2 * (currentMouse[0] / rect.width) - 1, 2 * (currentMouse[1] / rect.height) - 1] as [
          number,
          number,
        ];
        currentPosition[1] *= -1;

        const prevPosition = [2 * (prevMouse[0] / rect.width) - 1, 2 * (prevMouse[1] / rect.height) - 1] as [
          number,
          number,
        ];
        prevPosition[1] *= -1;

        if (!mouseRef.current.dragging) {
          const { intersect, camera } = await TableRendererChannel.getIntersect(roomContext.renderer, prevPosition);
          if (intersect.at(0) && camera) {
            const vpMx = new THREE.Matrix4().fromArray(camera.colMajorVp);
            const vpMxInv = new THREE.Matrix4().fromArray(camera.colMajorVpInv);
            const intersectPosition = new THREE.Vector4(...intersect[0].position, 1);
            const screenPosition = intersectPosition.clone().applyMatrix4(vpMx);
            mouseRef.current.dragging = {
              intersectPosition,
              screenPosition,
              vpMx,
              vpMxInv,
            };
          } else if (camera) {
            const vpMx = new THREE.Matrix4().fromArray(camera.colMajorVp);
            const vpMxInv = new THREE.Matrix4().fromArray(camera.colMajorVpInv);
            const planeIntersection = intersectRayByZPlane(vpMxInv, 0, prevPosition);
            if (planeIntersection) {
              const [intersectPosition, screenPosition] = planeIntersection;
              mouseRef.current.dragging = {
                intersectPosition,
                screenPosition,
                vpMx,
                vpMxInv,
              };
            }
          }
          return;
        }

        const { vpMxInv, intersectPosition } = mouseRef.current.dragging;
        const currentScreenPosition = mouseRef.current.dragging.screenPosition.clone();
        currentScreenPosition.setX(currentPosition[0] * currentScreenPosition.w);
        currentScreenPosition.setY(currentPosition[1] * currentScreenPosition.w);
        const currentWorldPosition = currentScreenPosition.clone().applyMatrix4(vpMxInv);

        const deltaX = currentWorldPosition.x - intersectPosition.x;
        const deltaY = currentWorldPosition.y - intersectPosition.y;
        const deltaZ = currentWorldPosition.z - intersectPosition.z;

        mouseRef.current.dragging.intersectPosition = currentWorldPosition;
        mouseRef.current.dragging.screenPosition = currentScreenPosition;

        Camera.moveWorld(cameraRef.current, deltaX, deltaY, deltaZ);
        const cameraPosition = Camera.getPosition(cameraRef.current);
        const cameraRotation = Camera.getRotation(cameraRef.current, 'XYZ');
        TableRendererChannel.setCameraPosition(roomContext.renderer, {
          position: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
          rotation: {
            euler: [cameraRotation.x, cameraRotation.y, cameraRotation.z],
            order: 'XYZ',
          },
        });
      });
    },
    [roomContext, runImmediately],
  );

  return {
    handleCanvasRef,
    handleMouseEvent,
  };
};
