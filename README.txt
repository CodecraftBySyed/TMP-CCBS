Tirupattur Multi Print (TMP) — Single Page Website

How to use:
- Open index.html in a static web server or directly in the browser.
- Edit `js/config.js` to update `COMPANY` information, `whatsappNumber`, `phoneNumber`, `email`, and `mapEmbedUrl`.
- Add real images into `images/logo/`, `images/machines/`, `images/gallery/`, and `images/hero/`.
 
Tailwind CSS (production note):
- `cdn.tailwindcss.com` is fine for development but not recommended for production.
- To build Tailwind for production, install via npm and generate `css/tailwind-built.css`:

```bash
npm init -y
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss -i ./src/input.css -o ./css/tailwind-built.css --minify
```

Create a minimal `src/input.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Then remove the CDN script in `index.html` and keep `css/tailwind-built.css`.

Notes:
- Language selector uses Google Translate widget. To change default language, edit localStorage key `siteLang`.
- Machines and gallery are data-driven via `data/machines.json` and `data/gallery.json`.
- All external actions (phone, email, whatsapp) show a SweetAlert2 confirmation before opening.
