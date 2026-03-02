# Deploy EXE201_WEB lên Vercel

## Cách 1: Deploy qua Vercel Dashboard (nhanh)

1. Đẩy code lên GitHub (nếu chưa có)
2. Vào [vercel.com](https://vercel.com) → **Add New Project**
3. Import repo **EXE201_WEB** (hoặc repo chứa project)
4. **Root Directory**: chọn thư mục `EXE201_WEB` (nếu project nằm trong monorepo)
5. **Framework Preset**: Vite (tự động)
6. **Environment Variables** → thêm:
   - `VITE_APP_API_URL` = `https://smartparkingexe.azurewebsites.net`
7. **Deploy**

---

## Cách 2: Deploy qua Vercel CLI

```bash
# Cài Vercel CLI (1 lần)
npm i -g vercel

# Vào thư mục project
cd EXE201_WEB

# Deploy (lần đầu sẽ hỏi login)
vercel

# Deploy production
vercel --prod
```

---

## Cấu hình đã có

- `vercel.json`: SPA routing (rewrites / → index.html)
- Vite build: output `dist/`

## Backend CORS

Đảm bảo backend Azure đã thêm domain Vercel vào CORS:

- Azure App Settings: `CORS__AllowedOrigins` = `https://your-app.vercel.app,https://yourapp.vercel.app`
