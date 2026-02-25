export interface SiteHistory {
  site_id: number;
  is_up: boolean;
  latency: number;
  checked_at: string;
}

export interface Site {
  ID: number;
  name: string;
  url: string;
  latency: number;
  is_up: boolean;
  last_status: number;
  last_check: string;
  history: SiteHistory[];
}