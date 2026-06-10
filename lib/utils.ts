import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n);
}

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function percent(value: number, total: number): number {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

/** Mask a mobile number for DPDP-compliant display, e.g. 98765xxxxx */
export function maskMobile(mobile: string): string {
  if (mobile.length < 6) return mobile;
  return mobile.slice(0, 5) + 'xxxxx';
}

/** Mask an ABHA number, e.g. 12-xxxx-xxxx-3456 */
export function maskAbha(abha?: string): string {
  if (!abha) return '—';
  const digits = abha.replace(/\D/g, '');
  if (digits.length < 8) return abha;
  return `${digits.slice(0, 2)}-xxxx-xxxx-${digits.slice(-4)}`;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
