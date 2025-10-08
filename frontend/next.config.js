const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://host.docker.internal:3001';
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/geo/process',
        destination: `${API_URL}/geo/process`,
      },
    ];
  }
};
