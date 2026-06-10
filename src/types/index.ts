export type * from "./tutor.type";
export type * from "./booking.type";
export type * from "./routes.type";

export interface Category {
  id: number;
  name: string;
  icon?: string;
  _count?: { tutors: number };
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    image?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  image?: string;
  createdAt: string;
}
