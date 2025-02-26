import { UnityProps } from "../exports";
/**
 * Generates a unique Unity canvas ID. This is used internally by Unity since
 * version 2021.2 to identify the canvas element in the DOM. This is not
 * documented in the Unity documentation, but it is used in the Unity source
 * code.
 * @returns A unique identifier for a Unity canvas element.
 */
declare const useUnityCanvasId: (unityProps: UnityProps) => string;
export { useUnityCanvasId };
//# sourceMappingURL=use-unity-canvas-id.d.ts.map