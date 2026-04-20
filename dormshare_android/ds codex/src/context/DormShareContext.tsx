import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { demoItems, demoLibrary, demoTransactions, demoUser } from '../data/demo';
import { Item, RegisterPayload, Session, Transaction } from '../types';

type DormShareContextValue = {
  isBootstrapping: boolean;
  isBusy: boolean;
  session: Session | null;
  marketItems: Item[];
  libraryItems: Item[];
  transactions: Transaction[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
  requestBorrow: (item: Item) => Promise<Transaction>;
  verifyHandoff: (transactionId: string) => Promise<void>;
};

const STORAGE_KEY = 'dormshare.session';
const DormShareContext = createContext<DormShareContextValue | undefined>(undefined);

export function DormShareProvider({ children }: { children: React.ReactNode }) {
  const [isBootstrapping, setBootstrapping] = useState(true);
  const [isBusy, setBusy] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [marketItems, setMarketItems] = useState<Item[]>(demoItems);
  const [libraryItems, setLibraryItems] = useState<Item[]>(demoLibrary);
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);

  const loadData = useCallback(async (activeSession: Session | null) => {
    const user = activeSession?.user ?? demoUser;
    const token = activeSession?.token;
    const [market, library, history] = await Promise.all([
      api.getMarketplaceItems(user.id, token),
      api.getMyItems(user.id, token),
      api.getHistory(user.id, token)
    ]);

    setMarketItems(market);
    setLibraryItems(library);
    setTransactions(history);
  }, []);

  const refreshData = useCallback(async () => {
    await loadData(session);
  }, [loadData, session]);

  useEffect(() => {
    async function bootstrap() {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Session;
        setSession(parsed);
        await loadData(parsed);
      }
      setBootstrapping(false);
    }

    bootstrap();
  }, [loadData]);

  const signIn = useCallback(async (email: string, password: string) => {
    setBusy(true);
    try {
      const nextSession = await api.signIn({ email, password });
      setSession(nextSession);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      await loadData(nextSession);
    } finally {
      setBusy(false);
    }
  }, [loadData]);

  const signUp = useCallback(async (payload: RegisterPayload) => {
    setBusy(true);
    try {
      await api.signUp(payload);
      const nextSession: Session = {
        token: 'new-user-token',
        user: {
          ...demoUser,
          id: `user-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          hostelBlock: payload.hostelBlock
        }
      };
      setSession(nextSession);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      await loadData(nextSession);
    } finally {
      setBusy(false);
    }
  }, [loadData]);

  const signOut = useCallback(async () => {
    setSession(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const requestBorrow = useCallback(async (item: Item) => {
    const user = session?.user ?? demoUser;
    const token = session?.token;
    const transaction = await api.requestBorrow(
      {
        itemId: item.id,
        borrowerId: user.id,
        lenderId: item.ownerId,
        tokenCost: item.tokenCost,
        date: new Date().toISOString()
      },
      token
    );

    setTransactions((current) => [transaction, ...current]);
    setMarketItems((current) =>
      current.map((entry) => (entry.id === item.id ? { ...entry, status: 'pending' } : entry))
    );

    return transaction;
  }, [session]);

  const verifyHandoff = useCallback(async (transactionId: string) => {
    await api.verifyHandoff(transactionId, session?.token);
    setTransactions((current) =>
      current.map((tx) => (tx.id === transactionId ? { ...tx, status: 'active' } : tx))
    );
  }, [session?.token]);

  const value = useMemo(
    () => ({
      isBootstrapping,
      isBusy,
      session,
      marketItems,
      libraryItems,
      transactions,
      signIn,
      signUp,
      signOut,
      refreshData,
      requestBorrow,
      verifyHandoff
    }),
    [isBootstrapping, isBusy, session, marketItems, libraryItems, transactions, signIn, signUp, signOut, refreshData, requestBorrow, verifyHandoff]
  );

  return <DormShareContext.Provider value={value}>{children}</DormShareContext.Provider>;
}

export function useDormShare() {
  const context = useContext(DormShareContext);
  if (!context) {
    throw new Error('useDormShare must be used inside DormShareProvider');
  }

  return context;
}
