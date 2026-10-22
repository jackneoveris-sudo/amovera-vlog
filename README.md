# Amovera · S.T.A.M.P.

The vlog site. One page: the entries, the work, and who is speaking.

There is **no build step**. The files here are the website. Edit one, save it,
and that is the change made.

---

## Adding a vlog entry

Open **`posts.js`**. Inside the square brackets you will find an example,
commented out. Copy it, uncomment it, and fill it in — newest at the top:

```js
{
  title: "What the entry is called",
  date:  "2026-11-03",
  length: "14 min",
  url:   "https://where-it-plays",
  blurb: "One or two sentences on what it follows.",
  thumb: "assets/entry-01.jpg"
},
```

Only `title` and `url` are required. Leave out any line you don't have —
the page copes. Keep the commas between entries.

Thumbnails go in `assets/`. Anything wide-ish works; the page crops to fit.

To see it before it goes live, open `index.html` in a browser.

---

## The files

| | |
|---|---|
| `index.html` | The page itself — all the sections of writing live here |
| `posts.js`   | **The only file you need for a new entry** |
| `styles.css` | Colours, type, layout, and the eclipse animation |
| `app.js`     | Runs the intro, builds the entry list, moves the dots |
| `assets/`    | Thumbnails and any images |
| `netlify.toml` | Tells Netlify to publish this folder as-is |

## The intro

An eclipse, three beats — Amovera, S.T.A.M.P., the Jack of Clubs — then the
page. It plays **once per visit**, not on every navigation, and it is skippable
by tap, click or any key. A visitor whose system asks for reduced motion never
sees it at all. If it ever fails to finish, a timer removes it after seven
seconds: an intro that can trap a reader is worse than no intro.

To change the timings, look for `@keyframes beat` and the three
`animation` lines under `.beat[data-beat="…"]` in `styles.css`.

## Going live

The site is static, so Netlify needs no build command — `netlify.toml`
already says to publish this folder. Point the Netlify site at this repository
and the domain at that site.

---

*Written works are CC BY-SA 4.0. Provisional and revisable.*
