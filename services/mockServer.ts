import { Product, Order, Report, PopupConfig, SiteConfig, CartItem } from '../types';
import { PRODUCTS } from '../constants';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DB_KEYS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  REPORTS: 'reports',
  BANNER: 'bannerText',
  POPUP: 'popupConfig',
  SITE: 'siteConfig',
  CART: 'cart',
  // Connection Config Keys
  SUPABASE_URL: 'sb_url',
  SUPABASE_KEY: 'sb_key'
};

const LATENCY = 1000;

// Singleton client
let supabase: SupabaseClient | null = null;

const initSupabase = () => {
  const url = localStorage.getItem(DB_KEYS.SUPABASE_URL);
  const key = localStorage.getItem(DB_KEYS.SUPABASE_KEY);
  if (url && key && !supabase) {
    try {
      supabase = createClient(url, key);
      console.log("Supabase Client Initialized");
    } catch (e) {
      console.error("Failed to init Supabase", e);
    }
  }
  return supabase;
};

// Helper to get local data safely
const getLocalJSON = (key: string, defaultValue: any) => {
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  try { return JSON.parse(item); } catch { return defaultValue; }
};

export const mockServer = {
  isConnectedToCloud: () => !!localStorage.getItem(DB_KEYS.SUPABASE_URL),

  connect: async (): Promise<boolean> => {
    initSupabase();
    // Simulate network delay
    return new Promise((resolve) => setTimeout(() => resolve(true), LATENCY));
  },

  // Save Connection Details
  saveConnection: (url: string, key: string) => {
    localStorage.setItem(DB_KEYS.SUPABASE_URL, url);
    localStorage.setItem(DB_KEYS.SUPABASE_KEY, key);
    // Force reload to init client
    window.location.reload();
  },

  disconnectExternalDB: () => {
    localStorage.removeItem(DB_KEYS.SUPABASE_URL);
    localStorage.removeItem(DB_KEYS.SUPABASE_KEY);
    window.location.reload();
  },

  fetchAllData: async () => {
    const client = initSupabase();

    // Default Local Data
    let data = {
      products: getLocalJSON(DB_KEYS.PRODUCTS, PRODUCTS),
      orders: getLocalJSON(DB_KEYS.ORDERS, []),
      reports: getLocalJSON(DB_KEYS.REPORTS, []),
      cart: getLocalJSON(DB_KEYS.CART, []),
      bannerText: localStorage.getItem(DB_KEYS.BANNER) || 'أهلاً بكم في بازار لوك - خصومات تصل إلى 50% على التشكيلة الجديدة! 🌟',
      popupConfig: getLocalJSON(DB_KEYS.POPUP, { isActive: false, image: '' }),
      siteConfig: getLocalJSON(DB_KEYS.SITE, { enableTrackOrder: true })
    };

    // If connected to Supabase, try to fetch from there
    if (client) {
      try {
        console.log("Fetching from Cloud...");
        
        // We assume a simple table structure: "store_data" with columns: key (text primary), value (jsonb)
        // This is a NoSQL-like pattern on Postgres for easy migration
        const { data: cloudData, error } = await client
          .from('store_data')
          .select('key, value');

        if (!error && cloudData) {
          const map: any = {};
          cloudData.forEach((row: any) => {
             map[row.key] = row.value;
          });

          // Merge cloud data if exists
          if (map[DB_KEYS.PRODUCTS]) data.products = map[DB_KEYS.PRODUCTS];
          if (map[DB_KEYS.ORDERS]) data.orders = map[DB_KEYS.ORDERS];
          if (map[DB_KEYS.REPORTS]) data.reports = map[DB_KEYS.REPORTS];
          if (map[DB_KEYS.BANNER]) data.bannerText = map[DB_KEYS.BANNER];
          if (map[DB_KEYS.POPUP]) data.popupConfig = map[DB_KEYS.POPUP];
          if (map[DB_KEYS.SITE]) data.siteConfig = map[DB_KEYS.SITE];
          
          console.log("Cloud sync successful");
        } else {
            console.warn("Could not fetch from Supabase (Tables might not exist yet). Using local data.", error);
        }
      } catch (err) {
        console.error("Supabase fetch error:", err);
      }
    }

    return data;
  },

  // Generic Save Function (Local + Cloud)
  async _save(key: string, value: any) {
    // 1. Save Local
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);

    // 2. Save Cloud (if connected)
    const client = initSupabase();
    if (client) {
      try {
        // Upsert to 'store_data' table
        await client.from('store_data').upsert(
          { key: key, value: value },
          { onConflict: 'key' }
        );
      } catch (e) {
        console.error(`Failed to save ${key} to cloud`, e);
      }
    }
  },

  saveProducts: (products: Product[]) => mockServer._save(DB_KEYS.PRODUCTS, products),
  saveOrders: (orders: Order[]) => mockServer._save(DB_KEYS.ORDERS, orders),
  saveReports: (reports: Report[]) => mockServer._save(DB_KEYS.REPORTS, reports),
  saveCart: (cart: CartItem[]) => mockServer._save(DB_KEYS.CART, cart), // Cart usually stays local, but syncing for demo
  saveBanner: (text: string) => mockServer._save(DB_KEYS.BANNER, text),
  savePopupConfig: (config: PopupConfig) => mockServer._save(DB_KEYS.POPUP, config),
  saveSiteConfig: (config: SiteConfig) => mockServer._save(DB_KEYS.SITE, config),

  resetData: () => {
    // Clear connection keys too? No, keep them for convenience usually, but let's clear all for "Factory Reset"
    localStorage.clear();
    window.location.reload();
  }
};