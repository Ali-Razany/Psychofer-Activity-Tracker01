import { ActivityTask, User } from '../types';

export const ACTIVITIES: ActivityTask[] = [
  // Design
  { id: 'des-1', department: 'Design', name: 'دیزاینی کەڤەری ڤیدیۆ', basePoints: 5 },
  { id: 'des-2', department: 'Design', name: 'دیزاینی ڕیکلام', basePoints: 5 },
  { id: 'des-3', department: 'Design', name: 'مۆنتاژی ڤیدیۆی سەروو ٢ دەقەیی', basePoints: 7 },
  { id: 'des-4', department: 'Design', name: 'مۆنتاژی کەمتر لە ٢ دەقە', basePoints: 5 },
  { id: 'des-5', department: 'Design', name: 'سەرپەرشتیاری دەستە (مانگانە)', basePoints: 4 },
  { id: 'des-6', department: 'Design', name: 'ئەرکی تر', basePoints: 3 },
  // Media
  { id: 'med-1', department: 'Media', name: 'پۆستکردن لە فەیسبووک', basePoints: 2 },
  { id: 'med-2', department: 'Media', name: 'پۆستکردن لە ئینستگرام', basePoints: 2 },
  { id: 'med-3', department: 'Media', name: 'پۆستکردن لە تێلیگرام', basePoints: 2 },
  { id: 'med-4', department: 'Media', name: 'پۆستکردن لە یوتیوب', basePoints: 2 },
  { id: 'med-5', department: 'Media', name: 'وەڵامدانەوەی ١٠ کۆمێنت/نامە', basePoints: 1 },
  { id: 'med-6', department: 'Media', name: 'ڕێکخستنەوەی هایلایت و ڕووکاری پەڕەکان', basePoints: 2 },
  { id: 'med-7', department: 'Media', name: 'سەرپەرشتیاری دەستە (مانگانە)', basePoints: 4 },
  { id: 'med-8', department: 'Media', name: 'ئەرکی تر', basePoints: 2 },
  // Translation
  { id: 'trans-1', department: 'Translation', name: 'وەرگێڕانی ڤیدیۆی سەروو ٢ دەقەیی', basePoints: 7 },
  { id: 'trans-2', department: 'Translation', name: 'وەرگێڕانی ڤیدیۆی خوار 2 دەقەیی', basePoints: 5 },
  { id: 'trans-3', department: 'Translation', name: 'پێداچوونەوەی وەرگێرانی سەروو 2 دەقەیی', basePoints: 6 },
  { id: 'trans-4', department: 'Translation', name: 'پێداچوونەوەی وەرگێڕانی خوار 2 دەقەیی', basePoints: 4 },
  { id: 'trans-5', department: 'Translation', name: 'سەرپەرشتیاری دەستەی وەرگێران (مانگانە)', basePoints: 5 },
  { id: 'trans-6', department: 'Translation', name: 'ئەرکی تر', basePoints: 4 },
  // Training
  { id: 'train-1', department: 'Training', name: 'پێشکەشکاری', basePoints: 4 },
  { id: 'train-2', department: 'Training', name: 'بەڕێوەبردنی خول/سمینار', basePoints: 5 },
  { id: 'train-3', department: 'Training', name: 'سەرپەرشتیاری دەستە (مانگانە)', basePoints: 3 },
  // Typing
  { id: 'type-1', department: 'Typing', name: 'دانانی کاتبەندی', basePoints: 5 },
  { id: 'type-2', department: 'Typing', name: 'تایپکردنەوە سەروو 300 وشە', basePoints: 7 },
  { id: 'type-3', department: 'Typing', name: 'تایپکردنەوە خوار 300 وشە', basePoints: 5 },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'ئەحمەد عەلی', roles: ['Admin'], departments: ['Media'], points: 120 },
  { id: 'u2', name: 'سارا عومەر', roles: ['Member'], departments: ['Design'], points: 85 },
  { id: 'u3', name: 'کۆچەر هێمن', roles: ['Supervisor'], departments: ['Translation'], points: 145 },
  { id: 'u4', name: 'لانە ڕێبوار', roles: ['Member'], departments: ['Typing'], points: 42 },
  { id: 'u5', name: 'کاروان سەعید', roles: ['Member'], departments: ['Media'], points: 215 },
];

export const DEPARTMENTS = [
  { id: 'Design', name: 'نەخشەسازی' },
  { id: 'Media', name: 'ڕاگەیاندن' },
  { id: 'Translation', name: 'وەرگێڕان' },
  { id: 'Training', name: 'خول و وێبینار' },
  { id: 'Typing', name: 'تایپ' }
];
