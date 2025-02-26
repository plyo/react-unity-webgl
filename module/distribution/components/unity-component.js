"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unity = void 0;
var react_1 = require("react");
var react_2 = require("react");
var use_unity_canvas_id_1 = require("../hooks/use-unity-canvas-id");
var use_unity_instance_1 = require("../hooks/use-unity-instance");
var use_unity_arguments_1 = require("../hooks/use-unity-arguments");
var use_unity_loader_1 = require("../hooks/use-unity-loader");
/**
 * Renders the provided Unity Application.
 */
var Unity = (0, react_2.forwardRef)(
/**
 * @param unityProps The Unity props provided the the Unity component.
 * @param forwardedRef The forwarded ref to the Unity component.
 * @returns The Unity canvas renderer.
 */
function (unityProps, forwardedRef) {
    /**
     * A reference to the HTML Canvas Element. This Canvas Element will eventually
     * be passed to the Unity Instance hook which it will use to render the Unity
     * application.
     */
    var htmlCanvasElementRef = (0, react_2.useRef)(null);
    /**
     * A unique Unity canvas ID. This is used internally by Unity since version
     * 2021.2 to identify the canvas element in the DOM. This is not documented in
     * the Unity documentation, but it is used in the Unity source code.
     */
    var unityCanvasId = (0, use_unity_canvas_id_1.useUnityCanvasId)(unityProps);
    /**
     * The Unity Arguments object which can be passed to the create Unity instance
     * method in order to initialize it. These arguments are created based on the
     * provided Unity Props which also include the Unity Provider and thus the
     * Unity Config.
     */
    var unityArguments = (0, use_unity_arguments_1.useUnityArguments)(unityProps);
    /**
     * The corresponding Unity Loader will be loaded based on the provided loader
     * URL from the Unity Provider's Unity Config.
     */
    var unityLoaderStatus = (0, use_unity_loader_1.useUnityLoader)(unityProps.unityProvider.unityConfig);
    // The Unity Instance is created based on the Unity Arguments. The loader
    // status will be used to determine if the Unity instance should be created.
    // The Unity is mounted to the Canvas Element.
    (0, use_unity_instance_1.useUnityInstance)(unityLoaderStatus, htmlCanvasElementRef.current, unityArguments, unityProps.unityProvider);
    // The imperative handle is used to pass the Canvas Element to the parent
    // component using the forwardRef.
    (0, react_1.useImperativeHandle)(forwardedRef, function () { return htmlCanvasElementRef.current; });
    // Returns the Unity Canvas Element which will render the Unity application.
    return (0, react_1.createElement)("canvas", {
        ref: htmlCanvasElementRef,
        id: unityCanvasId,
        style: unityProps.style,
        className: unityProps.className,
        tabIndex: unityProps.tabIndex,
    });
});
exports.Unity = Unity;
