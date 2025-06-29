export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  featured?: boolean;
  discount?: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export type UserRole = 'admin' | 'employee' | 'user';

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  assigned_by?: string;
  assigned_at: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  user_id: string;
  employee_id: string;
  department?: string;
  position?: string;
  hire_date: string;
  salary?: number;
  status: 'active' | 'inactive' | 'terminated';
  manager_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address?: any;
  billing_address?: any;
  payment_method?: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string;
  book_title: string;
  book_author: string;
  book_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}