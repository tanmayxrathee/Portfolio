# Tanmay — personal portfolio

A one-page portfolio built with Vite, React, and TypeScript. The background is a local, image-sampled pixel canvas with pointer interaction, layered with a CSS CRT treatment.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local address after the server starts.

## Build and preview

```sh
npm run build
npm run preview
```

The static site is generated in `dist/`.

## Deploy to Vercel

Push this project to GitHub, import the repository in Vercel, and accept the detected Vite settings. The build command is `npm run build`, and the output directory is `dist`; no extra Vercel configuration is needed.

## Editing the portfolio

- Update the name, biography, skills, placeholder projects, contact details, and labels in [`src/data/content.ts`](./src/data/content.ts).
- Change `activeBackground` in the same file to `"nebula"`, `"starMountain"`, or `"deepSpace"` to switch the background image.
- Replace the corresponding files in `public/assets/` to use your own optimized images. Keep them local so the canvas can sample their pixels.
- The footer's **Image sources · Unsplash** link opens the image credit list.
- Fraunces and JetBrains Mono are loaded from Google Fonts in `index.html`.

## Image sources

The three bundled WebP backgrounds are downloaded and compressed local copies of royalty-free Unsplash images. Their source image URLs:

- Nebula: [Unsplash image](https://images.unsplash.com/photo-1462331940025-496dfbfc7564)
- Star mountain: [Unsplash image](https://images.unsplash.com/photo-1519681393784-d120267933ba)
- Deep space: [Unsplash image](https://images.unsplash.com/photo-1534796636912-3b95b3ab5986)

The original Unsplash image pages no longer resolve from their legacy photo IDs, so photographer names could not be reliably verified. The bundled files remain local and do not request the source URLs at runtime.
