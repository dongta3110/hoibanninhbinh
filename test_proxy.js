import fs from 'fs';

async function testCorsProxy() {
  fs.writeFileSync('test.txt', 'Hello world');
  
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', new Blob([fs.readFileSync('test.txt')]), 'test.txt');

  try {
    const res = await fetch('https://corsproxy.io/?https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    });
    const text = await res.text();
    console.log("Response:", text);
  } catch (e) {
    console.error("Error:", e);
  }
}

testCorsProxy();
