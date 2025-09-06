export const formatDate = (dateString) => {
  if (!dateString) return "날짜 없음";

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "날짜 없음" : date.toISOString().slice(0, 10);
};
