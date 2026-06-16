import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Utility function to read data
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
};

// Utility function to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data:', error);
  }
};

// GET all photos
app.get('/api/photos', (req, res) => {
  const photos = readData();
  res.json(photos);
});

// POST new photo
app.post('/api/photos', (req, res) => {
  const newPhoto = req.body;
  const photos = readData();
  
  // Prepend new photo
  photos.unshift(newPhoto);
  writeData(photos);
  
  res.status(201).json(newPhoto);
});

// PUT update photo
app.put('/api/photos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedPhoto = req.body;
  const photos = readData();
  
  const index = photos.findIndex(p => p.id === id);
  if (index !== -1) {
    photos[index] = { ...photos[index], ...updatedPhoto };
    writeData(photos);
    res.json(photos[index]);
  } else {
    res.status(404).json({ error: 'Photo not found' });
  }
});

// DELETE photo
app.delete('/api/photos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let photos = readData();
  
  photos = photos.filter(p => p.id !== id);
  writeData(photos);
  
  res.status(204).send();
});

// PUT bulk update photos
app.put('/api/photos/bulk', (req, res) => {
  const newPhotos = req.body;
  if (!Array.isArray(newPhotos)) {
    return res.status(400).json({ error: 'Body must be an array' });
  }
  writeData(newPhotos);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
