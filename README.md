# ZEN TACH – Authentic Tech & Gadget E-Commerce Platform

A production-grade, high-performance technology & gadget e-commerce platform built for the Bangladesh market with modern React, TypeScript, Vite, Tailwind CSS, and Firebase backend.

---

## ⚡ Features

- **Storefront & Tech Catalog**: Clean catalog featuring smartphones, laptops, audio gear, smartwatches, keyboards, and drones with Bangladeshi Taka (৳ BDT) pricing.
- **Dynamic Filtering & Search**: Instant real-time search, brand filter, stock availability, price sliders, and category tabs.
- **Accepted Payments**: Authentic integration with bKash, Nagad, Visa, Mastercard, and Cash on Delivery (COD).
- **Cart & Secure Checkout**: Real-time quantity manipulation, instant order calculations, and stock checks.
- **Real-Time Order Tracking**: Dedicated order status lookup (`/track` and `/track/:orderId`) with progress indicators.
- **Admin Control Center (`/admin`)**:
  - Live revenue analytics and order fulfillment counters
  - Product catalog manager (add, edit, delete, stock adjustment)
  - Category manager, coupon codes, and home banners
  - One-click Firestore catalog synchronization and reset utilities
- **Firebase Backend**:
  - Firebase Authentication (Google Sign-In + Email/Password)
  - Cloud Firestore with locked-down security rules (`firestore.rules`)
  - Admin audit logging and RBAC protection
- **Optimized for Static & cPanel Hosting**:
  - Clean SPA routing supporting both HTML5 History and hash navigation
  - Production-ready `.htaccess` configuration for Apache/cPanel with Gzip, caching, and 404 rewrite prevention

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase Credentials
Open [`src/lib/firebaseConfig.ts`](src/lib/firebaseConfig.ts) and paste your Firebase Web project API credentials:
```typescript
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: ""
};

export const ADMIN_INITIAL_UID = "YOUR_FIREBASE_ADMIN_UID";
export const ADMIN_EMAIL = "your-email@gmail.com";
```
*(Alternatively, you can set `VITE_FIREBASE_*` environment variables in a `.env.production` file).*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

```bash
npm run build
```
This generates the optimized static bundle in the `dist/` directory.

---

## 🌐 Deployment

### Deploying to cPanel (Apache)
1. Run `npm run build`.
2. In your cPanel **File Manager**, navigate to `public_html/`.
3. Enable *"Show Hidden Files"* in File Manager settings.
4. Upload all files from the `dist/` folder into `public_html/` (including `dist/.htaccess`).
5. See [`CPANEL_DEPLOYMENT_GUIDE.md`](CPANEL_DEPLOYMENT_GUIDE.md) for full instructions.

### Deploying to Vercel / Netlify
1. Connect your GitHub repository to Vercel or Netlify.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Node version: 18+ or 20+

---

## 📁 Project Structure

```
ZEN-TACH/
├── public/                 # Static assets, logos, payment PNGs, .htaccess
├── src/
│   ├── components/         # UI components (Header, Footer, ProductCard, etc.)
│   ├── context/            # Global state (StoreContext, AuthContext)
│   ├── data/               # Product catalog & initial datasets
│   ├── firebase/           # Firebase initialization & audit utilities
│   ├── lib/                # firebaseConfig.ts (API credentials configuration)
│   ├── pages/              # Core pages (Home, Shop, Admin, Cart, Checkout, etc.)
│   ├── router/             # RouterContext (SPA routing & deep linking)
│   ├── types/              # TypeScript interfaces & types
│   ├── utils/              # Helper utilities
│   ├── App.tsx             # Root application component
│   └── main.tsx            # Vite React entrypoint
├── .github/workflows/      # GitHub Actions CI build & test workflow
├── firestore.rules         # Production Firestore Security Rules
├── storage.rules           # Production Firebase Storage Rules
├── vite.config.ts          # Vite build configuration
└── package.json            # Project dependencies & scripts
```

---

## 📄 License
MIT License. Created for ZEN TACH.
