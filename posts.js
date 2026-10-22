/* ===========================================================================
   THE VLOG ENTRIES
   ---------------------------------------------------------------------------
   This is the only file you need to touch to publish an entry.

   Add a new one at the TOP of the list, between the square brackets, and keep
   the commas where they are. Save the file, and the page shows it.

   Each entry looks like this:

     {
       title:   "What the entry is called",
       date:    "2026-11-03",               // year-month-day
       length:  "14 min",                   // optional, omit the line if unknown
       youtube: "dQw4w9WgXcQ",              // the ID only - see below
       blurb:   "One or two sentences on what it follows.",
       thumb:   "assets/some-image.jpg"     // optional, omit the line if none
     },

   FINDING THE YOUTUBE ID. Open the video on YouTube and look at the address:

       https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                      ^^^^^^^^^^^ this part, nothing else

   Not the whole address, not a share link with "?si=" on the end. Just the ID.

   The video stays off the page until someone presses play: the card shows your
   own thumbnail, and only a click loads the player. Until then this site makes
   no request to YouTube at all, and sets none of its cookies.

   If an entry lives somewhere other than YouTube, use `url` instead of
   `youtube` and the card becomes an ordinary link.

   Only `title` and `url` are strictly needed; everything else is optional and
   the page copes with any of it missing.

   A note on `url`: it can point anywhere a video lives — a file in this
   folder, or a page on another site. Nothing here is tied to one platform.
   ======================================================================== */

const POSTS = [

  // ── Newest first. ────────────────────────────────────────────────────────
  {
    title:   "Amovera Origins: Introduction",
    date:    "2026-10-21",
    length:  "26 min",

    youtube: "v_zdaOGsesM",

    blurb:   "The first entry. Who is speaking, what Amovera is, and why the argument is being made in the open, where it can be checked.",
    thumb:   "assets/entry-01.jpg"
  },

];
