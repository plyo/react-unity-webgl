"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnityLoaderStatus = void 0;
/**
 * The status of the Unity loader.
 */
var UnityLoaderStatus;
(function (UnityLoaderStatus) {
    /**
     * The Unity loader is idling and awaiting a resource it be loaded.
     */
    UnityLoaderStatus["Idle"] = "Idle";
    /**
     * The Unity loader is loading a resource.
     */
    UnityLoaderStatus["Loading"] = "Loading";
    /**
     * The Unity loader has loaded a resource.
     */
    UnityLoaderStatus["Loaded"] = "Loaded";
    /**
     * The Unity loader has failed to load a resource.
     */
    UnityLoaderStatus["Error"] = "Error";
})(UnityLoaderStatus || (exports.UnityLoaderStatus = UnityLoaderStatus = {}));
