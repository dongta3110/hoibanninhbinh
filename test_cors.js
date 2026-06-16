
async function checkCors() {
  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST'
    }
  });
  console.log("CORS headers:", res.headers.get('access-control-allow-origin'));
}
checkCors();
