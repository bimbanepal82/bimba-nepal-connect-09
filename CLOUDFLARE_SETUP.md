# 🚀 BIMBA Nepal - Cloudflare Pages Setup Guide

## Your Cloudflare Projects (Ready to Create)

### Project 1: bimba-nepal (Static Site)
```
Repository: bimbanepal82/bimanepal
Build Command: npm run build
Build Output: dist
Environment: NODE_ENV=production
Domain: bimba-nepal.pages.dev
Custom Domain: bimba.org.np (optional)
```

### Project 2: bimba-nepal-connect (React App)
```
Repository: bimbanepal82/bimba-nepal-connect-09
Build Command: npm run build
Build Output: dist
Environment: NODE_ENV=production
Domain: bimba-nepal-connect.pages.dev
Custom Domain: connect.bimba.org.np (optional)
```

---

## Manual Setup Instructions

### Step 1: Create bimba-nepal Project

1. **Go to:** https://dash.cloudflare.com/pages
2. **Click:** Create a project
3. **Select:** Connect to Git
4. **Choose Repository:** bimbanepal82/bimanepal
5. **Build Settings:**
   - Framework: None
   - Build command: `npm run build`
   - Build output directory: `dist`
6. **Environment Variables:**
   - `NODE_ENV` = `production`
7. **Click:** Save and Deploy
8. **Wait:** 2-3 minutes for first build

**Your URL will be:** `https://bimba-nepal.pages.dev`

---

### Step 2: Create bimba-nepal-connect Project

1. **Back in Pages Dashboard**
2. **Click:** Create a project
3. **Select:** Connect to Git
4. **Choose Repository:** bimbanepal82/bimba-nepal-connect-09
5. **Build Settings:**
   - Framework: None
   - Build command: `npm run build`
   - Build output directory: `dist`
6. **Environment Variables:**
   - `NODE_ENV` = `production`
7. **Click:** Save and Deploy
8. **Wait:** 2-3 minutes for first build

**Your URL will be:** `https://bimba-nepal-connect.pages.dev`

---

## After Both Projects Are Created

### Verify Deployments

1. **Go to:** https://dash.cloudflare.com/pages
2. **You should see:**
   - ✅ bimba-nepal (Last deployment: successful)
   - ✅ bimba-nepal-connect (Last deployment: successful)

### Test Live URLs

- **Test bimanepal:** https://bimba-nepal.pages.dev
- **Test React app:** https://bimba-nepal-connect.pages.dev
- **Both should load** ✅

---

## Optional: Configure Custom Domain

### If you own bimba.org.np:

1. **For bimba-nepal:**
   - Pages → bimba-nepal → Settings
   - Custom domains → Add custom domain
   - Enter: `bimba.org.np`
   - Follow DNS configuration

2. **For bimba-nepal-connect:**
   - Pages → bimba-nepal-connect → Settings
   - Custom domains → Add custom domain
   - Enter: `connect.bimba.org.np`
   - Follow DNS configuration

---

## ✅ Deployment Checklist

- [ ] GitHub Secrets added (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)
- [ ] bimba-nepal Cloudflare Pages project created
- [ ] bimba-nepal-connect Cloudflare Pages project created
- [ ] Both projects built successfully
- [ ] Both Cloudflare URLs accessible
- [ ] GitHub Pages URLs accessible
- [ ] Custom domain configured (optional)
- [ ] Test deployment triggered
- [ ] All sites live and working

---

## 🎊 Once Everything Is Set Up

Your automated deployment will work like this:

```
git push origin main
    ↓
GitHub Actions Triggered
    ↓
Build & Test Both Apps
    ↓
Deploy to GitHub Pages + Cloudflare
    ↓
✅ Both sites live in 2-3 minutes!
```

---

## 📞 Support

If deployment fails:
1. Check GitHub Actions logs
2. Check Cloudflare Pages build logs
3. Verify build command: `npm run build`
4. Verify output directory: `dist`
5. Check that both repos have all dependencies

---

**Next: Go to Cloudflare and create both Pages projects!**

Then your BIMBA Nepal platform will be fully live! 🚀
