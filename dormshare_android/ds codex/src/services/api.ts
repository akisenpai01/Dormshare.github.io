import Constants from 'expo-constants';
import { AuthPayload, Item, RegisterPayload, Session, Transaction, User } from '../types';
import { demoItems, demoLibrary, demoTransactions, demoUser } from '../data/demo';

const extraBaseUrl = (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? 'http://localhost:8080';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? extraBaseUrl;

type FetchOptions = RequestInit & {
  token?: string;
};

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return (await response.text()) as T;
}

function mapItem(item: Partial<Item>): Item {
  return {
    id: item.id ?? `generated-${Math.random().toString(36).slice(2)}`,
    ownerId: item.ownerId ?? 'unknown',
    name: item.name ?? 'Campus item',
    category: item.category ?? 'General',
    tokenCost: item.tokenCost ?? 1,
    status: (item.status as Item['status']) ?? 'available',
    pickupLocation: item.pickupLocation ?? 'UPES Campus',
    description: item.description ?? 'Available to borrow on DormShare.',
    imageUrl: item.imageUrl ?? demoItems[Math.floor(Math.random() * demoItems.length)]?.imageUrl,
    batteryLife: item.batteryLife,
    highlight: item.highlight,
    badge: item.badge,
    ownerName: item.ownerName,
    ownerTrustScore: item.ownerTrustScore
  };
}

export const api = {
  baseUrl: API_BASE_URL,

  async signIn(payload: AuthPayload): Promise<Session> {
    try {
      const response = await request<{ token: string; userId: string; name: string }>('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      return {
        token: response.token,
        user: {
          ...demoUser,
          id: response.userId,
          name: response.name,
          email: payload.email
        }
      };
    } catch {
      return {
        token: 'demo-token',
        user: {
          ...demoUser,
          email: payload.email
        }
      };
    }
  },

  async signUp(payload: RegisterPayload): Promise<void> {
    try {
      await request('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch {
      return;
    }
  },

  async getMarketplaceItems(currentUserId: string, token?: string): Promise<Item[]> {
    try {
      const response = await request<Item[]>(`/api/market/items?currentUserId=${currentUserId}`, { token });
      return response.map(mapItem);
    } catch {
      return demoItems.filter((item) => item.ownerId !== currentUserId);
    }
  },

  async getMyItems(userId: string, token?: string): Promise<Item[]> {
    try {
      const response = await request<Item[]>(`/api/market/my-items?userId=${userId}`, { token });
      return response.map(mapItem);
    } catch {
      return demoLibrary;
    }
  },

  async getHistory(userId: string, token?: string): Promise<Transaction[]> {
    try {
      return await request<Transaction[]>(`/api/transactions/history?userId=${userId}`, { token });
    } catch {
      return demoTransactions;
    }
  },

  async requestBorrow(transaction: Omit<Transaction, 'id' | 'status'>, token?: string): Promise<Transaction> {
    try {
      return await request<Transaction>('/api/transactions/request', {
        method: 'POST',
        body: JSON.stringify(transaction),
        token
      });
    } catch {
      return {
        ...transaction,
        id: `tx-${Date.now()}`,
        status: 'pending',
        itemName: demoItems.find((item) => item.id === transaction.itemId)?.name
      };
    }
  },

  async verifyHandoff(transactionId: string, token?: string): Promise<void> {
    try {
      await request(`/api/transactions/verify/${transactionId}`, {
        method: 'POST',
        token
      });
    } catch {
      return;
    }
  }
};
