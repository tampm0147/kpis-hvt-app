import React, { useMemo, useState } from 'react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './KPISDashboard.css';

function KPISDashboard({ violations, employees, type, currentDate, onDateChange }) {
  const [selectedDept, setSelectedDept] = useState('all');

  // Lọc vi phạm theo khoảng thời gian
  const filteredViolations = useMemo(() => {
    let start, end;

    if (type === 'daily') {
      start = startOfDay(currentDate);
      end = endOfDay(currentDate);
    } else if (type === 'weekly') {
      start = startOfWeek(currentDate);
      end = endOfWeek(currentDate);
    } else if (type === 'monthly') {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
    }

    return violations.filter(v => {
      const vDate = new Date(v.date);
      return vDate >= start && vDate <= end && (selectedDept === 'all' || v.dept === selectedDept);
    });
  }, [violations, type, currentDate, selectedDept]);

  // Tính toán KPIS theo nhân viên
  const employeeScores = useMemo(() => {
    const scores = {};

    employees.forEach(emp => {
      scores[emp.id] = {
        name: emp.name,
        dept: emp.dept,
        totalPoints: 100, // Điểm mặc định
        violations: 0,
      };
    });

    filteredViolations.forEach(v => {
      const empKey = employees.find(e => e.name === v.employeeName)?.id;
      if (empKey && scores[empKey]) {
        scores[empKey].totalPoints += v.points;
        scores[empKey].violations += 1;
      }
    });

    return Object.values(scores).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [employees, filteredViolations]);

  // Dữ liệu cho biểu đồ
  const chartData = useMemo(() => {
    return employeeScores.map(emp => ({
      name: emp.name,
      score: emp.totalPoints,
      violations: emp.violations,
    }));
  }, [employeeScores]);

  // Tính toán thống kê theo bộ phận
  const deptStats = useMemo(() => {
    const stats = {};

    filteredViolations.forEach(v => {
      if (!stats[v.dept]) {
        stats[v.dept] = {
          dept: v.dept,
          violations: 0,
          totalPoints: 0,
        };
      }
      stats[v.dept].violations += 1;
      stats[v.dept].totalPoints += Math.abs(v.points);
    });

    return Object.values(stats);
  }, [filteredViolations]);

  // Lỗi phổ biến nhất
  const topErrors = useMemo(() => {
    const errorMap = {};

    filteredViolations.forEach(v => {
      if (!errorMap[v.error]) {
        errorMap[v.error] = {
          error: v.error,
          count: 0,
        };
      }
      errorMap[v.error].count += 1;
    });

    return Object.values(errorMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredViolations]);

  const COLORS = ['#FF6B6B', '#FFA06B', '#FFD93D', '#6BCB77', '#4D96FF'];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>
          {type === 'daily' && '📅 Báo cáo hằng ngày'}
          {type === 'weekly' && '📈 Báo cáo tuần'}
          {type === 'monthly' && '📊 Báo cáo tháng'}
        </h2>

        <div className="controls">
          <input
            type="date"
            value={format(currentDate, 'yyyy-MM-dd')}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="date-picker"
          />

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="dept-filter"
          >
            <option value="all">Tất cả bộ phận</option>
            <option value="F&B">F&B</option>
            <option value="KIT">KIT</option>
            <option value="H.S">H.S</option>
            <option value="TECH">TECH</option>
            <option value="SEC">SEC</option>
          </select>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Tổng vi phạm</h3>
          <p className="stat-value">{filteredViolations.length}</p>
        </div>
        <div className="stat-card">
          <h3>Tổng điểm trừ</h3>
          <p className="stat-value">
            {filteredViolations.reduce((sum, v) => sum + Math.abs(v.points), 0)}
          </p>
        </div>
        <div className="stat-card">
          <h3>Nhân viên vi phạm</h3>
          <p className="stat-value">
            {new Set(filteredViolations.map(v => v.employeeId)).size}
          </p>
        </div>
        <div className="stat-card">
          <h3>Điểm trung bình</h3>
          <p className="stat-value">
            {(employeeScores.reduce((sum, e) => sum + e.totalPoints, 0) / employeeScores.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Biểu đồ điểm số nhân viên */}
      <div className="chart-container">
        <h3>📊 Điểm số nhân viên</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#8884d8" name="Điểm KPIS" />
            <Bar dataKey="violations" fill="#82ca9d" name="Số lỗi" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ vi phạm theo bộ phận */}
      {deptStats.length > 0 && (
        <div className="chart-container">
          <h3>🏢 Vi phạm theo bộ phận</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deptStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ dept, violations }) => `${dept}: ${violations}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="violations"
              >
                {deptStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Lỗi phổ biến */}
      {topErrors.length > 0 && (
        <div className="chart-container">
          <h3>⚠️ Lỗi phổ biến nhất</h3>
          <div className="top-errors">
            {topErrors.map((err, idx) => (
              <div key={idx} className="error-row">
                <span className="error-rank">#{idx + 1}</span>
                <span className="error-text">{err.error}</span>
                <span className="error-count">{err.count} lần</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bảng chi tiết */}
      <div className="table-container">
        <h3>📋 Chi tiết nhân viên</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Bộ phận</th>
              <th>Điểm KPIS</th>
              <th>Số lỗi</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {employeeScores.map((emp, idx) => (
              <tr key={emp.name} className={emp.totalPoints < 80 ? 'warning' : ''}>
                <td>{idx + 1}</td>
                <td>{emp.name}</td>
                <td className="dept-col">{emp.dept}</td>
                <td className="score-col">{emp.totalPoints.toFixed(1)}</td>
                <td>{emp.violations}</td>
                <td>
                  {emp.totalPoints >= 90 && <span className="status good">✅ Tốt</span>}
                  {emp.totalPoints >= 80 && emp.totalPoints < 90 && <span className="status fair">⚠️ Bình thường</span>}
                  {emp.totalPoints < 80 && <span className="status poor">❌ Cần cải thiện</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nút export */}
      <div className="export-section">
        <button className="btn btn-export" onClick={() => {
          const report = {
            period: type,
            date: format(currentDate, 'yyyy-MM-dd'),
            data: {
              violations: filteredViolations,
              employeeScores,
              deptStats,
              topErrors,
            }
          };
          const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `report_${type}_${format(currentDate, 'yyyy-MM-dd')}.json`;
          a.click();
        }}>
          📥 Xuất JSON
        </button>
      </div>
    </div>
  );
}

export default KPISDashboard;
