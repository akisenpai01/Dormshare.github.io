export type User = {
  id: string;
  name: string;
  email: string;
  hostelBlock: string;
  tokens: number;
  trustScore: number;
};

export type Item = {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  tokenCost: number;
  status: 'available' | 'pending' | 'borrowed';
  pickupLocation: string;
  description: string;
  imageUrl?: string;
  batteryLife?: string;
  highlight?: string;
  badge?: string;
  ownerName?: string;
  ownerTrustScore?: number;
};

export type Transaction = {
  id: string;
  itemId: string;
  borrowerId: string;
  lenderId: string;
  tokenCost: number;
  status: 'pending' | 'active' | 'returned';
  date: string;
  itemName?: string;
};

export type Session = {
  token: string;
  user: User;
};

export type AuthPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthPayload & {
  name: string;
  hostelBlock: string;
};
