import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
  images: {
		remotePatterns: [{
      protocol:"https",
      hostname:"images.unsplash.com",
      port:"",
      pathname:"/**"
    }]
	}
}
// module.exports = {
// 	images: {
// 		remotePatterns: [new URL('https://images.unsplash.com/photo**')]
// 	}
// }

export default nextConfig
