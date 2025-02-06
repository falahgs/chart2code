/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.ytimg.com',
      'img.youtube.com',
      'youtube.com',
      'youtu.be',
      'yt3.ggpht.com',
      'yt3.googleusercontent.com'
    ],
  },
  api: {
    bodyParser: false,
  },
};

module.exports = nextConfig; 