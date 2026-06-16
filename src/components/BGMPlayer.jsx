import React, { useState, useEffect, useRef } from 'react';
import './BGMPlayer.css';

// Nhạc Lofi Chill mặc định (bạn có thể thay link nhạc khác vào đây)
const DEFAULT_BGM = "/nhungayhomqua.webm"; 

const BGMPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(DEFAULT_BGM);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4; // Âm lượng 40%

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error("Lỗi phát nhạc:", e);
        alert("Trình duyệt chặn phát nhạc tự động hoặc link nhạc bị hỏng!");
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      className={`bgm-btn ${isPlaying ? 'playing' : 'paused'}`} 
      onClick={togglePlay} 
      title="Bật/Tắt Nhạc Nền"
    >
      {isPlaying ? (
        <>
          <span className="music-bars">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </span>
          Tắt Nhạc
        </>
      ) : (
        <>
          <span>🎵</span> Bật Nhạc
        </>
      )}
    </button>
  );
};

export default BGMPlayer;
