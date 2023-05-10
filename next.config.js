const withPWA = require('next-pwa')({
    dest: 'public',
    output: 'standalone',
    // swSrc: 'service-worker.js'
    // register: true,
    // skipWaiting: true,
})

module.exports = withPWA({
    // next.js config
    
})