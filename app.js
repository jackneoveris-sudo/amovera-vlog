/* ===========================================================================
   Amovera · S.T.A.M.P. — the page's small amount of behaviour.

   Three jobs: run the intro once and get out of the way, render the entries
   from posts.js, and keep the section dots in step with where the reader is.

   Everything here is an enhancement. With JavaScript off, the intro never
   appears (a <noscript> rule hides it), the page scrolls normally, and the
   only thing missing is the entry list — which is why the empty state and the
   dots are built here rather than written into the HTML as a promise the file
   might not keep.
   ======================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- intro */
  (function intro() {
    var el = document.getElementById('intro');
    if (!el) return;

    // Once per visit. Coming back from the book shouldn't mean sitting
    // through it again. sessionStorage can throw in a locked-down browser,
    // so every touch of it is guarded — a storage failure must not leave the
    // overlay stuck over the page.
    var seen = false;
    try { seen = sessionStorage.getItem('stamp.intro') === '1'; } catch (e) {}

    if (seen || reduced) { el.remove(); return; }
    try { sessionStorage.setItem('stamp.intro', '1'); } catch (e) {}

    var gone = false;
    function dismiss() {
      if (gone) return;
      gone = true;
      el.classList.add('is-done');
      window.setTimeout(function () { el.remove(); }, 500);
      document.removeEventListener('keydown', onKey);
    }
    function onKey() { dismiss(); }

    document.getElementById('skip').addEventListener('click', dismiss);
    el.addEventListener('click', dismiss);
    document.addEventListener('keydown', onKey);

    // The CSS animation ends at 6.5s. This is the backstop: if the animation
    // never fires — a browser that throttles background tabs, an interrupted
    // stylesheet — the overlay still comes off and the page is reachable. An
    // intro that can trap the reader is worse than no intro.
    window.setTimeout(dismiss, 7000);
  })();

  /* ---------------------------------------------------------------- posts */
  (function posts() {
    var host = document.getElementById('posts');
    if (!host) return;

    var list = (typeof POSTS !== 'undefined' && Array.isArray(POSTS)) ? POSTS : [];

    if (!list.length) {
      var empty = document.createElement('div');
      empty.className = 'empty';
      empty.innerHTML =
        '<span class="mark" aria-hidden="true">&#9827;</span>' +
        '<p><strong>The first entries are being filmed.</strong></p>' +
        '<p class="fine">They will appear here as they are published.</p>';
      host.appendChild(empty);
      return;
    }

    // Newest first, whatever order the file happens to be in. An entry with
    // no date sorts to the top rather than vanishing to the bottom.
    list.slice().sort(function (a, b) {
      return String(b.date || '9999').localeCompare(String(a.date || '9999'));
    }).forEach(function (p) {
      host.appendChild(render(p));
    });

    function render(p) {
      // THREE SHAPES, DECIDED BY WHAT THE ENTRY CARRIES.
      //   a youtube id  -> a card that becomes a player when clicked
      //   a url         -> an ordinary link out
      //   neither       -> the entry, marked as not yet watchable
      if (p.youtube) return renderVideo(p);
      return renderLink(p);
    }

    /* ---------------------------------------------------------------------
       THE FACADE. A YouTube embed written into the page would contact Google
       for every visitor who never pressed play, and set its cookies for them
       too. So nothing of YouTube's is loaded until someone asks: the card
       shows an image from this site, and the click that means "play" is the
       click that fetches the player.

       youtube-nocookie.com is the privacy-enhanced host, which is what
       jackneoveris.com already uses. It is not no-tracking — it is
       less-tracking, and only once the viewer has chosen to play.
    --------------------------------------------------------------------- */
    function renderVideo(p) {
      var art = document.createElement('article');
      art.className = 'post post--video';

      var stage = document.createElement('div');
      stage.className = 'stage';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'facade';
      btn.setAttribute('aria-label', 'Play: ' + (p.title || 'this entry'));

      if (p.thumb) {
        var img = document.createElement('img');
        img.src = p.thumb;
        img.alt = '';
        img.loading = 'lazy';
        btn.appendChild(img);
      }
      var play = document.createElement('span');
      play.className = 'play';
      play.setAttribute('aria-hidden', 'true');
      btn.appendChild(play);

      btn.addEventListener('click', function () {
        var frame = document.createElement('iframe');
        frame.src = 'https://www.youtube-nocookie.com/embed/' +
                    encodeURIComponent(p.youtube) +
                    '?autoplay=1&rel=0&modestbranding=1';
        frame.title = p.title || 'Video';
        frame.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
        frame.allowFullscreen = true;
        frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        stage.replaceChild(frame, btn);
      });

      stage.appendChild(btn);
      art.appendChild(stage);
      art.appendChild(body(p, 'https://www.youtube.com/watch?v=' + encodeURIComponent(p.youtube)));
      return art;
    }

    function renderLink(p) {
      // No destination yet: show the entry, say so plainly, and do not pretend
      // to be a link. An <a> with nowhere to go is worse than a line of text.
      var el = document.createElement(p.url ? 'a' : 'article');
      el.className = 'post' + (p.thumb ? ' post--thumb' : '') + (p.url ? '' : ' post--pending');
      if (p.url) {
        el.href = p.url;
        if (/^https?:\/\//i.test(p.url)) el.rel = 'noopener';
      }
      if (p.thumb) {
        var img = document.createElement('img');
        img.src = p.thumb; img.alt = ''; img.loading = 'lazy';
        el.appendChild(img);
      }
      el.appendChild(body(p, null));
      return el;
    }

    function body(p, watchHref) {
      var box = document.createElement('div');
      box.className = 'body';

      var meta = [fmtDate(p.date), p.length].filter(Boolean).join(' · ');
      if (meta) {
        var m = document.createElement('p');
        m.className = 'meta';
        m.textContent = meta;
        box.appendChild(m);
      }

      var h = document.createElement('h3');
      h.textContent = p.title || 'Untitled entry';
      box.appendChild(h);

      if (p.blurb) {
        var d = document.createElement('p');
        d.textContent = p.blurb;
        box.appendChild(d);
      }

      if (watchHref) {
        var a = document.createElement('a');
        a.className = 'watch-out';
        a.href = watchHref;
        a.rel = 'noopener';
        a.textContent = 'Watch on YouTube →';
        box.appendChild(a);
      } else if (!p.url) {
        var s = document.createElement('p');
        s.className = 'pending';
        s.textContent = 'Coming shortly.';
        box.appendChild(s);
      }

      return box;
    }

    // Dates are written plainly in posts.js. Parsed as UTC on purpose: a bare
    // "2026-11-03" read as local time can render as the 2nd for anyone west
    // of Greenwich, which is where the author is.
    function fmtDate(s) {
      if (!s) return '';
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s).trim());
      if (!m) return String(s);
      var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
      if (isNaN(d.getTime())) return String(s);
      return d.toLocaleDateString('en-CA', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
      });
    }
  })();

  /* ----------------------------------------------------------------- dots */
  (function dots() {
    var nav = document.getElementById('dots');
    var deck = document.getElementById('deck');
    if (!nav || !deck) return;

    var panels = Array.prototype.slice.call(deck.querySelectorAll('.panel'));
    if (panels.length < 2) return;

    var links = panels.map(function (p) {
      var a = document.createElement('a');
      a.href = '#' + p.id;
      a.setAttribute('aria-label', (p.querySelector('h1, h2') || {}).textContent || p.id);
      nav.appendChild(a);
      return a;
    });

    if (!('IntersectionObserver' in window)) { links[0].classList.add('is-active'); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = panels.indexOf(e.target);
        links.forEach(function (l, n) { l.classList.toggle('is-active', n === i); });
      });
    }, { root: deck, threshold: 0.5 });

    panels.forEach(function (p) { io.observe(p); });
  })();
})();
