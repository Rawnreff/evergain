/**
 * API Configuration
 * 
 * IMPORTANT: Update LOCAL_IP if your computer's local IP address changes
 * 
 * How to find your local IP:
 * - Windows: Run `ipconfig` in cmd, look for IPv4 Address
 * - Mac/Linux: Run `ifconfig` or `ip addr`
 * 
 * Make sure your mobile device is on the SAME WiFi network as your computer!
 */

export const API_CONFIG = {
    // Your computer's local IP address
    LOCAL_IP: '192.168.1.5',

    // Backend port
    PORT: 8080,

    // Get base URL based on platform
    getBaseUrl: (platform: string) => {
        const { LOCAL_IP, PORT } = API_CONFIG;

        if (platform === 'web') {
            // Web uses localhost
            return `http://localhost:${PORT}/api`;
        } else if (platform === 'android') {
            // Android physical device uses local IP
            // Note: Emulators would use 10.0.2.2, but Expo Go is always physical
            return `http://${LOCAL_IP}:${PORT}/api`;
        } else if (platform === 'ios') {
            // iOS Simulator can use localhost
            // Physical device would use local IP
            return `http://localhost:${PORT}/api`;
        }

        // Default to local IP for other platforms
        return `http://${LOCAL_IP}:${PORT}/api`;
    }
};
