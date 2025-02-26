"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUnityContext = void 0;
var react_1 = require("react");
var error_messages_1 = require("../constants/error-messages");
var use_event_system_1 = require("./use-event-system");
var use_nullable_state_1 = require("./use-nullable-state");
/**
 * Creates a Unity Context hook.
 * @param unityConfig The Unity Config on which the Unity Context is based.
 * @returns The Unity Context hook.
 */
var useUnityContext = function (unityConfig) {
    // A reference to the Unity Instance.
    var _a = (0, use_nullable_state_1.useNullableState)(), unityInstance = _a[0], setUnityInstance = _a[1];
    // The Unity Instance's loading progression represents the percentage of the
    // Unity Instance's loading process that has been completed.
    var _b = (0, react_1.useState)(0), loadingProgression = _b[0], setLoadingProgression = _b[1];
    // Defines whether the Unity Instance has been loaded.
    var _c = (0, react_1.useState)(false), isLoaded = _c[0], setIsLoaded = _c[1];
    // May contain an error that occurred during the initialisation of the Unity
    // Instance.
    var _d = (0, use_nullable_state_1.useNullableState)(), initialisationError = _d[0], setInitialisationError = _d[1];
    /**
     * The Unity Context's event system stores the event listeners which will
     * allow Unity or any global source to invoke events to the React application.
     */
    var eventSystem = (0, use_event_system_1.useEventSystem)();
    /**
     * The Unity Context returns a Unity Provider instance. This is an immutable
     * object that contains a series of methods and properties that are used to
     * alter the Unity Context state externally.
     */
    var unityProvider = (0, react_1.useRef)({
        setLoadingProgression: setLoadingProgression,
        setInitialisationError: setInitialisationError,
        setUnityInstance: setUnityInstance,
        setIsLoaded: setIsLoaded,
        unityConfig: unityConfig,
    });
    /**
     * Enables or disabled the Fullscreen mode of the Unity Instance.
     */
    var requestFullscreen = (0, react_1.useCallback)(
    /**
     * @param enabled Defines whether Unity should be in fullscreen.
     */
    function (enabled) {
        if (unityInstance === null) {
            // Guarding the Unity Instance.
            console.warn(error_messages_1.errorMessages.requestFullscreenNoUnityInstance);
            return;
        }
        // For undocumented reasons, the fullscreen mode can only be enabled
        // with an interger value where the value of "1" enables the fullscreen
        // mode and the value of "0" disables the fullscreen mode.
        unityInstance.SetFullscreen(enabled === true ? 1 : 0);
    }, [unityInstance]);
    /**
     * Lets you asynchronously ask for the pointer to be locked on the given Unity
     * Application's Canvas Element.
     */
    var requestPointerLock = (0, react_1.useCallback)(function () {
        if (unityInstance === null ||
            typeof unityInstance.Module.canvas === "undefined") {
            // Guarding the Unity Instance and the canvas.
            console.warn(error_messages_1.errorMessages.requestPointerLockNoUnityInstanceOrCanvas);
            return;
        }
        // Requesting the pointer lock.
        return unityInstance.Module.canvas.requestPointerLock();
    }, [unityInstance]);
    /**
     * Sends a message to the UnityInstance to invoke a public method.
     */
    var sendMessage = (0, react_1.useCallback)(
    /**
     * @param gameObjectName the name of the game object in your Unity scene.
     * @param methodName the name of the public method on the game object.
     * @param parameter an optional parameter to pass along to the method.
     */
    function (gameObjectName, methodName, parameter) {
        if (unityInstance === null) {
            // Guarding the Unity Instance.
            console.warn(error_messages_1.errorMessages.sendMessageNoUnityInstance);
            return;
        }
        unityInstance.SendMessage(gameObjectName, methodName, parameter);
    }, [unityInstance]);
    /**
     * Takes a screenshot of the Unity Instance and returns a base64 encoded
     * string.
     */
    var takeScreenshot = (0, react_1.useCallback)(
    /**
     * @param dataType Defines the type of screenshot to take.
     * @param quality Defines the quality of the screenshot.
     * @returns A base 64 encoded string of the screenshot.
     */
    function (dataType, quality) {
        if (unityInstance === null ||
            typeof unityInstance.Module.canvas === "undefined") {
            // Guarding the Unity Instance and the canvas.
            console.warn(error_messages_1.errorMessages.screenshotNoUnityInstanceOrCanvas);
            return;
        }
        // Takes a screenshot by converting Canvas's render-context's buffer into
        // a Data URL of the specified data type and quality.
        return unityInstance.Module.canvas.toDataURL(dataType, quality);
    }, [unityInstance]);
    /**
     * Requests the UnityInstance to be unloaded from memory in order to be
     * unmounted from the DOM.
     */
    var unload = (0, react_1.useCallback)(
    /**
     * @returns A promise that resolves when the UnityInstance has been unloaded.
     */
    function () {
        if (unityInstance === null) {
            // Guarding the Unity Instance.
            console.warn(error_messages_1.errorMessages.quitNoUnityInstance);
            return Promise.reject();
        }
        return unityInstance.Quit();
    }, [unityInstance]);
    /**
     * Detaches the Unity Instance from the React DOM, by doing so, the Unity
     * Instance can be unloaded from the memory while the Unity component can be
     * unmounted safely.
     *
     * Warning! This is a workaround for the fact that the Unity WebGL instances
     * which are build with Unity 2021.2 and newer cannot be unmounted before the
     * Unity Instance is unloaded.
     * @see https://github.com/jeffreylanters/react-unity-webgl/issues/22
     */
    var UNSAFE__detachAndUnloadImmediate = (0, react_1.useCallback)(
    /**
     * @returns A promise that resolves when the UnityInstance has been unloaded.
     */
    function () { return __awaiter(void 0, void 0, void 0, function () {
        var canvas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (unityInstance === null ||
                        typeof unityInstance.Module.canvas === "undefined") {
                        // Guarding the Unity Instance.
                        console.warn(error_messages_1.errorMessages.genericNoUnityInstance);
                        return [2 /*return*/, Promise.reject()];
                    }
                    canvas = unityInstance.Module.canvas;
                    document.body.appendChild(canvas);
                    canvas.style.display = "none";
                    // Unloads the Unity Instance.
                    return [4 /*yield*/, unload()];
                case 1:
                    // Unloads the Unity Instance.
                    _a.sent();
                    // Eventually the canvas will be removed from the DOM. This has to be done
                    // manually since the canvas is no longer controlled by the React DOM.
                    canvas.remove();
                    return [2 /*return*/];
            }
        });
    }); }, [unityInstance]);
    // Effect invoked when the loading progression changes. When the loading
    // progression is equal to or more than 1, the Unity Instance is considered
    // loaded. This will update the isLoaded state.
    (0, react_1.useEffect)(function () {
        setIsLoaded(loadingProgression === 1);
    }, [loadingProgression]);
    // Returns the Unity Context Hook.
    return {
        unityProvider: unityProvider.current,
        loadingProgression: loadingProgression,
        initialisationError: initialisationError,
        isLoaded: isLoaded,
        UNSAFE__unityInstance: unityInstance,
        requestFullscreen: requestFullscreen,
        requestPointerLock: requestPointerLock,
        sendMessage: sendMessage,
        takeScreenshot: takeScreenshot,
        unload: unload,
        UNSAFE__detachAndUnloadImmediate: UNSAFE__detachAndUnloadImmediate,
        addEventListener: eventSystem.addEventListener,
        removeEventListener: eventSystem.removeEventListener,
    };
};
exports.useUnityContext = useUnityContext;
