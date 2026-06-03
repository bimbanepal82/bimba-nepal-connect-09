# 🎯 BIMBA Nepal - Quick Start Checklist

## Phase 1: Preparation (Today)
- [ ] Review INTEGRATION_GUIDE.md
- [ ] Review WORKSPACE_GUIDE.md
- [ ] Test both repos build locally
- [ ] Verify GitHub secrets are ready

## Phase 2: Configuration (This Week)
- [ ] Add Cloudflare API token to GitHub Secrets
- [ ] Add Cloudflare Account ID to GitHub Secrets
- [ ] Enable GitHub Pages for both repos
- [ ] Create Cloudflare Pages projects
- [ ] Configure domain DNS records

## Phase 3: Testing (Before Deployment)
- [ ] Test bimanepal builds: `npm run build`
- [ ] Test bimba-nepal-connect builds: `npm run build`
- [ ] Test cross-app navigation locally
- [ ] Test GitHub Actions workflow manually
- [ ] Verify Cloudflare deployment

## Phase 4: Launch (Go Live)
- [ ] Make small commit to main
- [ ] Watch GitHub Actions deploy both apps
- [ ] Verify both sites live
- [ ] Test user journey (bimba.org.np → connect)
- [ ] Monitor Cloudflare analytics

## Phase 5: Post-Launch
- [ ] Setup monitoring/alerts
- [ ] Configure backups
- [ ] Document deployment process
- [ ] Plan scaling strategy

---

## 🔑 GitHub Secrets Needed

Add to bimba-nepal-connect-09 repository settings:

```
CLOUDFLARE_API_TOKEN = (get from Cloudflare)
CLOUDFLARE_ACCOUNT_ID = (get from Cloudflare)
```

---

## 🌐 Domain Configuration

**Primary: bimba.org.np**
- Points to bimanepal (static site)
- Cloudflare DNS CNAME: bimanepal.pages.dev

**Optional: connect.bimba.org.np**
- Points to bimba-nepal-connect (React app)
- Cloudflare DNS CNAME: bimba-nepal-connect.pages.dev

---

## 📱 Live URLs After Deployment

| App | GitHub Pages | Cloudflare | Custom Domain |
|-----|--|--|--|
| **BIMANEPAL** | github.com/bimbanepal82/bimanepal | bimba-nepal.pages.dev | bimba.org.np |
| **BIMBA-NEPAL-CONNECT** | github.com/bimbanepal82/bimba-nepal-connect-09 | bimba-nepal-connect.pages.dev | connect.bimba.org.np |

---

## 🆘 Need Help?

1. **Build fails?** → Check GitHub Actions logs
2. **Deploy fails?** → Check Cloudflare dashboard
3. **Domain issues?** → Check DNS records
4. **Conflict?** → See INTEGRATION_GUIDE.md

---

## 📚 Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Setup GitHub Pages & Cloudflare
- [WORKSPACE_GUIDE.md](./WORKSPACE_GUIDE.md) - Monorepo setup
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Connect both repos, conflict resolution

---

**You're ready! Let's build the BIMBA Nepal platform! 🚀**
