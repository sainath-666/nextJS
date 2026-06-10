import type { Vendor } from '../types';

export const VENDORS: Vendor[] = [
  { id: 'V-01', name: 'Lakshmi Opticals', district: 'Guntur', contactPerson: 'R. Sudhakar', mobile: '9849011223', email: 'ops@lakshmiopticals.in', capacityPerDay: 120, slaHours: 168, rating: 4.6, activeOrders: 84, fulfilledOrders: 12840, slaBreaches: 9, status: 'active' },
  { id: 'V-02', name: 'Vision Plus', district: 'Visakhapatnam', contactPerson: 'P. Anand', mobile: '9848022334', email: 'orders@visionplus.in', capacityPerDay: 150, slaHours: 168, rating: 4.8, activeOrders: 102, fulfilledOrders: 15600, slaBreaches: 5, status: 'active' },
  { id: 'V-03', name: 'ClearSight', district: 'Anantapur', contactPerson: 'M. Reddy', mobile: '9000033445', email: 'support@clearsight.in', capacityPerDay: 90, slaHours: 168, rating: 3.9, activeOrders: 71, fulfilledOrders: 8900, slaBreaches: 21, status: 'active' },
  { id: 'V-04', name: 'EyeCare Kurnool', district: 'Kurnool', contactPerson: 'S. Naidu', mobile: '9700044556', email: 'eyecare.knl@gmail.com', capacityPerDay: 80, slaHours: 168, rating: 4.2, activeOrders: 58, fulfilledOrders: 7200, slaBreaches: 12, status: 'active' },
  { id: 'V-05', name: 'OptiCare Tirupati', district: 'Chittoor', contactPerson: 'K. Mohan', mobile: '9701055667', email: 'hello@opticare.in', capacityPerDay: 100, slaHours: 168, rating: 4.4, activeOrders: 0, fulfilledOrders: 320, slaBreaches: 0, status: 'onboarding' },
  { id: 'V-06', name: 'SpectaWorld', district: 'East Godavari', contactPerson: 'V. Prasad', mobile: '9885066778', email: 'ops@spectaworld.in', capacityPerDay: 70, slaHours: 168, rating: 2.8, activeOrders: 0, fulfilledOrders: 4100, slaBreaches: 38, status: 'suspended' },
];

export function getVendor(id: string): Vendor | undefined {
  return VENDORS.find((v) => v.id === id);
}
