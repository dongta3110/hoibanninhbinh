import React from 'react';
import './OnThisDay.css';

const OnThisDay = ({ photos, onPhotoClick }) => {
  // Get today's date
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentYear = today.getFullYear();

  // Find photos that match today's day and month, but NOT this exact year
  const onThisDayPhotos = photos.filter(photo => {
    if (photo.month !== currentMonth || photo.year >= currentYear) return false;
    
    // Parse photo.date "DD/MM/YYYY" to get the day
    const parts = photo.date.split('/');
    if (parts.length >= 1) {
      const day = parseInt(parts[0], 10);
      return day === currentDay;
    }
    return false;
  });

  if (onThisDayPhotos.length === 0) {
    return null; // Don't render anything if there are no memories for today
  }

  // Pick a random memory to highlight if there are multiple, or just the first one
  const highlightedPhoto = onThisDayPhotos[Math.floor(Math.random() * onThisDayPhotos.length)];
  const yearsAgo = currentYear - highlightedPhoto.year;

  return (
    <div className="on-this-day-container">
      <div className="on-this-day-badge">
        <span>Ngày này năm xưa</span>
      </div>
      <div className="on-this-day-content" onClick={() => onPhotoClick(highlightedPhoto)}>
        <div className="on-this-day-image">
          <img src={highlightedPhoto.url} alt="Kỷ niệm" />
        </div>
        <div className="on-this-day-text">
          <h3>{yearsAgo} năm trước...</h3>
          <p className="on-this-day-event">{highlightedPhoto.eventName}</p>
          <p className="on-this-day-note">{highlightedPhoto.notes}</p>
        </div>
      </div>
    </div>
  );
};

export default OnThisDay;
