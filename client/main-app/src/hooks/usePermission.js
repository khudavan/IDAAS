// src/hooks/usePermission.js
import { useEffect, useState } from "react";
import API from "../api/api";

/**
 * Checks permission by calling backend:
 * POST /main/permissions/check { action, resource } -> { allow: boolean }
 */
export default function usePermission(action, resource) {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    async function check() {
      setChecking(true);
      try {
        const { data } = await API.post("/main/permissions/check", { action, resource });
        if (alive) setAllowed(!!data?.allow);
      } catch {
        if (alive) setAllowed(false);
      } finally {
        if (alive) setChecking(false);
      }
    }
    check();
    return () => { alive = false; };
  }, [action, resource]);

  return { allowed, checking };
}
