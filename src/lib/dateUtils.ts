export function getTimeAgoKurdish(timestamp: number | string | Date): string {
  const date = new Date(timestamp);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) {
    return 'کەمێک پێش ئێستا';
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} خولەک پێش ئێستا`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} کاتژمێر پێش ئێستا`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ڕۆژ پێش ئێستا`;
  }
  
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} مانگ پێش ئێستا`;
  }
  
  const years = Math.floor(days / 365);
  return `${years} ساڵ پێش ئێستا`;
}
