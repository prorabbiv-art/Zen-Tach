# ZEN TACH - cPanel / Apache Static Site Deployment Guide

This guide explains how to build and deploy the ZEN TACH E-Commerce application to any cPanel Apache hosting account (root domain or subdomain).

---

## 1. Firebase API Configuration

You can configure your Firebase credentials in either of two convenient ways:

### Option A: Edit `src/lib/firebaseConfig.ts` (Recommended)
Open `src/lib/firebaseConfig.ts` (or `src/utils/firebaseConfig.ts`) and paste your Firebase Web API credentials directly:

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "" // Optional
};

export const ADMIN_INITIAL_UID = "YOUR_ADMIN_FIREBASE_UID";
export const ADMIN_EMAIL = "your-admin-email@gmail.com";
```

### Option B: Using `.env` or `.env.production`
You can create a `.env.production` file in the project root:
```env
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_ADMIN_UID=YOUR_ADMIN_FIREBASE_UID
VITE_ADMIN_EMAIL=your-admin-email@gmail.com
```

---

## 2. Building for Production

Open your terminal in the project directory and run:

```bash
npm run build
```

This generates an optimized static bundle in the `dist/` folder:
- Minified, code-split JavaScript and CSS
- Static assets (images, logos, fonts)
- `.htaccess` file automatically copied into `dist/` from `public/`

---

## 3. Uploading to cPanel File Manager

1. Log in to your **cPanel**.
2. Click **File Manager**.
3. Navigate to **`public_html`** (or your subdomain directory, e.g., `shop.yourdomain.com`).
4. **Important**: In cPanel File Manager, click the **Settings** button (top-right corner) and check **"Show Hidden Files (dotfiles)"** so you can see `.htaccess`.
5. Upload all files and folders located **inside** the `dist/` folder into `public_html/`:
   ```
   public_html/
   ├── assets/
   ├── payments/
   ├── paymant/
   ├── index.html
   └── .htaccess
   ```
   > **Tip**: You can zip the contents of `dist/` as `dist.zip`, upload it to `public_html`, and click **Extract** in cPanel File Manager.

---

## 4. Client-Side Routing & .htaccess Explanation

In a Single Page Application (React SPA), when a user visits a direct URL or refreshes the page (e.g., `https://yourdomain.com/shop`, `https://yourdomain.com/admin`, `https://yourdomain.com/product/prod-1`), Apache must route the request to `index.html` rather than returning an Apache 404 error.

The included `.htaccess` file handles this automatically:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

It also includes:
- Gzip / Deflate compression for ultra-fast asset transfers.
- Browser cache policies (1-year caching for hashed static assets, instant revalidation for `index.html`).
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
- Protection for hidden files.

---

## 5. Authorized Domain in Firebase Authentication

Remember to add your domain to Firebase Authentication so users and admins can sign in:
1. Go to **Firebase Console** -> **Authentication** -> **Settings** tab.
2. Under **Authorized domains**, click **Add domain**.
3. Enter your domain (e.g. `yourdomain.com` or `www.yourdomain.com`).
