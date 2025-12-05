# SubText Web App - Complete Deployment Guide

## 🎯 Overview

SubText has been transformed from a React Native mobile app to a **mobile-optimized web application** with PayPal subscription integration.

**Key Changes:**
- ✅ Expo Web platform enabled
- ✅ PayPal subscription system (Basic, Pro, Premium tiers)
- ✅ Tier-based usage limits (25, 100, unlimited analyses)
- ✅ Web-compatible image upload
- ✅ Responsive mobile-first design
- ✅ Vercel deployment ready

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ **PayPal Business Account** with API credentials
2. ✅ **Vercel Account** (for frontend hosting)
3. ✅ **Backend deployed** on Vercel with PayPal integration
4. ✅ **Supabase database** with schema updated
5. ✅ **OpenAI API Key** (already set in Vercel)

---

## 🗄️ Database Setup

### Step 1: Run Migration

Go to your Supabase Dashboard → SQL Editor → New query

Run the migration file from backend:
```
/SubText BackEnd/migrations/001_add_paypal_subscriptions.sql
```

This adds:
- `tier` column (basic/pro/premium)
- `paypal_subscription_id` column
- `paypal_plan_id` column
- `monthly_limit` column
- Usage tracking triggers

---

## 💳 PayPal Setup

### Step 1: Get API Credentials

1. Go to https://developer.paypal.com
2. Dashboard → My Apps & Credentials
3. Create App → Copy **Client ID** and **Secret**

### Step 2: Create Product

1. PayPal Dashboard → Products & Services
2. Create Product:
   - Name: "SubText Conversation Analysis"
   - Type: Digital Product
3. Copy the **Product ID**

### Step 3: Create Subscription Plans

In your backend directory:

```bash
cd "/Users/saadzubedi/Desktop/SubText BackEnd"

# Add to .env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_PRODUCT_ID=your_product_id
PAYPAL_MODE=sandbox  # or 'live' for production

# Run plan creation script
node scripts/create-paypal-plans.js
```

This creates three plans and outputs Plan IDs. Copy them!

### Step 4: Configure Webhooks

1. PayPal Dashboard → Webhooks
2. Add Webhook:
   - URL: `https://subtext-backend-f8ci.vercel.app/api/webhooks/paypal`
   - Events: Select all `BILLING.SUBSCRIPTION.*` events
3. Copy the **Webhook ID**

### Step 5: Update Backend Environment Variables

In Vercel (backend project):

```bash
# Existing variables
SUPABASE_URL=https://iovqftvkvdqftixwtylv.supabase.co
SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_KEY=your_key
OPENAI_API_KEY=sk-your-key

# NEW PayPal variables
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_PRODUCT_ID=PROD-xxxxx
PAYPAL_MODE=sandbox
PAYPAL_BASIC_PLAN_ID=P-xxxxx
PAYPAL_PRO_PLAN_ID=P-xxxxx
PAYPAL_PREMIUM_PLAN_ID=P-xxxxx
PAYPAL_WEBHOOK_ID=xxxxx
```

---

## 🚀 Backend Deployment

### Step 1: Commit Changes

```bash
cd "/Users/saadzubedi/Desktop/SubText BackEnd"

# Stage all changes
git add .

# Commit
git commit -m "Add PayPal subscription system with tier-based limits"

# Push to GitHub
git push origin main
```

Vercel will auto-deploy your backend.

### Step 2: Verify Deployment

Test these endpoints:

```bash
# Health check
https://subtext-backend-f8ci.vercel.app/api

# Get subscription plans
https://subtext-backend-f8ci.vercel.app/api/subscriptions/plans
```

---

## 🎨 Frontend Setup

### Step 1: Update PayPal Client ID

Edit these files and replace `YOUR_PAYPAL_CLIENT_ID`:

1. `/Users/saadzubedi/Desktop/Subtext-main/screens/SubscriptionScreen.js`
   - Line 8: `const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID';`

2. `/Users/saadzubedi/Desktop/Subtext-main/components/PayPalButton.web.js`
   - Line 5: `const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID';`

Replace with your **PayPal Client ID** (same one used in backend).

### Step 2: Build for Web

```bash
cd /Users/saadzubedi/Desktop/Subtext-main

# Install dependencies (if not already)
npm install

# Build for web (creates static files)
npx expo export:web
```

This creates a `web-build` or `dist` folder with static files.

### Step 3: Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Project name: subtext-web
# - Build command: expo export:web
# - Output directory: dist
```

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com/new
2. Import Git Repository
3. Select your SubText frontend repo
4. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `expo export:web`
   - **Output Directory**: `dist`
5. Deploy!

### Step 4: Configure Domain (Optional)

In Vercel dashboard:
- Settings → Domains
- Add your custom domain (e.g., `subtext.ai`)

---

## 🔧 Final Configuration

### Update CORS (if needed)

If your frontend is on a different domain, update backend `server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:19006'],
  credentials: true
}));
```

### Test Complete Flow

1. ✅ Visit your web app
2. ✅ Sign up → should redirect to subscription page
3. ✅ Select a plan → PayPal popup appears
4. ✅ Complete payment → subscription activated
5. ✅ Upload screenshot → analysis works
6. ✅ Check usage limits → stops at tier limit

---

## 📱 Mobile Web Optimization

The app is already optimized for mobile web browsers:

- ✅ Responsive design (viewport meta tag)
- ✅ Touch-friendly buttons
- ✅ Mobile file picker
- ✅ PWA-ready (installable)
- ✅ Dark theme
- ✅ Fast loading

### Make it Installable (PWA)

Users can "Add to Home Screen" on mobile devices. The app will behave like a native app!

**On iOS:**
1. Open Safari → Visit your site
2. Tap Share button
3. Tap "Add to Home Screen"

**On Android:**
1. Open Chrome → Visit your site
2. Tap menu (3 dots)
3. Tap "Add to Home screen"

---

## 🎭 Testing Checklist

### Authentication
- [ ] Sign up with new account
- [ ] Login with existing account
- [ ] Logout

### Subscriptions
- [ ] View subscription plans
- [ ] Subscribe with PayPal (Basic)
- [ ] Check subscription status
- [ ] Cancel subscription

### Analysis
- [ ] Upload image (web file picker)
- [ ] Text extraction works
- [ ] AI analysis displays
- [ ] Usage counter increments
- [ ] Limit enforcement works

### Edge Cases
- [ ] Try to analyze without subscription
- [ ] Try to exceed tier limit
- [ ] Check usage resets monthly
- [ ] Webhook receives PayPal events

---

## 🐛 Troubleshooting

### "PayPal SDK failed to load"
- Check `PAYPAL_CLIENT_ID` in frontend files
- Verify internet connection
- Check browser console for errors

### "Subscription required" error
- Check user has active subscription in database
- Verify subscription hasn't expired
- Check PayPal webhook is receiving events

### "Usage limit reached"
- Check `usage_tracking` table in Supabase
- Verify `monthly_limit` in subscriptions table
- Premium tier should have `monthly_limit = -1`

### Image upload not working
- Ensure file is an image (JPEG, PNG)
- Check file size < 10MB
- Verify OpenAI API key is set in backend
- Check browser console for errors

---

## 📊 Monitoring

### Database Queries

**Check active subscriptions:**
```sql
SELECT u.email, s.tier, s.monthly_limit, s.status, s.expires_at
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE s.status = 'active';
```

**Check usage:**
```sql
SELECT u.email, ut.month, ut.analyses_count, s.monthly_limit
FROM usage_tracking ut
JOIN users u ON ut.user_id = u.id
JOIN subscriptions s ON s.user_id = u.id
ORDER BY ut.updated_at DESC;
```

### PayPal Dashboard

Monitor subscriptions in PayPal Dashboard:
- Active subscriptions
- Failed payments
- Cancellations
- Revenue

---

## 🎉 Go Live Checklist

Before launching to production:

### Backend
- [ ] Switch PayPal to live mode (`PAYPAL_MODE=live`)
- [ ] Update PayPal credentials to production keys
- [ ] Update webhook URL to production backend
- [ ] Test all endpoints in production
- [ ] Monitor error logs

### Frontend
- [ ] Update PayPal Client ID to production
- [ ] Test on multiple mobile browsers (iOS Safari, Chrome)
- [ ] Test PayPal flow with real payment
- [ ] Verify PWA install works
- [ ] Set up analytics (optional)

### Database
- [ ] Backup database
- [ ] Set up automated backups
- [ ] Monitor query performance

### Legal (Important!)
- [ ] Add Privacy Policy
- [ ] Add Terms of Service
- [ ] Add Refund Policy
- [ ] GDPR compliance (if serving EU)

---

## 📞 Support Resources

- **Backend Code**: `/Users/saadzubedi/Desktop/SubText BackEnd/`
- **Frontend Code**: `/Users/saadzubedi/Desktop/Subtext-main/`
- **PayPal Docs**: https://developer.paypal.com/docs/subscriptions/
- **Expo Web Docs**: https://docs.expo.dev/guides/running-in-the-browser/
- **Vercel Docs**: https://vercel.com/docs

---

## 🎊 You're Done!

Your SubText app is now:
- ✅ A mobile web app (no download needed)
- ✅ Integrated with PayPal subscriptions
- ✅ Enforcing tier-based usage limits
- ✅ Ready to deploy and monetize

**Next Steps:**
1. Deploy and test
2. Market your app
3. Monitor user feedback
4. Iterate and improve!

Good luck! 🚀
