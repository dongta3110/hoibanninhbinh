import React, { useState } from 'react';
import './PolaroidCard.css';

const PolaroidCard = ({ photo, album, count = 1, onClick, onDeleteAlbum, onEditAlbum }) => {
  const [showMenu, setShowMenu] = useState(false);
  const rotation = React.useMemo(() => (Math.random() * 6 - 3).toFixed(2), []);

  return (
    <div 
      className="polaroid-card" 
      style={{ '--rotate': `${rotation}deg` }}
      onClick={() => onClick(photo)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className="polaroid-image-container">
        {photo.type === 'video' || (photo.url && photo.url.match(/\.(mp4|webm|mov|ogg)$/i)) ? (
          <>
            <video src={photo.url} className="polaroid-image" preload="metadata" muted playsInline />
            <div className="polaroid-video-icon">▶</div>
          </>
        ) : (
          <img src={photo.url} alt={photo.eventName} className="polaroid-image" loading="lazy" />
        )}
        {count > 1 && (
          <div className="polaroid-count-badge">+{count - 1}</div>
        )}
        <button 
          className="polaroid-menu-btn" 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
        >
          ⋮
        </button>
        {showMenu && (
          <div className="polaroid-dropdown-menu">
            <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEditAlbum(album); }}>
              ✏️ Sửa
            </button>
            <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDeleteAlbum(album); }}>
              🗑️ Xóa
            </button>
          </div>
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
