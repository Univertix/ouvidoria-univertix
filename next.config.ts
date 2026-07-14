import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb', // um pouco acima do limite de 10MB por arquivo, com folga pra múltiplos anexos
    },
  },
};

export default nextConfig;