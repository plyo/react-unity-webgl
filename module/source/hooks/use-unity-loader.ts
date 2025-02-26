import { useEffect, useState } from "react";
import { isBrowserEnvironment } from "../constants/is-browser-environment";
import { UnityLoaderStatus } from "../enums/unity-loader-status";
import { UnityConfig } from "../exports";

interface ScriptData {
  count: number;
  status: UnityLoaderStatus;
  handleLoad?: () => void;
  handleError?: () => void;
}

// Map to track script references, status, and event handlers.
const scriptReferenceMap = new Map<string, ScriptData>();

/**
 * Hook to embed a Unity Loader script.
 * @param source The source of the unity loader.
 * @returns a hook that returns the status of the loader.
 */
const useUnityLoader = (unityConfig: UnityConfig): UnityLoaderStatus => {
  const [status, setStatus] = useState<UnityLoaderStatus>(
    UnityLoaderStatus.Loading
  );
  const { loaderUrl } = unityConfig;

  // Effect hook will be invoked when the source changes.
  useEffect(() => {
    // It is possible for the application being rendered server side. In
    // this scenario, the window is not available. We can't create a Unity
    // Loader in this case.
    if (!isBrowserEnvironment) {
      return undefined;
    }

    // If the script's source is null, we'll reset the status to idle.
    if (!loaderUrl) {
      setStatus(UnityLoaderStatus.Idle);
      return undefined;
    }

    // Find existing script element by source.
    // It may have been added by another instance of this hook.
    let script = document.querySelector(
      `script[src="${loaderUrl}"]`
    ) as HTMLScriptElement | null;

    // Get existing data from the reference map.
    const existingData = scriptReferenceMap.get(loaderUrl);

    if (script) {
      // If the script is already in the DOM, increment the ref count.
      if (existingData) {
        existingData.count += 1;
        scriptReferenceMap.set(loaderUrl, existingData);
        setStatus(existingData.status);
      } else {
        // Edge case: script is in the DOM, but not in the map.
        // (Unlikely if all usage is through this hook)
        scriptReferenceMap.set(loaderUrl, {
          count: 1,
          status: UnityLoaderStatus.Loaded,
        });
        setStatus(UnityLoaderStatus.Loaded);
      }
    } else {
      // Create a new script element.
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = loaderUrl;
      script.async = true;
      script.setAttribute("data-status", "loading");

      // Define load handler.
      const handleLoad = () => {
        script?.setAttribute("data-status", "loaded");
        const refData = scriptReferenceMap.get(loaderUrl);
        if (refData) {
          refData.status = UnityLoaderStatus.Loaded;
          scriptReferenceMap.set(loaderUrl, refData);
        }
        setStatus(UnityLoaderStatus.Loaded);
      };

      // Define error handler.
      const handleError = () => {
        script?.setAttribute("data-status", "error");
        const refData = scriptReferenceMap.get(loaderUrl);
        if (refData) {
          refData.status = UnityLoaderStatus.Error;
          scriptReferenceMap.set(loaderUrl, refData);
        }
        setStatus(UnityLoaderStatus.Error);
      };

      // Attach listeners.
      script.addEventListener("load", handleLoad);
      script.addEventListener("error", handleError);

      // Append the script to the document body.
      document.body.appendChild(script);

      // Initialize the reference map.
      scriptReferenceMap.set(loaderUrl, {
        count: 1,
        status: UnityLoaderStatus.Loading,
        handleLoad,
        handleError,
      });

      setStatus(UnityLoaderStatus.Loading);
    }

    return () => {
      const refData = scriptReferenceMap.get(loaderUrl);
      if (!refData) return;

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

        script?.remove();
      } else {
        // If there's still at least one consumer of the script, update the map
        // but don't remove the script from the DOM.
        scriptReferenceMap.set(loaderUrl, refData);
      }
    };
  }, [loaderUrl]);

  return status;
};

export { useUnityLoader };
