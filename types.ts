export interface LTVResult {
  percent: number;
  totalLimit: number;
  availableAmount: number;
}

export type OccupancyType = 'owner' | 'tenant';

export interface CalculationData {
  propertyValue: number;
  existingLoan: number;
  depositDeduction: number;
  occupancyType: OccupancyType;
}