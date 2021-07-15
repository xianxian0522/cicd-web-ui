export interface BarItem {
  id: number;
  icon?: string;
  path: string;
  name: string;
  route?: string;
  children?: BarItem[];
}
export interface LoginResponse {
  url?: string;
  token?: string;
}