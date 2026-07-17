import { Injectable, signal } from '@angular/core';

export type RuntimeModuleKey = 'user' | 'employee' | 'driver' | 'vehicle';

export interface RuntimeRecord {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class RuntimeDataService {
  private readonly store = signal<Record<RuntimeModuleKey, RuntimeRecord[]>>({
    user: [
      {
        id: 'U-1',
        name: 'Jane Doe',
        description: 'Primary support user',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'U-2',
        name: 'Alex Kim',
        description: 'Operations lead',
        createdAt: new Date().toISOString(),
      },
    ],
    employee: [
      {
        id: 'E-1',
        name: 'Mina Patel',
        description: 'Sales coordinator',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'E-2',
        name: 'Leo Grant',
        description: 'Warehouse manager',
        createdAt: new Date().toISOString(),
      },
    ],
    driver: [
      {
        id: 'D-1',
        name: 'Sam Lee',
        description: 'Regional delivery',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'D-2',
        name: 'Nina Cruz',
        description: 'City route',
        createdAt: new Date().toISOString(),
      },
    ],
    vehicle: [
      {
        id: 'V-1',
        name: 'Truck 01',
        description: 'Fleet vehicle',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'V-2',
        name: 'Van 02',
        description: 'Support transport',
        createdAt: new Date().toISOString(),
      },
    ],
  });

  getItems(type: RuntimeModuleKey): RuntimeRecord[] {
    return this.store()[type];
  }

  createItem(type: RuntimeModuleKey, item: RuntimeRecord): RuntimeRecord[] {
    const items = this.store()[type];
    if (items.length >= 5) {
      return items;
    }

    const updated = [...items, item];
    this.store.update((current) => ({ ...current, [type]: updated }));
    return updated;
  }

  updateItem(type: RuntimeModuleKey, item: RuntimeRecord): RuntimeRecord[] {
    const updated = this.store()[type].map((entry) => (entry.id === item.id ? item : entry));
    this.store.update((current) => ({ ...current, [type]: updated }));
    return updated;
  }

  deleteItem(type: RuntimeModuleKey, id: string): RuntimeRecord[] {
    const updated = this.store()[type].filter((entry) => entry.id !== id);
    this.store.update((current) => ({ ...current, [type]: updated }));
    return updated;
  }
}
