# SubText - Quick Start Guide

## 🚀 What Changed?

Your app has been transformed from **React Native mobile app** → **Mobile Web App** with PayPal subscriptions!

---

## ⚡ Quick Deploy (5 Steps)

### 1. Setup Database (2 minutes)

```bash
# Go to Supabase → SQL Editor → Run this file:
/SubText BackEnd/migrations/001_add_paypal_subscriptions.sql
```

### 2. Create PayPal Plans (3 minutes)

```bash
cd "/Users/saadzubedi/Desktop/SubText BackEnd"

# Add PayPal credentials to .env:
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_PRODUCT_ID=your_product_id

# Create plans
node scripts/create-paypal-plans.js

# Copy the Plan IDs output
```

### 3. Deploy Backend (1 minute)

```bash
# Add all PayPal env vars to Vercel dashboard
# Then push code:

git add .
git commit -m "Add PayPal subscriptions"
git push origin main
```

### 4. Update Frontend PayPal ID (1 minute)

**Edit these 2 files:**

1. `screens/SubscriptionScreen.js` line 8
2. `components/PayPalButton.web.js` line 5

Replace `YOUR_PAYPAL_CLIENT_ID` with your actual Client ID.

### 5. Deploy Frontend (2 minutes)

```bash
cd /Users/saadzubedi/Desktop/Subtext-main

# Build and deploy
npx expo export:web
vercel
```

---

## 💰 Pricing Tiers

| Tier | Price | Analyses/Month |
|------|-------|----------------|
| Basic | $4.99 | 25 |
| Pro | $9.99 | 100 |
| Premium | $19.99 | Unlimited |

---

## 🔑 Required Environment Variables

### Backend (Vercel)

```bash
# Existing (already set)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
OPENAI_API_KEY=

# NEW (add these)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_PRODUCT_ID=
PAYPAL_MODE=sandbox
PAYPAL_BASIC_PLAN_ID=
PAYPAL_PRO_PLAN_ID=
PAYPAL_PREMIUM_PLAN_ID=
PAYPAL_WEBHOOK_ID=
```

---

## 📱 How It Works Now

1. User visits web app (no download!)
2. Sign up → Redirect to subscription page
3. Select tier → PayPal button appears
4. Complete payment → Account activated
5. Upload screenshot → AI analysis
6. Usage tracked per tier limits

---

## 🧪 Test Mode

Use PayPal Sandbox for testing:
- Test credit cards: https://developer.paypal.com/tools/sandbox/card-testing/
- All payments are fake
- Switch to `PAYPAL_MODE=live` for real payments

---

## 📖 Full Documentation

See `DEPLOYMENT_GUIDE.md` for complete setup instructions.

See `PAYPAL_SETUP.md` in backend folder for PayPal details.

---

## ✅ Deploy Checklist

- [ ] Database migration run
- [ ] PayPal plans created
- [ ] Backend env vars set
- [ ] Frontend PayPal ID updated
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Test signup flow
- [ ] Test subscription flow
- [ ] Test analysis with image
- [ ] Test usage limits

---

## 🎊 That's It!

Your web app is ready to go! 🚀

For help: See DEPLOYMENT_GUIDE.md or backend/PAYPAL_SETUP.md
