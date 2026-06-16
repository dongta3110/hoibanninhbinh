export const getOptimizedImageUrl = (url, width = 400, height = null) => {
  if (!url) return '';
  // Do not proxy video files or non-http URLs
  if (url.match(/\.(mp4|webm|mov|ogg)$/i) || !url.startsWith('http')) return url;
  // Do not proxy catbox videos disguised without extension
  if (url.includes('catbox.moe') && url.match(/\.(mp4|webm)$/i)) return url;
  
  let optimizedUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp`;
  if (height) {
    optimizedUrl += `&h=${height}&fit=cover`;
  }
  return optimizedUrl;
};
