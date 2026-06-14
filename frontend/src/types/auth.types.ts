export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  district: string;
  pincode: string;
  status: string;
  last_login_at: string | null;
  created_at: string;
  consumer_profile?: ConsumerProfile;
  roles?: { id: number | string; name: string }[];
}

export interface ConsumerProfile {
  id: string;
  user_id: string;
  loyalty_points: number;
  lifetime_orders: number;
  lifetime_spending: string;
  total_logins: number;
  last_order_date: string | null;
  last_visit_at: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}
