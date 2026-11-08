import { CustomBadge } from '../types';

export const BADGE_INFO: Record<string, { label: string, icon: string, color: string, bg: string, desc: string }> = {
  consistency: { label: 'نیشانەی بەردەوامی', icon: 'fluent-emoji:shield', color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'بەردەوامی لە کار و تۆمارکردنی چالاکی بۆ ماوەیەکی درێژ' },
  collaboration: { label: 'نیشانەی هاریکاری', icon: 'fluent-emoji:handshake', color: 'text-rose-600', bg: 'bg-rose-100', desc: 'هاوکاریکردنی ئەندامانی تری دەستەکە یان دەستەکانی تر' },
  innovation: { label: 'نیشانەی داهێنان', icon: 'fluent-emoji:light-bulb', color: 'text-amber-600', bg: 'bg-amber-100', desc: 'پێشکەشکردنی بیرۆکەی نوێ یان چارەسەری داهێنەرانە' },
  pioneer: { label: 'نیشانەی پێشەنگ', icon: 'fluent-emoji:snow-capped-mountain', color: 'text-indigo-600', bg: 'bg-indigo-100', desc: 'هەڵگرتنی بەرپرسیارێتیی قورس لە کاتی پێویستدا' },
  milestone_50: { label: 'نیشانەی ٥٠ خاڵ', icon: 'fluent-emoji:sports-medal', color: 'text-blue-600', bg: 'bg-blue-100', desc: 'گەیشتن بە ٥٠ خاڵ لە سیستەمدا' },
  milestone_100: { label: 'نیشانەی ١٠٠ خاڵ', icon: 'fluent-emoji:trophy', color: 'text-purple-600', bg: 'bg-purple-100', desc: 'گەیشتن بە ١٠٠ خاڵ لە سیستەمدا' },
  milestone_250: { label: 'نیشانەی ٢٥٠ خاڵ', icon: 'fluent-emoji:fire', color: 'text-rose-600', bg: 'bg-rose-100', desc: 'گەیشتن بە ٢٥٠ خاڵ لە سیستەمدا' },
  milestone_500: { label: 'نیشانەی ٥٠٠ خاڵ', icon: 'fluent-emoji:glowing-star', color: 'text-orange-600', bg: 'bg-orange-100', desc: 'گەیشتن بە ٥٠٠ خاڵ لە سیستەمدا' },
  milestone_1000: { label: 'نیشانەی ١٠٠٠ خاڵ', icon: 'fluent-emoji:crown', color: 'text-amber-600', bg: 'bg-amber-100', desc: 'گەیشتن بە ١٠٠٠ خاڵ لە سیستەمدا' }
};

export const MILESTONES = [
  { id: 'milestone_50', threshold: 50, label: '٥٠ خاڵ', icon: 'fluent-emoji:sports-medal' },
  { id: 'milestone_100', threshold: 100, label: '١٠٠ خاڵ', icon: 'fluent-emoji:trophy' },
  { id: 'milestone_250', threshold: 250, label: '٢٥٠ خاڵ', icon: 'fluent-emoji:fire' },
  { id: 'milestone_500', threshold: 500, label: '٥٠٠ خاڵ', icon: 'fluent-emoji:glowing-star' },
  { id: 'milestone_1000', threshold: 1000, label: '١٠٠٠ خاڵ', icon: 'fluent-emoji:crown' }
];

export function getBadgeDetails(type: string, customBadges: CustomBadge[] = []): (CustomBadge & { id: string }) | null {
  if (BADGE_INFO[type]) {
    return { id: type, ...BADGE_INFO[type] };
  }
  const custom = customBadges.find(cb => cb.id === type);
  if (custom) return custom;
  return null;
}
