import type { AIPrediction, DiseaseHotspot } from '../types';

export const DISEASE_HOTSPOTS: DiseaseHotspot[] = [
  { district: 'Anantapur', mandal: 'Rayadurg', lat: 14.7000, lng: 76.8500, condition: 'Cataract', caseCount: 1840, severity: 'high' },
  { district: 'Kurnool', mandal: 'Adoni', lat: 15.6280, lng: 77.2750, condition: 'Diabetic Retinopathy', caseCount: 1210, severity: 'high' },
  { district: 'Prakasam', mandal: 'Markapur', lat: 15.7350, lng: 79.2700, condition: 'Refractive Error', caseCount: 2310, severity: 'medium' },
  { district: 'Kadapa', mandal: 'Pulivendula', lat: 14.4200, lng: 78.2250, condition: 'Glaucoma', caseCount: 640, severity: 'high' },
  { district: 'Visakhapatnam', mandal: 'Araku Valley', lat: 18.3273, lng: 82.8763, condition: 'Vitamin A Deficiency', caseCount: 480, severity: 'medium' },
  { district: 'Guntur', mandal: 'Mangalagiri', lat: 16.4307, lng: 80.5680, condition: 'Presbyopia', caseCount: 1560, severity: 'low' },
  { district: 'East Godavari', mandal: 'Rajahmundry', lat: 17.0005, lng: 81.8040, condition: 'Diabetic Retinopathy', caseCount: 980, severity: 'medium' },
];

export const AI_PREDICTIONS: AIPrediction[] = [
  { district: 'Anantapur', metric: 'Cataract surgical demand', current: 35200, predicted: 41800, confidence: 0.88, horizon: 'Next quarter' },
  { district: 'Kurnool', metric: 'Diabetic Retinopathy cases', current: 3890, predicted: 4720, confidence: 0.82, horizon: 'Next quarter' },
  { district: 'Guntur', metric: 'Spectacle demand', current: 45600, predicted: 52300, confidence: 0.91, horizon: 'Next quarter' },
  { district: 'Prakasam', metric: 'Refractive error (school)', current: 2310, predicted: 2980, confidence: 0.79, horizon: 'Next quarter' },
];

export const DEMAND_FORECAST = [
  { label: 'Jul', actual: 45900, forecast: 45900 },
  { label: 'Aug', actual: 0, forecast: 48200 },
  { label: 'Sep', actual: 0, forecast: 50100 },
  { label: 'Oct', actual: 0, forecast: 52300 },
  { label: 'Nov', actual: 0, forecast: 53800 },
  { label: 'Dec', actual: 0, forecast: 55600 },
];

export const REFERRAL_PRIORITY_QUEUE = [
  { name: 'Critical', value: 84, color: 'hsl(0 84% 60%)' },
  { name: 'High', value: 312, color: 'hsl(38 92% 50%)' },
  { name: 'Routine', value: 1240, color: 'hsl(201 96% 32%)' },
];
