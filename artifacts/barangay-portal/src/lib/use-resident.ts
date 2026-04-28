import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGetResident, getGetResidentQueryKey } from "@workspace/api-client-react";

export function useResident() {
  const [location, setLocation] = useLocation();
  const [residentId, setResidentId] = useState<number | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("residentId");
    if (storedId) {
      setResidentId(Number(storedId));
    }
  }, [location]);

  const { data: resident } = useGetResident(residentId ?? 0, {
    query: {
      enabled: !!residentId,
      queryKey: getGetResidentQueryKey(residentId ?? 0),
    },
  });

  const signOut = () => {
    localStorage.removeItem("residentId");
    localStorage.removeItem("residentEmail");
    setResidentId(null);
    setLocation("/resident/login");
  };

  return { resident, residentId, signOut };
}
