export interface Site {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;
  url: string;
  latency: number;
  is_up: boolean;
  last_status: number;
}