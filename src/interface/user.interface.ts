export interface Portfolio {
  id: number;
  type?: string;
  link?: string;
}
export interface Occupation {
  type: string;
  value: boolean | string;
}
export type EmploymentForm = Occupation;

export interface WorkingTime {
  dayInWeek: number;
  workingHour: string;
}
