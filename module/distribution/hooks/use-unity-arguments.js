"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUnityArguments = void 0;
var react_1 = require("react");
/**
 * Creates a memoized Unity Arguments object which can be passed to the Unity
 * instance in order to initialize it.
 * @param unityProps The Unity props provided the the Unity component.
 * @returns The Unity arguments to pass to the Unity instance.
 */
var useUnityArguments = function (unityProps) {
    return (0, react_1.useMemo)(function () { return ({
        // Assigns the data URL, framework URL, and code URL to the Unity
        // arguments object.
        dataUrl: unityProps.unityProvider.unityConfig.dataUrl,
        frameworkUrl: unityProps.unityProvider.unityConfig.frameworkUrl,
        codeUrl: unityProps.unityProvider.unityConfig.codeUrl,
        // Assigns the optional streaming assets URL, memory URL, symbols URL,
        // and worker URL to the Unity arguments object.
        streamingAssetsUrl: unityProps.unityProvider.unityConfig.streamingAssetsUrl,
        memoryUrl: unityProps.unityProvider.unityConfig.memoryUrl,
        symbolsUrl: unityProps.unityProvider.unityConfig.symbolsUrl,
        workerUrl: unityProps.unityProvider.unityConfig.workerUrl,
        // Assigns the optional company name, product name, and product version to
        // the Unity arguments object.
        companyName: unityProps.unityProvider.unityConfig.companyName,
        productName: unityProps.unityProvider.unityConfig.productName,
        productVersion: unityProps.unityProvider.unityConfig.productVersion,
        // Assigns the webgl context attributes to the Unity arguments object.
        // If the webgl context attributes are not defined via the Unity Props,
        // the default value of an empty object will be used.
        webglContextAttributes: unityProps.unityProvider.unityConfig.webglContextAttributes || {},
        // Assigns the cache control value to the Unity arguments object. If the
        // cache control value is not defined via the Unity Props, the default
        // value of always `must-revalidate` will be used.
        cacheControl: unityProps.unityProvider.unityConfig.cacheControl ||
            (function () { return "must-revalidate"; }),
        // Assigns the device pixel ratio to the Unity arguments object. If the
        // device pixel ratio is not defined via the Unity Props, the default
        // value of `1` will be used.
        devicePixelRatio: unityProps.devicePixelRatio || 1,
        // Assigns the auto sync persistent data path value to the Unity arguments
        // object. If the auto sync persistent data path value is not defined via
        // the Unity Props, the default value of `undefined` will be used.
        autoSyncPersistentDataPath: unityProps.autoSyncPersistentDataPath,
        // Assigns the match WebGL to canvas size value to the Unity arguments
        // object. If the match WebGL to canvas size value is not defined via the
        // Unity Props, the default value of `true` will be used.
        matchWebGLToCanvasSize: typeof unityProps.matchWebGLToCanvasSize === "boolean"
            ? unityProps.matchWebGLToCanvasSize
            : true,
        // Assigns the disabled canvas events to the Unity arguments object. If
        // the disabled canvas events are not defined via the Unity Props, the
        // default value of `contextmenu` and `dragstart` will be used.
        disabledCanvasEvents: unityProps.disabledCanvasEvents || [
            "contextmenu",
            "dragstart",
        ],
        // Assigns the print hook to the Unity arguments object. This hook will
        // be called whenever the Unity instance prints a message.
        print: 
        /**
         * Intercept print events in order to catch messages and send them to
         * the unity context instead.
         * @param message The message to be printed.
         */
        function (message) {
            // TODO -- Re-implement this hook.
        },
        // Assigns the print error hook to the Unity arguments object. This hook
        // will be called whenever the Unity instance prints an error.
        printErr: 
        /**
         * Intercept print error events in order to catch messages and send them
         * to the unity context instead.
         * @param error The error to be printed.
         */
        function (error) {
            // TODO -- Re-implement this hook.
        },
    }); }, []);
};
exports.useUnityArguments = useUnityArguments;
