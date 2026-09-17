import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import './KPISForm.css';

function KPISForm({ employees, rules, onAddViolation, recentViolations, onDeleteViolation }) {
  const [employeeName, setEmployeeName] = useState('');
  const [violationType, setViolationType] = useState('');
  const [selectedError, setSelectedError] = useState('');
  const [notes, setNotes] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Auto-complete cho tên nhân viên
  const handleEmployeeInput = (value) => {
    setEmployeeName(value);
    if (value.trim().length > 0) {
      const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Lấy các lỗi khả dụng cho loại vi phạm
  const availableErrors = useMemo(() => {
    if (!violationType) return [];
    const rule = rules[violationType];
    if (!rule) return [];
    return rule.criteria;
  }, [violationType, rules]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!employeeName.trim() || !violationType || !selectedError) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    onAddViolation(employeeName, violationType, selectedError, notes);

    // Reset form
    setEmployeeName('');
    setViolationType('');
    setSelectedError('');
    setNotes('');
    setSuggestions([]);

    alert('✅ Ghi nhận lỗi thành công!');
  };

  return (
    <div className="kpis-form-container">
      <div className="form-section">
        <h2>📝 Ghi nhận lỗi KPIS</h2>

        <form onSubmit={handleSubmit} className="form">
          {/* Tên nhân viên */}
          <div className="form-group">
            <label htmlFor="employee">Tên nhân viên *</label>
            <div className="autocomplete-wrapper">
              <input
                id="employee"
                type="text"
                value={employeeName}
                onChange={(e) => handleEmployeeInput(e.target.value)}
                placeholder="Nhập tên nhân viên..."
                className="form-input"
              />
              {suggestions.length > 0 && (
                <ul className="suggestions">
                  {suggestions.map((emp) => (
                    <li
                      key={emp.id}
                      onClick={() => {
                        setEmployeeName(emp.name);
                        setSuggestions([]);
                      }}
                    >
                      {emp.name} ({emp.dept})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Loại vi phạm */}
          <div className="form-group">
            <label htmlFor="violationType">Loại vi phạm *</label>
            <select
              id="violationType"
              value={violationType}
              onChange={(e) => {
                setViolationType(e.target.value);
                setSelectedError('');
              }}
              className="form-input"
            >
              <option value="">-- Chọn loại vi phạm --</option>
              {Object.keys(rules).map((rule) => (
                <optgroup key={rule} label={rules[rule].category}>
                  <option value={rule}>{rule}</option>
                </optgroup>
              ))}
            </select>
          </div>

          {/* Chi tiết lỗi */}
          {availableErrors.length > 0 && (
            <div className="form-group">
              <label htmlFor="error">Chi tiết lỗi *</label>
              <select
                id="error"
                value={selectedError}
                onChange={(e) => setSelectedError(e.target.value)}
                className="form-input"
              >
                <option value="">-- Chọn chi tiết lỗi --</option>
                {availableErrors.map((err, idx) => (
                  <option key={idx} value={err.error}>
                    {err.error} ({err.points} điểm)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Ghi chú */}
          <div className="form-group">
            <label htmlFor="notes">Ghi chú (tuỳ chọn)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mô tả chi tiết về lỗi (nếu có)..."
              className="form-input"
              rows={3}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            ✅ Lưu lỗi
          </button>
        </form>
      </div>

      {/* Lỗi gần đây */}
      <div className="recent-section">
        <h2>📋 Lỗi gần đây ({recentViolations.length})</h2>

        {recentViolations.length === 0 ? (
          <p className="empty-state">Chưa có ghi nhận lỗi nào.</p>
        ) : (
          <div className="violations-list">
            {recentViolations.map((v) => (
              <div key={v.id} className="violation-card">
                <div className="violation-header">
                  <strong>{v.employeeName}</strong>
                  <span className="dept-badge">{v.dept}</span>
                  <span className={`points-badge ${v.points < 0 ? 'negative' : ''}`}>
                    {v.points} điểm
                  </span>
                </div>
                <div className="violation-body">
                  <p className="violation-type">{v.violationType}</p>
                  <p className="violation-error">{v.error}</p>
                  {v.notes && <p className="violation-notes">{v.notes}</p>}
                  <p className="violation-time">{format(new Date(v.date), 'dd/MM/yyyy HH:mm:ss')}</p>
                </div>
                <button
                  onClick={() => onDeleteViolation(v.id)}
                  className="btn btn-sm btn-danger"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default KPISForm;
