/**
 * MAGE QR REST — Firebase Configuration
 * ─────────────────────────────────────────────────────────────
 * Крок 1: Замініть значення нижче на свої з Firebase Console
 *
 * Де знайти:
 *   console.firebase.google.com
 *   → Ваш проєкт → Налаштування ⚙️ → Загальні → Ваші програми → </> Web
 *   → Firebase SDK snippet → Config
 * ─────────────────────────────────────────────────────────────
 */

export const firebaseConfig = {
  apiKey:            "AIzaSyDkkwnZmNC_1PdX_BJ1iaoJrDNoBCZ3RVA",
  authDomain:        "mageqrrest.firebaseapp.com",
  projectId:         "mageqrrest",
  storageBucket:     "mageqrrest.firebasestorage.app",
  messagingSenderId: "207231972557",
  appId:             "1:207231972557:web:f8234c22e6b32a0a2ee584"
};

/**
 * Дозволені домени (CORS + Firebase Auth)
 * Додайте сюди свій домен після розгортання
 */
export const ALLOWED_ORIGINS = [
  'https://mageqrrest.github.io',   // GitHub Pages (замініть на свій нікнейм)
  'https://mageqrrest.com',          // Власний домен (опціонально)
  'http://localhost:5500',            // Локальна розробка
  'http://127.0.0.1:5500',
];

/**
 * Firestore Collections Map
 * Централізовані назви колекцій — змінюйте тут, а не по всьому коду
 */
export const COLLECTIONS = {
  VENUES:     'venues',
  SETTINGS:   'settings',
  PLANS:      'plans',
  ORDERS:     (venueId) => `venues/${venueId}/orders`,
  ITEMS:      (venueId) => `venues/${venueId}/items`,
  CATEGORIES: (venueId) => `venues/${venueId}/categories`,
  TABLES:     (venueId) => `venues/${venueId}/tables`,
  STAFF:      (venueId) => `venues/${venueId}/staff`,
  DESIGN:     (venueId) => `venues/${venueId}/design`,
};

/**
 * Cloud Functions Base URL
 * Заповнюється після деплою Cloud Functions (Крок 3)
 */
export const FUNCTIONS_URL = 'https://us-central1-ВАШ_ПРОЄКТ.cloudfunctions.net';

/**
 * Payment Webhook URLs (генеруються автоматично після Кроку 3)
 */
export const WEBHOOKS = {
  liqpay:  `${FUNCTIONS_URL}/paymentWebhook?provider=liqpay`,
  mono:    `${FUNCTIONS_URL}/paymentWebhook?provider=mono`,
  wfp:     `${FUNCTIONS_URL}/paymentWebhook?provider=wfp`,
  abank:   `${FUNCTIONS_URL}/paymentWebhook?provider=abank`,
};