// src/utils/fetchImageBlob.js
export async function fetchImageObjectUrl(url, token) {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`이미지 로드 실패: ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
