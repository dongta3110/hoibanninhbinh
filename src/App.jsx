import React, { useState } from 'react';
import YearNavigation from './components/YearNavigation';
import YearPage from './components/YearPage';
import Lightbox from './components/Lightbox';
import AddPhotoModal from './components/AddPhotoModal';
import EditPhotoModal from './components/EditPhotoModal';
import ConfirmModal from './components/ConfirmModal';
import OnThisDay from './components/OnThisDay';
import './App.css';

// Initial Mock data
// We now fetch data from our local backend, so INITIAL_PHOTOS is empty.
const INITIAL_PHOTOS = [];

function App() {
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaults, setAddModalDefaults] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const FIREBASE_URL = 'https://album-c1d95-default-rtdb.asia-southeast1.firebasedatabase.app/photos.json';

  const savePhotosToFirebase = async (newPhotosArray) => {
    try {
      await fetch(FIREBASE_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhotosArray)
      });
    } catch (error) {
      console.error("Error saving to Firebase:", error);
    }
  };

  // Fetch photos from Firebase on mount
  React.useEffect(() => {
    fetch(FIREBASE_URL)
      .then(res => res.json())
      .then(data => {
        let loadedPhotos = [];
        if (Array.isArray(data)) {
           loadedPhotos = data.filter(Boolean);
        } else if (data && typeof data === 'object') {
           loadedPhotos = Object.values(data);
        }
        setPhotos(loadedPhotos);
        const uniqueYears = [...new Set(loadedPhotos.map(p => p.year))].sort((a, b) => b - a);
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0]);
        }
      })
      .catch(err => console.error("Failed to fetch photos:", err));
  }, []);

  // Calculate available years dynamically
  const years = [...new Set(photos.map(p => p.year))].sort((a, b) => b - a);

  const handleSelectYear = (year) => {
    setSelectedYear(year);
  };

  const handlePhotoClick = (photo, album = null, index = 0) => {
    if (album) {
      setActiveAlbum(album);
      setActivePhotoIndex(index);
    } else {
      const foundAlbum = photos.filter(p => p.eventName === photo.eventName && p.date === photo.date);
      const foundIndex = foundAlbum.findIndex(p => p.id === photo.id);
      setActiveAlbum(foundAlbum.length > 0 ? foundAlbum : [photo]);
      setActivePhotoIndex(foundIndex >= 0 ? foundIndex : 0);
    }
  };

  const closeLightbox = () => {
    setActiveAlbum(null);
  };

  const handleAddPhoto = async (newPhotos) => {
    try {
      const photosArray = Array.isArray(newPhotos) ? newPhotos : [newPhotos];
      const newArray = [...photosArray, ...photos];
      setPhotos(newArray);
      
      if (activeAlbum) {
        const firstSaved = photosArray[0];
        const currentFirst = activeAlbum[0];
        if (currentFirst && firstSaved.eventName === currentFirst.eventName && firstSaved.date === currentFirst.date) {
          setActiveAlbum(prev => [...prev, ...photosArray]);
        }
      }

      if (photosArray[0].year !== selectedYear) {
        setSelectedYear(photosArray[0].year);
      }
      
      setIsAddModalOpen(false);
      setAddModalDefaults(null);

      await savePhotosToFirebase(newArray);
    } catch (error) {
      console.error("Error saving photo:", error);
      alert("Đã có lỗi xảy ra khi lưu ảnh xuống máy chủ!");
    }
  };

  const handleDeletePhoto = async (id) => {
    try {
      const newArray = photos.filter(p => p.id !== id);
      setPhotos(newArray);
      if (activeAlbum) {
        const newAlbum = activeAlbum.filter(p => p.id !== id);
        if (newAlbum.length === 0) {
          setActiveAlbum(null);
        } else {
          setActiveAlbum(newAlbum);
          setActivePhotoIndex(prev => prev >= newAlbum.length ? newAlbum.length - 1 : prev);
        }
      }
      await savePhotosToFirebase(newArray);
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Đã có lỗi xảy ra khi xóa ảnh!");
    }
  };

  const confirmDeletePhoto = (id) => {
    setConfirmState({
      isOpen: true,
      title: "Xóa Kỷ Niệm",
      message: "Bạn có chắc chắn muốn xóa bức ảnh này khỏi nhật ký không?",
      onConfirm: () => {
        setConfirmState({ isOpen: false });
        handleDeletePhoto(id);
      }
    });
  };

  const handleEditPhoto = async (id, updatedData) => {
    try {
      const newArray = photos.map(p => p.id === id ? { ...p, ...updatedData } : p);
      setPhotos(newArray);
      if (activeAlbum) {
        setActiveAlbum(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
      }
      await savePhotosToFirebase(newArray);
    } catch (error) {
      console.error("Error updating photo:", error);
      alert("Đã có lỗi xảy ra khi sửa ảnh!");
    }
  };

  const handleDeleteAlbum = (album) => {
    const isSingle = album.length === 1;
    const title = isSingle ? "Xóa Ảnh" : "Xóa Album";
    const message = isSingle 
      ? `Bạn có chắc chắn muốn xóa ảnh "${album[0].eventName}" không?`
      : `Bạn có chắc chắn muốn xóa toàn bộ album "${album[0].eventName}" (${album.length} ảnh) không?`;

    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        setConfirmState({ isOpen: false });
        try {
          const albumIds = new Set(album.map(p => p.id));
          const newArray = photos.filter(p => !albumIds.has(p.id));
          setPhotos(newArray);
          if (activeAlbum && activeAlbum[0].eventName === album[0].eventName && activeAlbum[0].date === album[0].date) {
             setActiveAlbum(null);
          }
          await savePhotosToFirebase(newArray);
        } catch (error) {
          console.error("Error deleting album:", error);
          alert("Đã có lỗi xảy ra khi xóa sự kiện!");
        }
      }
    });
  };

  const handleEditAlbumClick = (album) => {
    setEditingAlbum(album);
  };

  const handleEditAlbumSubmit = async (dummyId, updatedData) => {
    try {
      const albumIds = new Set(editingAlbum.map(p => p.id));
      const newArray = photos.map(p => albumIds.has(p.id) ? { ...p, ...updatedData } : p);
      setPhotos(newArray);
      if (activeAlbum && activeAlbum[0].eventName === editingAlbum[0].eventName && activeAlbum[0].date === editingAlbum[0].date) {
        setActiveAlbum(prev => prev.map(p => albumIds.has(p.id) ? { ...p, ...updatedData } : p));
      }
      setEditingAlbum(null);
      await savePhotosToFirebase(newArray);
    } catch (error) {
      console.error("Error updating album:", error);
      alert("Đã có lỗi xảy ra khi sửa sự kiện!");
    }
  };

  const handleAddMoreToAlbum = (photo) => {
    const parts = photo.date.split('/');
    let defaultDate = '';
    if (parts.length === 3) {
      defaultDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    setAddModalDefaults({
      eventName: photo.eventName,
      date: defaultDate,
      notes: photo.notes || ''
    });
    setIsAddModalOpen(true);
  };

  const handleReorderAlbum = async (reorderedAlbum) => {
    if (!reorderedAlbum || reorderedAlbum.length === 0) return;
    
    const albumIds = new Set(reorderedAlbum.map(p => p.id));
    const photosWithoutAlbum = photos.filter(p => !albumIds.has(p.id));
    const firstIndex = photos.findIndex(p => albumIds.has(p.id));
    const insertIndex = firstIndex >= 0 ? firstIndex : 0;
    
    const newPhotos = [
      ...photosWithoutAlbum.slice(0, insertIndex),
      ...reorderedAlbum,
      ...photosWithoutAlbum.slice(insertIndex)
    ];

    // Optimistic UI update
    setPhotos(newPhotos);
    setActiveAlbum(reorderedAlbum);
    await savePhotosToFirebase(newPhotos);
  };

  const currentYearPhotos = photos.filter(p => p.year === selectedYear);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Hội Bạn Không Thân Ninh Bình</h1>
        <p className="subtitle">Lưu giữ từng khoảnh khắc thanh xuân</p>
      </header>
      
      <OnThisDay photos={photos} onPhotoClick={handlePhotoClick} />

      {years.length > 0 && (
        <YearNavigation 
          years={years} 
          selectedYear={selectedYear} 
          onSelectYear={handleSelectYear} 
        />
      )}

      <main>
        <YearPage 
          year={selectedYear} 
          photos={currentYearPhotos} 
          onPhotoClick={handlePhotoClick} 
          onDeleteAlbum={handleDeleteAlbum}
          onEditAlbum={handleEditAlbumClick}
        />
      </main>

      <Lightbox 
        album={activeAlbum} 
        initialIndex={activePhotoIndex}
        onClose={closeLightbox} 
        onDelete={confirmDeletePhoto}
        onEdit={handleEditPhoto}
        onAddMore={handleAddMoreToAlbum}
        onReorder={handleReorderAlbum}
      />
      
      {isAddModalOpen && (
        <AddPhotoModal 
          defaults={addModalDefaults}
          onClose={() => {
            setIsAddModalOpen(false);
            setAddModalDefaults(null);
          }} 
          onAddPhoto={handleAddPhoto} 
        />
      )}

      {editingAlbum && (
        <EditPhotoModal 
          photo={editingAlbum[0]} 
          onClose={() => setEditingAlbum(null)} 
          onEdit={handleEditAlbumSubmit} 
        />
      )}

      <button className="fab-add-btn" onClick={() => { setAddModalDefaults(null); setIsAddModalOpen(true); }}>
        +
      </button>

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState({ isOpen: false })}
      />
    </div>
  );
}

export default App;
