import React, { useState, useEffect } from 'react';
import EditPhotoModal from './EditPhotoModal';
import './Lightbox.css';

const Lightbox = ({ album, initialIndex = 0, onClose, onDelete, onEdit, onAddMore, onReorder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, album]);

  useEffect(() => {
    if (album && album[currentIndex]) {
      window.location.hash = `photo-${album[currentIndex].id}`;
    }
  }, [currentIndex, album]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!album || isEditing) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, album, isEditing]);

  if (!album || album.length === 0) return null;

  const photo = album[currentIndex];

  const handleDelete = () => {
    onDelete(photo.id);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? album.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === album.length - 1 ? 0 : prev + 1));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex || !onReorder) return;

    const newAlbum = [...album];
    const draggedItem = newAlbum[draggedIndex];
    newAlbum.splice(draggedIndex, 1);
    newAlbum.splice(targetIndex, 0, draggedItem);
    
    // Adjust currentIndex so the viewed photo stays the same
    if (currentIndex === draggedIndex) {
      setCurrentIndex(targetIndex);
    } else if (draggedIndex < currentIndex && targetIndex >= currentIndex) {
      setCurrentIndex(currentIndex - 1);
    } else if (draggedIndex > currentIndex && targetIndex <= currentIndex) {
      setCurrentIndex(currentIndex + 1);
    }

    onReorder(newAlbum);
    setDraggedIndex(null);
  };

  return (
    <>
      <div className="lightbox-overlay" onClick={onClose}>
        
        {album.length > 1 && (
          <>
            <button className="nav-btn prev-btn" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>❮</button>
            <button className="nav-btn next-btn" onClick={(e) => { e.stopPropagation(); handleNext(); }}>❯</button>
          </>
        )}

        <div className={`lightbox-content ${album.length > 1 ? 'with-thumbnails' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="lightbox-sidebar">
            <button className="action-btn btn-close" onClick={onClose}>✖ Đóng</button>
            <button className="action-btn btn-add" onClick={() => onAddMore(photo)}>➕ Thêm ảnh</button>
            <button className="action-btn btn-edit" onClick={() => setIsEditing(true)}>✏️ Sửa</button>
            <button className="action-btn btn-delete" onClick={handleDelete}>🗑️ Xóa</button>
          </div>

          {photo.type === 'video' || (photo.url && photo.url.match(/\.(mp4|webm|mov|ogg)$/i)) ? (
            <video src={photo.url} controls autoPlay className="lightbox-image" />
          ) : (
            <img src={photo.url} alt={photo.eventName} className="lightbox-image" />
          )}
          
          <div className="lightbox-info">
            <h2>{photo.eventName}</h2>
            <span className="lightbox-date">{photo.date}</span>
            {photo.notes && <p className="lightbox-notes">{photo.notes}</p>}
          </div>
        </div>

        {album.length > 1 && (
          <div className="lightbox-thumbnails" onClick={(e) => e.stopPropagation()}>
            {album.map((p, idx) => (
              <div 
                key={p.id} 
                className={`thumbnail-item ${idx === currentIndex ? 'active' : ''} ${idx === draggedIndex ? 'dragging' : ''}`}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              >
                {p.type === 'video' || (p.url && p.url.match(/\.(mp4|webm|mov|ogg)$/i)) ? (
                  <video src={p.url} className="thumbnail-video" preload="metadata" muted />
                ) : (
                  <img src={p.url} alt={`thumb-${idx}`} loading="lazy" draggable="false" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {isEditing && (
        <EditPhotoModal 
          photo={photo} 
          onClose={() => setIsEditing(false)} 
          onEdit={onEdit} 
        />
      )}
    </>
  );
};

export default Lightbox;
