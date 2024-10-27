export const backend_url = "http://localhost:8000";

export function readableFormat(date: Date) {
  return new Date(date).toLocaleDateString();
}
