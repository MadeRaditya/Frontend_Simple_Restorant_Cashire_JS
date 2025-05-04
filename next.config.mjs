/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/v1/:path*',
            },
            {
                source: '/public/assets/img/:path*',
                destination: 'http://localhost:5000/api/v1/public/assets/img/:path*',
            }
        ];
    },
};


export default nextConfig;
