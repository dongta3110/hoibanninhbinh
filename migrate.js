import fs from 'fs';

const data = fs.readFileSync('server/data.json', 'utf8');

fetch('https://album-c1d95-default-rtdb.asia-southeast1.firebasedatabase.app/photos.json', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: data
}).then(async (r) => {
  console.log('Migration Complete. Status:', r.status);
}).catch(console.error);
