"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUnityLoader = void 0;
var react_1 = require("react");
var is_browser_environment_1 = require("../constants/is-browser-environment");
var unity_loader_status_1 = require("../enums/unity-loader-status");
// Map to track script references, status, and event handlers.
var scriptReferenceMap = new Map();
/**
 * Hook to embed a Unity Loader script.
 * @param source The source of the unity loader.
 * @returns a hook that returns the status of the loader.
 */
var useUnityLoader = function (unityConfig) {
    var _a = (0, react_1.useState)(unity_loader_status_1.UnityLoaderStatus.Loading), status = _a[0], setStatus = _a[1];
    var loaderUrl = unityConfig.loaderUrl;
    // Effect hook will be invoked when the source changes.
    (0, react_1.useEffect)(function () {
        // It is possible for the application being rendered server side. In
        // this scenario, the window is not available. We can't create a Unity
        // Loader in this case.
        if (!is_browser_environment_1.isBrowserEnvironment) {
            return undefined;
        }
        // If the script's source is null, we'll reset the status to idle.
        if (!loaderUrl) {
            setStatus(unity_loader_status_1.UnityLoaderStatus.Idle);
            return undefined;
        }
        // Find existing script element by source.
        // It may have been added by another instance of this hook.
        var script = document.querySelector("script[src=\"".concat(loaderUrl, "\"]"));
        // Get existing data from the reference map.
        var existingData = scriptReferenceMap.get(loaderUrl);
        if (script) {
            // If the script is already in the DOM, increment the ref count.
            if (existingData) {
                existingData.count += 1;
                scriptReferenceMap.set(loaderUrl, existingData);
                setStatus(existingData.status);
            }
            else {
                // Edge case: script is in the DOM, but not in the map.
                // (Unlikely if all usage is through this hook)
                scriptReferenceMap.set(loaderUrl, {
                    count: 1,
                    status: unity_loader_status_1.UnityLoaderStatus.Loaded,
                });
                setStatus(unity_loader_status_1.UnityLoaderStatus.Loaded);
            }
        }
        else {
            // Create a new script element.
            script = document.createElement("script");
            script.type = "text/javascript";
            script.src = loaderUrl;
            script.async = true;
            script.setAttribute("data-status", "loading");
            // Define load handler.
            var handleLoad = function () {
                script === null || script === void 0 ? void 0 : script.setAttribute("data-status", "loaded");
                var refData = scriptReferenceMap.get(loaderUrl);
                if (refData) {
                    refData.status = unity_loader_status_1.UnityLoaderStatus.Loaded;
                    scriptReferenceMap.set(loaderUrl, refData);
                }
                setStatus(unity_loader_status_1.UnityLoaderStatus.Loaded);
            };
            // Define error handler.
            var handleError = function () {
                script === null || script === void 0 ? void 0 : script.setAttribute("data-status", "error");
                var refData = scriptReferenceMap.get(loaderUrl);
                if (refData) {
                    refData.status = unity_loader_status_1.UnityLoaderStatus.Error;
                    scriptReferenceMap.set(loaderUrl, refData);
                }
                setStatus(unity_loader_status_1.UnityLoaderStatus.Error);
            };
            // Attach listeners.
            script.addEventListener("load", handleLoad);
            script.addEventListener("error", handleError);
            // Append the script to the document body.
            document.body.appendChild(script);
            // Initialize the reference map.
            scriptReferenceMap.set(loaderUrl, {
                count: 1,
                status: unity_loader_status_1.UnityLoaderStatus.Loading,
                handleLoad: handleLoad,
                handleError: handleError,
            });
            setStatus(unity_loader_status_1.UnityLoaderStatus.Loading);
        }
        return function () {
            var refData = scriptReferenceMap.get(loaderUrl);
            if (!refData)
                return;
            // Decrement the ref count.
            refData.count -= 1;
            // If there are no more consumers of the script, remove it from the DOM.
            if (refData.count <= 0) {
                scriptReferenceMap.delete(loaderUrl);
                // Also remove listeners before removing the script.
                if (script && refData.handleLoad && refData.handleError) {
                    script.removeEventListener("load", refData.handleLoad);
                    script.removeEventListener("error", refData.handleError);
                }
                script === null || script === void 0 ? void 0 : script.remove();
            }
            else {
                // If there's still at least one consumer of the script, update the map
                // but don't remove the script from the DOM.
                scriptReferenceMap.set(loaderUrl, refData);
            }
        };
    }, [loaderUrl]);
    return status;
};
exports.useUnityLoader = useUnityLoader;
