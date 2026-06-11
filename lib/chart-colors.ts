// Shared chart palette. Kept in a server-safe module (no 'use client') so it can be
// imported by both server components and the client chart wrappers without becoming
// a client-reference proxy.
export const CHART_COLORS = [
  'hsl(201 96% 32%)',
  'hsl(173 80% 40%)',
  'hsl(38 92% 50%)',
  'hsl(0 84% 60%)',
  'hsl(262 83% 58%)',
  'hsl(142 71% 45%)',
];
