export interface Booking {
  id: number;
  status: "confirmed" | "completed" | "cancelled";
  scheduledAt: string;
  duration: number;
  totalPrice: number;
  subject?: string;
  notes?: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  tutorProfile: {
    id: number;
    hourlyRate: number;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  };
}
