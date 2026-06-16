import React, { useState } from 'react';
import './AddPhotoModal.css'; // Reuse CSS from AddPhotoModal

const EditPhotoModal = ({ photo, onClose, onEdit }) => {
  // Convert DD/MM/YYYY to YYYY-MM-DD for the input[type="date"]
  const parts = (photo.date || '').split('/');
  const defaultDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : '';

  const [formData, setFormData] = useState({
    eventName: photo.eventName || '',
    date: defaultDate,
    notes: photo.notes || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.eventName) {
      alert("Vui lòng điền tên sự kiện và ngày!");
      return;
    }
    
    setIsSaving(true);
    try {
      const dateObj = new Date(formData.date);
      const updatedData = {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        date: `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`,
        eventName: formData.eventName,
        notes: formData.notes
      };

      await onEdit(photo.id, updatedData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Chỉnh Sửa Kỷ Niệm</h2>
        <form onSubmit={handleSubmit} className="add-photo-form">
          <div className="form-group">
            <label>Tên sự kiện</label>
            <input 
              type="text" 
              name="eventName" 
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
              value={formData.notes} 
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSaving}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPhotoModal;
