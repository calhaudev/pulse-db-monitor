export interface HealthMetric {
  label: string;
  description: string;
  value: number | string | null;
  warning: boolean;
  threshold?: number;
  unit?: string;
  responseTime: number;
  timestamp: string;
}
