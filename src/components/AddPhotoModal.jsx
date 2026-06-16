import React, { useState, useRef } from 'react';
import './AddPhotoModal.css';

const AddPhotoModal = ({ onClose, onAddPhoto, defaults }) => {
  const [formData, setFormData] = useState({
    files: [],
    eventName: defaults?.eventName || '',
    date: defaults?.date || '',
    notes: defaults?.notes || ''
  });
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    current: 0,
    total: 0
  });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, files: Array.from(e.target.files) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.files.length === 0 || !formData.date || !formData.eventName) {
      alert("Vui lòng chọn ít nhất 1 ảnh, điền tên sự kiện và ngày!");
      return;
    }
    
    setUploadState({ isUploading: true, current: 0, total: formData.files.length });
    const uploadedPhotos = [];
    
    try {
      const IMGBB_API_KEY = 'c2de24697f8c55b3216d22796a2e088a'; 
      const dateObj = new Date(formData.date);
      const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;

      for (let i = 0; i < formData.files.length; i++) {
        setUploadState(prev => ({ ...prev, current: i + 1 }));
        
        const file = formData.files[i];
        const imgData = new FormData();
        imgData.append('image', file);
        
        const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: imgData
        });
        const uploadData = await uploadRes.json();
        
        if (!uploadData.success) {
          throw new Error(uploadData.error?.message || "Upload failed");
        }

        const newPhoto = {
          id: Date.now() + i, // ensure unique ID
          year: year,
          month: month,
          date: formattedDate,
          url: uploadData.data.url,
          eventName: formData.eventName,
          notes: formData.notes
        };
        
        uploadedPhotos.push(newPhoto);
      }

      onAddPhoto(uploadedPhotos);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      alert("Đã xảy ra lỗi trong quá trình tải ảnh lên. Những ảnh đã tải xong sẽ được lưu lại.");
      if (uploadedPhotos.length > 0) {
        onAddPhoto(uploadedPhotos);
      }
    } finally {
      setUploadState({ isUploading: false, current: 0, total: 0 });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Thêm Kỷ Niệm Mới</h2>
        <form onSubmit={handleSubmit} className="add-photo-form">
          
          <div className="form-group">
            <label>Chọn ảnh từ máy tính (Có thể chọn nhiều ảnh)</label>
            <input 
              type="file" 
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              required
            />
            {formData.files.length > 0 && (
              <p style={{marginTop: '5px', fontSize: '0.9rem', color: 'var(--accent-color)'}}>
                Đã chọn {formData.files.length} bức ảnh
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Tên sự kiện</label>
            <input 
              type="text" 
              name="eventName" 
              placeholder="Ví dụ: Cà phê cuối tuần" 
              value={formData.eventName} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ngày chụp</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ghi chú (Tùy chọn)</label>
            <textarea 
              name="notes" 
              placeholder="Viết gì đó deep deep..." 
              value={formData.notes} 
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={uploadState.isUploading}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={uploadState.isUploading}>
              {uploadState.isUploading 
                ? `Đang tải lên... (${uploadState.current}/${uploadState.total})` 
                : "Lưu Kỷ Niệm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPhotoModal;
