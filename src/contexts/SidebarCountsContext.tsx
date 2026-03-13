import React, { createContext, useContext, useCallback } from "react";

type SidebarCountsContextValue = {
  refreshCounts: () => void;
};

const SidebarCountsContext = createContext<SidebarCountsContextValue | null>(
  null
);

export const SidebarCountsProvider: React.FC<{
  refreshCounts: () => void;
  children: React.ReactNode;
}> = ({ refreshCounts, children }) => {
  const value = React.useMemo(
    () => ({ refreshCounts }),
    [refreshCounts]
  );
  return (
    <SidebarCountsContext.Provider value={value}>
      {children}
    </SidebarCountsContext.Provider>
  );
};

export const useRefreshSidebarCounts = (): (() => void) => {
  const ctx = useContext(SidebarCountsContext);
  return useCallback(() => {
    ctx?.refreshCounts();
  }, [ctx]);
};
