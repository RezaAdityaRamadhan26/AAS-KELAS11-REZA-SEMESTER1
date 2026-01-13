# Vercel Deployment Fix

## Jika Ada Error Saat Redeploy:

### 1. Check Build Logs di Vercel
- Buka Vercel Dashboard
- Pilih deployment yang failed
- Klik "View Function Logs" atau "Build Logs"
- Screenshot error dan share

### 2. Common Errors & Solutions:

#### Error: "Module not found"
```bash
# Solution: Reinstall dependencies
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

#### Error: "NEXTAUTH_SECRET is not set"
- Pastikan env variable `NEXTAUTH_SECRET` ada di Vercel Settings
- Generate baru: `openssl rand -base64 32`

#### Error: "Database connection timeout"
- Check CA_CERT di Vercel (harus full PEM text)
- Check Aiven firewall allow Vercel IPs

#### Error: Cron job syntax invalid
File: vercel.json
```json
{
  "crons": [
    {
      "path": "/api/health",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### 3. Manual Redeploy Steps:
1. Vercel Dashboard → Project
2. Settings → General → Delete Project (jika perlu reset)
3. Reconnect GitHub repo
4. Deploy ulang

### 4. Force New Deployment:
```bash
# Trigger new deployment
git commit --allow-empty -m "Trigger Vercel redeploy"
git push
```

## Quick Fix Commands:

```bash
# 1. Pull latest
git pull origin main

# 2. Clean install
rm -rf node_modules package-lock.json
npm install

# 3. Test build locally
npm run build

# 4. If success, force push
git add .
git commit -m "Fix deployment"
git push --force
```
