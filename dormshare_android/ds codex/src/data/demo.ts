import { Item, Transaction, User } from '../types';

export const demoUser: User = {
  id: 'demo-user',
  name: 'Alec Chen',
  email: 'alec@upes.ac.in',
  hostelBlock: 'North Residence Hall',
  tokens: 94,
  trustScore: 4.92
};

export const categories = ['All Items', 'Tech', 'Kitchen', 'Audio', 'Outdoor'];

export const demoItems: Item[] = [
  {
    id: 'item-1',
    ownerId: 'user-1',
    name: 'Nintendo Switch OLED',
    category: 'Tech',
    tokenCost: 5,
    status: 'available',
    pickupLocation: 'North Hall - 200m away',
    description: 'Perfect for quick Mario Kart nights and a few hours of couch co-op in the common room.',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80',
    badge: 'TRENDING NOW',
    ownerName: 'Riya Malhotra',
    ownerTrustScore: 4.8
  },
  {
    id: 'item-2',
    ownerId: 'user-2',
    name: 'Ninja Air Fryer',
    category: 'Kitchen',
    tokenCost: 2,
    status: 'available',
    pickupLocation: 'Food Court Block',
    description: 'Late-night fries without a mess. Cleaned after every borrow.',
    imageUrl: 'https://images.unsplash.com/photo-1585515656893-2b0b509f98df?auto=format&fit=crop&w=900&q=80',
    badge: 'FREE',
    ownerName: 'Kabir Singh',
    ownerTrustScore: 4.6
  },
  {
    id: 'item-3',
    ownerId: 'user-3',
    name: 'Power Drill Set',
    category: 'Tech',
    tokenCost: 2,
    status: 'available',
    pickupLocation: 'East Dorms',
    description: 'Compact kit for room fixes, shelf installs, and design projects.',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80',
    ownerName: 'Naman Rao',
    ownerTrustScore: 4.7
  },
  {
    id: 'item-4',
    ownerId: 'user-4',
    name: 'Mid Keyboard',
    category: 'Tech',
    tokenCost: 4,
    status: 'available',
    pickupLocation: 'South Residence',
    description: 'Mechanical keyboard with warm tactile switches, great for coding sprints.',
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    ownerName: 'Ananya Das',
    ownerTrustScore: 4.9
  },
  {
    id: 'item-5',
    ownerId: 'user-5',
    name: 'Mountain Bike',
    category: 'Outdoor',
    tokenCost: 7,
    status: 'available',
    pickupLocation: 'Sports Complex',
    description: 'Weekend ride setup for trails and quick town runs.',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80',
    ownerName: 'Yash Verma',
    ownerTrustScore: 4.5
  },
  {
    id: 'item-6',
    ownerId: 'user-6',
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    tokenCost: 5,
    status: 'available',
    pickupLocation: 'North Residence Hall, Floor 4',
    description: 'Flagship noise cancellation, all-day battery, and ideal for library focus sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    batteryLife: '30 Hours',
    highlight: 'Industry Lead',
    badge: 'VERIFIED CAMPUS LENDER',
    ownerName: 'Alec Chen',
    ownerTrustScore: 4.92
  }
];

export const demoLibrary: Item[] = [
  {
    id: 'library-1',
    ownerId: demoUser.id,
    name: 'Fujifilm X100V',
    category: 'Tech',
    tokenCost: 15,
    status: 'available',
    pickupLocation: 'Photography Club',
    description: 'Compact camera with film simulation presets and a sharp fixed lens.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    ownerName: demoUser.name
  },
  {
    id: 'library-2',
    ownerId: demoUser.id,
    name: 'Segway Ninebot',
    category: 'Mobility',
    tokenCost: 8,
    status: 'available',
    pickupLocation: 'Mobility Hub',
    description: 'Campus-ready scooter for quick commutes between blocks.',
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80',
    ownerName: demoUser.name
  },
  {
    id: 'library-3',
    ownerId: demoUser.id,
    name: 'Sony WH-1000XM4',
    category: 'Audio',
    tokenCost: 5,
    status: 'borrowed',
    pickupLocation: 'North Residence',
    description: 'Travel pair with soft cups and strong ANC.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    ownerName: demoUser.name
  }
];

export const demoTransactions: Transaction[] = [
  {
    id: 'tx-1',
    itemId: 'library-3',
    borrowerId: 'user-12',
    lenderId: demoUser.id,
    tokenCost: 5,
    status: 'active',
    date: '2026-04-18',
    itemName: 'Sony WH-1000XM4'
  },
  {
    id: 'tx-2',
    itemId: 'item-2',
    borrowerId: demoUser.id,
    lenderId: 'user-2',
    tokenCost: 2,
    status: 'pending',
    date: '2026-04-16',
    itemName: 'Ninja Air Fryer'
  }
];

export const handoffCode = 'dormshare://handoff/tx-2';
