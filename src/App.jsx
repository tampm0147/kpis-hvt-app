import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import KPISForm from './components/KPISForm';
import KPISDashboard from './components/KPISDashboard';
import { KPIS_RULES, DEPARTMENTS } from './lib/kpisRules';
import './App.css';

function App() {
  const [violations, setViolations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('input'); // input, daily, weekly, monthly
  const [currentDate, setCurrentDate] = useState(new Date());

  // Load data từ localStorage
  useEffect(() => {
    const savedViolations = localStorage.getItem('kpis_violations');
    const savedEmployees = localStorage.getItem('kpis_employees');

    if (savedViolations) {
      setViolations(JSON.parse(savedViolations));
    }

    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    } else {
      // Initial employees - thường sẽ import từ Excel
      const initialEmployees = [
        { id: 1, name: 'Nguyễn Văn A', dept: 'SEC', role: 'nhân viên' },
        { id: 2, name: 'Trần Thị B', dept: 'F&B', role: 'nhân viên' },
        { id: 3, name: 'Phạm Văn C', dept: 'KIT', role: 'giám sát' },
        { id: 4, name: 'Hoàng Thị D', dept: 'H.S', role: 'nhân viên' },
        { id: 5, name: 'Đinh Văn E', dept: 'TECH', role: 'nhân viên' },
      ];
      setEmployees(initialEmployees);
      localStorage.setItem('kpis_employees', JSON.stringify(initialEmployees));
    }
  }, []);

  // Save violations khi thay đổi
  useEffect(() => {
    if (violations.length > 0) {
      localStorage.setItem('kpis_violations', JSON.stringify(violations));
    }
  }, [violations]);

  const handleAddViolation = (employeeName, violationType, selectedError, notes) => {
    const employee = employees.find(e => 
      e.name.toLowerCase() === employeeName.toLowerCase()
    );

    if (!employee) {
      alert('Không tìm thấy nhân viên. Vui lòng kiểm tra tên.');
      return;
    }

    // Lấy điểm từ rule
    const rule = KPIS_RULES[violationType];
    const errorDetail = rule.criteria.find(c => c.error === selectedError);

    if (!errorDetail) {
      alert('Không tìm thấy chi tiết lỗi.');
      return;
    }

    const newViolation = {
      id: Date.now(),
      employeeId: employee.id,
      employeeName: employee.name,
      dept: employee.dept,
      violationType,
      error: selectedError,
      points: errorDetail.points,
      notes,
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };

    setViolations([...violations, newViolation]);
  };

  const handleDeleteViolation = (id) => {
    if (window.confirm('Xác nhận xóa lỗi này?')) {
      setViolations(violations.filter(v => v.id !== id));
    }
  };

  const handleExportData = (format_type) => {
    const dataStr = JSON.stringify(violations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kpis_${format_type}_${new Date().getTime()}.json`;
    link.click();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📊 Hệ thống theo dõi KPIS - Bảo vệ VVK</h1>
        <p className="subtitle">Quản lý hiệu suất nhân viên hằng ngày</p>
      </header>

      <nav className="app-nav">
        <button 
          className={`nav-btn ${activeTab === 'input' ? 'active' : ''}`}
          onClick={() => setActiveTab('input')}
        >
          ➕ Ghi nhận lỗi
        </button>
        <button 
          className={`nav-btn ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          📅 Báo cáo ngày
        </button>
        <button 
          className={`nav-btn ${activeTab === 'weekly' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          📈 Báo cáo tuần
        </button>
        <button 
          className={`nav-btn ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          📊 Báo cáo tháng
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'input' && (
          <KPISForm 
            employees={employees}
            rules={KPIS_RULES}
            onAddViolation={handleAddViolation}
            recentViolations={violations.slice(-10).reverse()}
            onDeleteViolation={handleDeleteViolation}
          />
        )}

        {activeTab === 'daily' && (
          <KPISDashboard
            violations={violations}
            employees={employees}
            type="daily"
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        )}

        {activeTab === 'weekly' && (
          <KPISDashboard
            violations={violations}
            employees={employees}
            type="weekly"
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        )}

        {activeTab === 'monthly' && (
          <KPISDashboard
            violations={violations}
            employees={employees}
            type="monthly"
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Version 1.0 | Powered by React + Supabase | Deploy: Cloudflare Pages</p>
      </footer>
    </div>
  );
}

export default App;
