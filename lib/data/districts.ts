import type { District } from '../types';

// Representative set of Andhra Pradesh districts with real centroids.
export const DISTRICTS: District[] = [
  { id: 'D01', name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, population: 2035922, campsTotal: 142, campsActive: 9, screened: 184320, target: 210000, spectaclesDelivered: 41200, referrals: 3120, slaBreaches: 14, diseaseBurdenScore: 72 },
  { id: 'D02', name: 'Guntur', lat: 16.3067, lng: 80.4365, population: 2091075, campsTotal: 156, campsActive: 12, screened: 198450, target: 220000, spectaclesDelivered: 45600, referrals: 3580, slaBreaches: 9, diseaseBurdenScore: 68 },
  { id: 'D03', name: 'Krishna', lat: 16.6105, lng: 81.1280, population: 1735000, campsTotal: 128, campsActive: 7, screened: 152300, target: 185000, spectaclesDelivered: 33800, referrals: 2640, slaBreaches: 6, diseaseBurdenScore: 61 },
  { id: 'D04', name: 'East Godavari', lat: 17.0005, lng: 81.8040, population: 1900000, campsTotal: 134, campsActive: 8, screened: 167900, target: 195000, spectaclesDelivered: 38100, referrals: 2980, slaBreaches: 11, diseaseBurdenScore: 64 },
  { id: 'D05', name: 'West Godavari', lat: 16.9174, lng: 81.3399, population: 1779000, campsTotal: 119, campsActive: 6, screened: 141200, target: 175000, spectaclesDelivered: 31900, referrals: 2410, slaBreaches: 4, diseaseBurdenScore: 55 },
  { id: 'D06', name: 'Anantapur', lat: 14.6819, lng: 77.6006, population: 2080000, campsTotal: 138, campsActive: 10, screened: 159800, target: 200000, spectaclesDelivered: 35200, referrals: 4120, slaBreaches: 18, diseaseBurdenScore: 81 },
  { id: 'D07', name: 'Kurnool', lat: 15.8281, lng: 78.0373, population: 2050000, campsTotal: 131, campsActive: 9, screened: 148600, target: 195000, spectaclesDelivered: 32400, referrals: 3890, slaBreaches: 16, diseaseBurdenScore: 78 },
  { id: 'D08', name: 'Chittoor', lat: 13.2172, lng: 79.1003, population: 1872000, campsTotal: 125, campsActive: 7, screened: 138900, target: 180000, spectaclesDelivered: 30100, referrals: 2730, slaBreaches: 7, diseaseBurdenScore: 59 },
  { id: 'D09', name: 'Nellore', lat: 14.4426, lng: 79.9865, population: 1500000, campsTotal: 108, campsActive: 5, screened: 121400, target: 150000, spectaclesDelivered: 27600, referrals: 2050, slaBreaches: 5, diseaseBurdenScore: 52 },
  { id: 'D10', name: 'Kadapa', lat: 14.4674, lng: 78.8241, population: 1450000, campsTotal: 101, campsActive: 6, screened: 109800, target: 145000, spectaclesDelivered: 24300, referrals: 2310, slaBreaches: 12, diseaseBurdenScore: 70 },
  { id: 'D11', name: 'Prakasam', lat: 15.3485, lng: 79.5603, population: 1700000, campsTotal: 112, campsActive: 8, screened: 118200, target: 165000, spectaclesDelivered: 25800, referrals: 2890, slaBreaches: 13, diseaseBurdenScore: 74 },
  { id: 'D12', name: 'Srikakulam', lat: 18.2949, lng: 83.8938, population: 1700000, campsTotal: 97, campsActive: 5, screened: 102600, target: 150000, spectaclesDelivered: 22100, referrals: 2440, slaBreaches: 8, diseaseBurdenScore: 66 },
  { id: 'D13', name: 'Vizianagaram', lat: 18.1067, lng: 83.3956, population: 1500000, campsTotal: 89, campsActive: 4, screened: 94300, target: 140000, spectaclesDelivered: 19800, referrals: 2120, slaBreaches: 6, diseaseBurdenScore: 63 },
];

export const STATE_TOTALS = {
  districts: DISTRICTS.length,
  screened: DISTRICTS.reduce((s, d) => s + d.screened, 0),
  target: DISTRICTS.reduce((s, d) => s + d.target, 0),
  spectaclesDelivered: DISTRICTS.reduce((s, d) => s + d.spectaclesDelivered, 0),
  referrals: DISTRICTS.reduce((s, d) => s + d.referrals, 0),
  slaBreaches: DISTRICTS.reduce((s, d) => s + d.slaBreaches, 0),
  campsActive: DISTRICTS.reduce((s, d) => s + d.campsActive, 0),
  campsTotal: DISTRICTS.reduce((s, d) => s + d.campsTotal, 0),
};
