import { useEffect, useState } from "react";
import { isBrowserEnvironment } from "../constants/is-browser-environment";
import { UnityLoaderStatus } from "../enums/unity-loader-status";
import { UnityConfig } from "../exports";

// Map to track script references and their instance count
const scriptReferenceMap = new Map<
  string,
  { count: number; status: UnityLoaderStatus }
>();

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
    if (isBrowserEnvironment === false) {
      return undefined;
    }
    // If the script's source is null, we'll reset the status to idle.
    if (unityConfig.loaderUrl === null) {
      setStatus(UnityLoaderStatus.Idle);
      return undefined;
    }

    /**
     * Find existing script element by source. It may have been added by
     * another instance of this hook.
     */
    let script = document.querySelector(
      `script[src="${loaderUrl}"]`
    ) as HTMLScriptElement | null;

    // If script exists, increase reference count, else we'll create a new script.
    if (script) {
      const refData = scriptReferenceMap.get(loaderUrl) || {
        count: 0,
        status: UnityLoaderStatus.Loading,
      };
      scriptReferenceMap.set(loaderUrl, {
        count: refData.count + 1,
        status: refData.status,
      });
      setStatus(refData.status);
    } else {
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = loaderUrl;
      script.async = true;
      script.setAttribute("data-status", "loading");
      document.body.appendChild(script);

      // Initialize reference map entry
      scriptReferenceMap.set(loaderUrl, {
        count: 1,
        status: UnityLoaderStatus.Loading,
      });

      script.addEventListener("load", () => {
        script?.setAttribute("data-status", "loaded");
        scriptReferenceMap.set(loaderUrl, {
          count: 1,
          status: UnityLoaderStatus.Loaded,
        });
        setStatus(UnityLoaderStatus.Loaded);
      });

      script.addEventListener("error", () => {
        script?.setAttribute("data-status", "error");
        scriptReferenceMap.set(loaderUrl, {
          count: 1,
          status: UnityLoaderStatus.Error,
        });
        setStatus(UnityLoaderStatus.Error);
      });
    }

    // Remove event listeners on cleanup.
    return () => {
      const refData = scriptReferenceMap.get(loaderUrl);

      if (refData) {
        if (refData.count > 1) {
          // Decrease reference count when an instance unmounts
          scriptReferenceMap.set(loaderUrl, {
            ...refData,
            count: refData.count - 1,
          });
        } else {
          // Remove script only when the last instance unmounts
          scriptReferenceMap.delete(loaderUrl);
          script?.remove();
        }
      }
    };
  }, [unityConfig.loaderUrl]);

  return status;
};

export { useUnityLoader };
