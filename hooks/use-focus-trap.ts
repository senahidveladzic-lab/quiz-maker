"use client";

import { useEffect, useRef } from "react";

export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      setTimeout(() => {
        ref.current?.focus();
      }, 100);
    }
  }, []);

  return ref;
}
