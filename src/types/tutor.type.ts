export interface TutorProfile {
  id: number;
  userId: string;
  bio?: string;
  hourlyRate: number;
  experience?: number;
  rating: number;
  totalReviews: number;
  availability?: AvailabilitySlot[];
  user: {
    id: string;
    name: string;
    image?: string;
  };
  categories: {
    category: {
      id: number;
      name: string;
      icon?: string;
    };
  }[];
}

export interface AvailabilitySlot {
  day: string;
  from: string;
  to: string;
}
