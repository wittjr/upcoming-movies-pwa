const withPWA = require('next-pwa')({
    dest: 'public',
    swSrc: 'service-worker.js',
    register: true,
    skipWaiting: true,
    disable:process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
    // next.js config
    output: 'standalone',
    webpack(config) {
        config.experiments = { ...config.experiments, topLevelAwait: true }
        return config
    }
})