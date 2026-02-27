// Lấy ngày thứ Hai của tuần chứa ngày d
export function getStartOfWeek(d: Date | string) {
  const date = new Date(d);
  const day = date.getDay(); // 0=CN, 1=T2 ... 6=T7
  const diff = (day === 0) ? -6 : 1 - day; // Điều chỉnh về thứ Hai
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Lấy ngày Chủ Nhật của tuần chứa ngày d
export function getEndOfWeek(d: Date | string) {
  const start = getStartOfWeek(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

// Cộng / trừ N ngày
export function addDays(date: Date | string, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// Format ngày thành "YYYY-MM-DD" theo giờ địa phương
export function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format ngày thành "YYYY-MM-DD" để gọi API
export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatDateRange(start: Date, end: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const sMonth = months[start.getMonth()];
  const eMonth = months[end.getMonth()];
  const sDay = start.getDate();
  const eDay = end.getDate();
  const sYear = start.getFullYear();
  const eYear = end.getFullYear();

  // Khác năm: "Dec 29, 2025 – Jan 4, 2026"
  if (sYear !== eYear) {
    return `${sMonth} ${sDay}, ${sYear} – ${eMonth} ${eDay}, ${eYear}`;
  }

  // Khác tháng: "Oct 29 – Nov 4, 2025"
  if (start.getMonth() !== end.getMonth()) {
    return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${eYear}`;
  }

  // Cùng tháng: "Oct 12 – 18, 2025"
  return `${sMonth} ${sDay} – ${eDay}, ${sYear}`;
}
