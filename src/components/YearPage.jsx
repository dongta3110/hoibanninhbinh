import React from 'react';
import PolaroidCard from './PolaroidCard';
import './YearPage.css';

const groupPhotosIntoAlbums = (photos) => {
  const albumsMap = new Map();
  photos.forEach(photo => {
    const key = `${photo.eventName}_${photo.date}`;
    if (!albumsMap.has(key)) {
      albumsMap.set(key, []);
    }
    albumsMap.get(key).push(photo);
  });
  return Array.from(albumsMap.values());
};

const MonthSection = ({ month, photos, onPhotoClick }) => {
  const albums = groupPhotosIntoAlbums(photos);

  albums.sort((a, b) => {
    const parseDate = (d) => {
      if (!d) return 0;
      const [day, month, year] = d.split('/');
      return new Date(`${year}-${month}-${day}`).getTime();
    };
    return parseDate(b[0].date) - parseDate(a[0].date);
  });

  return (
    <section className="month-section">
      <div className="month-header">
        <h2 className="month-title">Tháng {month}</h2>
        <div className="month-divider"></div>
      </div>
      <div className="photo-grid">
        {albums.map((album, index) => (
          <PolaroidCard 
            key={album[0].id || index} 
            photo={album[0]} 
            count={album.length}
            onClick={() => onPhotoClick(album[0], album, 0)} 
          />
        ))}
      </div>
    </section>
  );
};

const YearPage = ({ year, photos, onPhotoClick }) => {
  // Group photos by month
  const photosByMonth = photos.reduce((acc, photo) => {
    // Assuming date format is DD/MM/YYYY or similar where we can extract month
    // For mock data, let's just assume photo object has a 'month' property (1-12)
    const m = photo.month;
    if (!acc[m]) acc[m] = [];
    acc[m].push(photo);
    return acc;
  }, {});

  // Sort months ascending
  const sortedMonths = Object.keys(photosByMonth).sort((a, b) => Number(a) - Number(b));

  if (sortedMonths.length === 0) {
    return (
      <div className="empty-year">
        <p>Chưa có kỷ niệm nào trong năm {year}. Hãy thêm ảnh nhé!</p>
      </div>
    );
  }

  return (
    <div className="year-page">
      {sortedMonths.map(month => (
        <MonthSection 
          key={month} 
          month={month} 
          photos={photosByMonth[month]} 
          onPhotoClick={onPhotoClick} 
        />
      ))}
    </div>
  );
};

export default YearPage;
