/** @type {import('next').Nextjonfig} */
const nextConfig = {}

module.exports = {
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: '/',
            },
        ];
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true
    }
};
