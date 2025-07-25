import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6dbfb6073506400dab2696409aedc668',
  appName: 'FF TopUp Nepal',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://6dbfb607-3506-400d-ab26-96409aedc668.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;