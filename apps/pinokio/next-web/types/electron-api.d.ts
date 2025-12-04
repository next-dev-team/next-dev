declare global {
  interface Window {
    electronAPI?: {
      startPinokio: () => Promise<{ started: boolean; port?: number }>;
      setDashboardView: (config: {
        view: "home" | "dashboard";
        port?: number | null;
        headerHeight?: number;
      }) => Promise<void>;
    };
  }
}
export {};
