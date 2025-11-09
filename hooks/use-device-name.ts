export const useDeviceName = () => {
  const getDeviceName = () => {
    // Check if we're in browser environment
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return "server";
    }

    const userAgent = navigator.userAgent;

    if (userAgent.includes("Windows")) return "windows";
    if (userAgent.includes("Macintosh")) return "macos";
    if (userAgent.includes("Linux")) return "linux";
    if (userAgent.includes("Android")) return "android";
    if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      return "ios";

    return "unknown";
  };

  return { getDeviceName };
};
