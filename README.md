# From Mina to Afif

A personal apology experience built with Next.js App Router and React. The original bilingual letter and closing are preserved from `../data.txt`. Interface copy is English.

## Local preview

```sh
npm ci
npm run dev -- --port 3000
```

## Verify and publish

```sh
npm run lint
npm run build
```

Select this `apology-site` folder as the Vercel project root, with the Next.js preset. The project also generates a static `out/` folder for static hosting. No database, environment variables, or backend are needed. The requested link name is `forminatobaby`, subject to availability. Hosting and publication are separate from this local delivery.

## Content and assets

- `app/content.ts`: Mina's original letter, closing, captions, and two songs.
- `app/page.tsx`: opening, five letter chapters, photo carousel, four interactive promises, and two response outcomes.
- `app/globals.css`: blush pink/ivory styling, responsive layout, reduced-motion support.
- `public/photos`: five customer photos, numbered in alphabetical order of the source filenames. Captions follow the matching source file.
- `public/music`: the two supplied MP3 files, loaded only when needed.
- `public/art/letter-still-life.webp`: custom generated magnolia, envelope, and ribbon artwork, optimized to WebP.
- `public/fonts`: locally stored Cormorant Garamond regular and italic fonts.

Original source files outside this subfolder have not been modified. No customer data file is copied into `public`.

## Interaction details

Opening starts music after a user gesture. Playback can be paused, tracks changed, and volume adjusted using the top-right player. Playback failures leave a manual retry available. No audio autoplay is attempted on initial page load.

The letter can be read chapter by chapter or all at once. Photos support buttons, thumbnails, and horizontal swipes. Promise flowers can be opened in any order. Both final response buttons display local messages only; they do not notify Mina or save responses to a server. Refresh returns the experience to its opening screen.

There is no password because none was specified in the final customer brief. Search indexing is disabled, but the website is not access-controlled. QR preparation is handled by the project owner.

## Artwork

Generated with the built-in image generation tool. Prompt: refined editorial stationery still life with ivory cotton paper, blush silk ribbon, pale pink magnolia branch, folded letter and rose wax seal; soft natural light, tactile materials, no text or logos. The final asset is stored inside the project.
