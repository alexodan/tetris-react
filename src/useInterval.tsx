import { useRef, useEffect, useState } from "react";

/**
 * To improve?
 * 1- Separate concerns better
 *   - ...
 * 2- Avoid forcing state updates
 *   - Can object classes and react coexist nicely?
 * 3- Make adding features easier
 *   - Colors
 *   - Levels
 * 4- Configurable (now is just hardcoded)
 */

export function useInterval(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (args: any) => void,
  time: number = 1000
) {
  const intervalId = useRef<number>();
  const callbackRef = useRef<typeof callback>();
  const [state, setState] = useState<"paused" | "running" | "stopped">(
    "paused"
  );

  const pause = () => {
    setState("paused");
  };

  const start = () => {
    setState("running");
  };

  const resume = () => {
    setState("running");
  };

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // how to memoize the callback?
    // do i just `const memCb = useCallback(cb)?`
    // or callbackRef.current?
    intervalId.current = setInterval((...args: Parameters<typeof callback>) => {
      console.log("state:", state);
      if (state === "running") {
        callback(args);
      }
    }, time);
    return () => {
      clearInterval(intervalId.current);
    };
  }, [time]);

  return {
    pause,
    start,
    resume,
  };
}
