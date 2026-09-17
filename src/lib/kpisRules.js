// Quy ước trừ điểm KPIS
export const KPIS_RULES = {
  // NHÂN VIÊN
  "NV/Tuân thủ quy trình chuẩn (SOP)": {
    category: "Nhân viên",
    criteria: [
      { error: "Lỗi setup, chuẩn bị", points: -0.5, dept: ["F&B"] },
      { error: "Lỗi quy trình phục vụ", points: -1, dept: ["F&B"] },
      { error: "Lỗi chất lượng vệ sinh/hiệu suất", points: -0.5, dept: ["KIT", "H.S"] },
      { error: "Lỗi ảnh hưởng chất lượng dịch vụ", points: -1, dept: ["KIT", "H.S"] },
      { error: "Lỗi chuẩn bị CCDC", points: -0.5, dept: ["TECH"] },
      { error: "Lỗi quy trình vận hành", points: -1, dept: ["TECH", "SEC"] },
    ]
  },
  "NV/Tác phong & Kỷ luật": {
    category: "Nhân viên",
    criteria: [
      { error: "Vi phạm diện mạo/giờ giấc", points: -0.5, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
      { error: "Quản lý nhắc nhở - Mang tính kỷ luật", points: -3, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
    ]
  },
  "NV/Đảm bảo vệ sinh & ATTP": {
    category: "Nhân viên",
    criteria: [
      { error: "Lỗi vệ sinh liên quan bộ phận", points: -0.5, dept: ["F&B", "KIT", "H.S"] },
      { error: "Lỗi vệ sinh ảnh hưởng khách hàng", points: -1.5, dept: ["F&B", "KIT", "H.S"] },
    ]
  },
  "NV/Phối hợp & Thái độ làm việc": {
    category: "Nhân viên",
    criteria: [
      { error: "Thái độ tiêu cực/không phối hợp", points: -3, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
      { error: "Đánh giá 360 dưới 2.5 điểm", points: -3, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
    ]
  },
  "NV/Khách hàng phàn nàn": {
    category: "Nhân viên",
    criteria: [
      { error: "Khách phàn nàn trực tiếp", points: -3, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
    ]
  },
  "NV/Vệ sinh ANAT/ATLĐ/PCCC": {
    category: "Nhân viên",
    criteria: [
      { error: "Phát hiện vệ sinh/dụng cụ bẩn", points: -0.5, dept: ["KIT", "H.S", "SEC"] },
      { error: "Không tuân thủ ATLĐ/PCCC", points: -1.5, dept: ["KIT", "H.S", "TECH", "SEC"] },
    ]
  },

  // GIÁM SÁT
  "GS/Chất lượng kiểm soát Checklist": {
    category: "Giám sát",
    criteria: [
      { error: "Sai lệch checklist & ký khống", points: -2, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
      { error: "Lỗi báo cáo", points: -1, dept: ["TECH"] },
      { error: "Lỗi bàn giao không rõ ràng", points: -0.5, dept: ["TECH"] },
    ]
  },
  "GS/Đảm bảo kỷ luật đội ngũ": {
    category: "Giám sát",
    criteria: [
      { error: "Lỗi phát sinh so với quy ước", points: -5, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
    ]
  },
  "GS/Quản lý tài sản & dụng cụ": {
    category: "Giám sát",
    criteria: [
      { error: "Vượt định mức bể vỡ", points: -0.5, dept: ["F&B", "KIT", "H.S"] },
      { error: "Không tuân thủ quy trình", points: -1, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
      { error: "Sai lệch số liệu quản lý", points: -1.5, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
      { error: "Không đúng định mức CCDC", points: -1, dept: ["TECH"] },
    ]
  },
  "GS/Hài lòng khách hàng": {
    category: "Giám sát",
    criteria: [
      { error: "Khiếu nại về thái độ/tác phong", points: -1.5, dept: ["F&B", "KIT", "H.S", "SEC"] },
      { error: "Xử lý sự cố chậm/không thỏa đáng", points: -3, dept: ["F&B", "KIT", "H.S", "SEC"] },
      { error: "Khiếu nại thái độ (nghiêm trọng)", points: -5, dept: ["F&B", "KIT", "H.S", "SEC"] },
    ]
  },
  "GS/Hiệu quả điều phối": {
    category: "Giám sát",
    criteria: [
      { error: "Chậm tiến độ lên món", points: -1, dept: ["F&B"] },
      { error: "Khu vực không có NV trực", points: -1, dept: ["F&B", "H.S", "TECH", "SEC"] },
      { error: "Đáp ứng yêu cầu chậm >10 phút", points: -1.5, dept: ["F&B", "H.S", "TECH", "SEC"] },
    ]
  },
  "GS/Tiến độ đào tạo OJT": {
    category: "Giám sát",
    criteria: [
      { error: "Thiếu buổi đào tạo", points: -5, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
      { error: "NV không đạt test kỹ năng", points: -1, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
      { error: "Nội dung đào tạo sơ sài", points: -2, dept: ["F&B", "KIT", "H.S", "TECH", "SEC"] },
      { error: "Không thực hiện đủ đào tạo", points: -5, dept: ["KIT"] },
    ]
  },
};

export const DEPARTMENTS = ["F&B", "KIT", "H.S", "TECH", "SEC"];
