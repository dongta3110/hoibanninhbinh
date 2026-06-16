import React from 'react';
import './PolaroidCard.css';

const PolaroidCard = ({ photo, count = 1, onClick }) => {
  // Generate a random slight rotation between -3deg and 3deg for organic look
  const rotation = React.useMemo(() => (Math.random() * 6 - 3).toFixed(2), []);

  return (
    <div 
      className="polaroid-card" 
      style={{ '--rotate': `${rotation}deg` }}
      onClick={() => onClick(photo)}
    >
      <div className="polaroid-image-container">
        <img src={photo.url} alt={photo.eventName} className="polaroid-image" loading="lazy" />
        {count > 1 && (
          <div className="polaroid-count-badge">+{count - 1}</div>
        )}
      </div>
      <div className="polaroid-caption">
        <h3 className="polaroid-event">{photo.eventName}</h3>
        <p className="polaroid-date">{photo.date}</p>
        {photo.notes && <p className="polaroid-notes">{photo.notes}</p>}
      </div>
    </div>
  );
};

export default PolaroidCard;
