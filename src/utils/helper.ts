export function helperRes<T>(content?: T) {
  const res: { content?: any; status?: number; message?: string } = {};
  if (content) {
    res.content = content;
    res.status = 0;
    res.message = 'success';
  } else {
    res.content = null;
    res.status = 0;
    res.message = 'success';
  }
  return res;
}
