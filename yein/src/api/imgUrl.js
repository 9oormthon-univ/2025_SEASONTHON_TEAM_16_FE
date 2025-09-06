// src/utils/imageUrl.js
import { API_BASE } from "../config/env";

export function resolveImageUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  try {
    const u = new URL(pathOrUrl);
    return u.href;
  } catch {

    return `${API_BASE.replace(/\/$/, "")}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
  }
}
