/**
 * D for DSA: application layer.
 *
 * No build step and no dependencies. Everything below is plain DOM, the
 * IntersectionObserver and the Web Animations API.
 */

(() => {
    'use strict';

    const CURRICULUM = window.CURRICULUM;

    /** Sentinel slug for the default "everything" view. */
    const ALL = 'all';

    const TOTAL = CURRICULUM.reduce((n, c) => n + c.problems.length, 0);
    const STORE_KEY = 'dfdsa:v1';
    const THEME_KEY = 'dfdsa:theme';

    /* ---------------------------------------------------------------------
       State
       --------------------------------------------------------------------- */

    /** @type {Set<string>} keys are `${slug}:${ordinal}`. */
    let done = new Set();
    let currentSlug = ALL;

    const $ = (sel, root = document) => root.querySelector(sel);

    /** matchMedia, guarded. Absent in some embedded and SSR contexts. */
    const mq = (query) =>
        window.matchMedia && window.matchMedia(query).matches;

    const reduceMotion = () => mq('(prefers-reduced-motion: reduce)');

    /* ---------------------------------------------------------------------
       Persistence
       --------------------------------------------------------------------- */

    function load() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) done = new Set(parsed);
        } catch {
            /* Corrupt or unavailable storage is not worth surfacing. */
        }
    }

    function save() {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify([...done]));
        } catch {
            /* Private mode. Progress just will not survive the session. */
        }
    }

    const isDone = (slug, ordinal) => done.has(`${slug}:${ordinal}`);
    const doneIn = (slug) =>
        CURRICULUM.find((c) => c.slug === slug).problems.filter((_, i) =>
            isDone(slug, i + 1)
        ).length;

    /* ---------------------------------------------------------------------
       Theme
       --------------------------------------------------------------------- */

    function applyTheme(name) {
        document.documentElement.dataset.theme = name;
        const btn = $('#theme-toggle');
        btn.setAttribute('aria-label', `Switch to ${name === 'ink' ? 'paper' : 'ink'} theme`);
        btn.setAttribute('aria-pressed', String(name === 'paper'));
        btn.innerHTML = name === 'ink' ? sunIcon() : moonIcon();
    }

    function initTheme() {
        let stored = null;
        try {
            stored = localStorage.getItem(THEME_KEY);
        } catch {
            /* ignore */
        }
        const preferred =
            stored || (mq('(prefers-color-scheme: light)') ? 'paper' : 'ink');
        applyTheme(preferred);
    }

    function toggleTheme() {
        const next = document.documentElement.dataset.theme === 'ink' ? 'paper' : 'ink';
        applyTheme(next);
        try {
            localStorage.setItem(THEME_KEY, next);
        } catch {
            /* ignore */
        }
    }

    const sunIcon = () =>
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

    const moonIcon = () =>
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>';

    /* ---------------------------------------------------------------------
       Rail: chapter index with a per-chapter dot matrix
       --------------------------------------------------------------------- */

    function buildRail() {
        const list = $('#rail-list');
        const dotRow = (c) =>
            c.problems
                .map(
                    (_, i) =>
                        `<i class="matrix__dot" data-dot="${esc(c.slug)}:${i + 1}"></i>`
                )
                .join('');

        const chapters = CURRICULUM.map(
            (c) => `
        <li>
          <button class="chapter" type="button" data-slug="${esc(c.slug)}" aria-current="${c.slug === currentSlug}">
            <span class="chapter__name">${esc(c.title)}</span>
            <span class="chapter__count" data-count="${esc(c.slug)}">${String(c.problems.length).padStart(2, '0')}</span>
            <span class="matrix" data-matrix="${esc(c.slug)}" aria-hidden="true">${dotRow(c)}</span>
          </button>
        </li>`
        ).join('');

        list.innerHTML = `
        <li>
          <button class="chapter chapter--all" type="button" data-slug="${ALL}" aria-current="${currentSlug === ALL}">
            <span class="chapter__name">All problems</span>
            <span class="chapter__count" data-count="${ALL}">${String(TOTAL).padStart(2, '0')}</span>
          </button>
        </li>
        <li class="rail__div" aria-hidden="true"></li>
        ${chapters}`;
    }

    function syncRail() {
        const allEl = $(`[data-count="${ALL}"]`);
        if (allEl) {
            allEl.textContent = done.size
                ? `${done.size}/${TOTAL}`
                : String(TOTAL).padStart(2, '0');
        }
        const allBtn = $(`.chapter[data-slug="${ALL}"]`);
        if (allBtn) allBtn.setAttribute('aria-current', String(currentSlug === ALL));

        CURRICULUM.forEach((c) => {
            const btn = $(`.chapter[data-slug="${c.slug}"]`);
            if (btn) btn.setAttribute('aria-current', String(c.slug === currentSlug));

            const n = doneIn(c.slug);
            const el = $(`[data-count="${c.slug}"]`);
            if (el) el.textContent = n ? `${n}/${c.problems.length}` : String(c.problems.length).padStart(2, '0');

            c.problems.forEach((_, i) => {
                const dot = $(`[data-dot="${c.slug}:${i + 1}"]`);
                if (dot) dot.dataset.done = String(isDone(c.slug, i + 1));
            });
        });
    }

    /* ---------------------------------------------------------------------
       Chapter body
       --------------------------------------------------------------------- */

    /**
     * Escape before any interpolation into innerHTML. The curriculum is
     * first-party data today, but a stray apostrophe or angle bracket in a
     * problem name should render as text, never as markup.
     */
    function esc(s) {
        return String(s).replace(
            /[&<>"']/g,
            (c) =>
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                })[c]
        );
    }

    function rowHTML(slug, ordinal, name) {
        const done = isDone(slug, ordinal);
        return `
        <div role="listitem">
          <button class="row" type="button" data-slug="${esc(slug)}" data-ordinal="${ordinal}" data-done="${done}" aria-pressed="${done}">
            <span class="row__idx">${String(ordinal).padStart(2, '0')}</span>
            <span class="row__name">${esc(name)}</span>
            <span class="row__mark" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </span>
            <span class="u-sr">Mark as solved</span>
          </button>
        </div>`;
    }

    function renderChapter(slug, { scroll = true } = {}) {
        const isAll = slug === ALL;
        const chapter = isAll ? null : CURRICULUM.find((c) => c.slug === slug);
        if (!isAll && !chapter) return;

        currentSlug = slug;
        if (location.hash.slice(1) !== slug) {
            history.replaceState(null, '', isAll ? '#' : `#${slug}`);
        }

        // Header + counter
        if (isAll) {
            $('#chapter-title').textContent = 'All problems';
            $('#chapter-blurb').textContent =
                'Every chapter, in the order they build on each other. Click any row to mark it solved.';
            document.title = 'D for DSA';
            const pct = TOTAL ? Math.round((done.size / TOTAL) * 100) : 0;
            $('#progress-fill').style.setProperty('--pct', `${pct}%`);
            $('#progress-text').textContent = `${done.size}/${TOTAL}`;
        } else {
            $('#chapter-title').textContent = chapter.title;
            $('#chapter-blurb').textContent = chapter.blurb;
            document.title = `${chapter.title} · D for DSA`;
            const n = doneIn(slug);
            const pct = Math.round((n / chapter.problems.length) * 100);
            $('#progress-fill').style.setProperty('--pct', `${pct}%`);
            $('#progress-text').textContent = `${n}/${chapter.problems.length}`;
        }

        // Body
        const rows = $('#rows');
        if (isAll) {
            rows.innerHTML = CURRICULUM.map(
                (c) => `
        <div class="group" role="listitem">
          <div class="group__head">
            <h3 class="group__heading">
              <button class="group__name" type="button" data-slug="${esc(c.slug)}">
                ${esc(c.title)}
                <span class="group__count">${c.problems.length}</span>
              </button>
            </h3>
          </div>
          <div class="rows" role="list">${c.problems.map((n, i) => rowHTML(c.slug, i + 1, n)).join('')}</div>
        </div>`
            ).join('');
        } else {
            rows.innerHTML = chapter.problems
                .map((n, i) => rowHTML(slug, i + 1, n))
                .join('');
        }

        buildStrip();
        syncRail();

        if (scroll) {
            const top = $('#chapter-anchor');
            const y = top.getBoundingClientRect().top + window.scrollY - 72;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    /* ---------------------------------------------------------------------
       Chapter jump strip: horizontal-fill hover cards
       --------------------------------------------------------------------- */

    function buildStrip() {
        $('#strip-grid').innerHTML = CURRICULUM.map((c) => {
            const n = doneIn(c.slug);
            const pct = Math.round((n / c.problems.length) * 100);
            return `
        <button class="slice" type="button" data-slug="${esc(c.slug)}">
          <span class="slice__top">
            <span class="slice__name">${esc(c.title)}</span>
            <span class="slice__count">${n}/${c.problems.length}</span>
          </span>
          <span class="slice__bar"><i style="width:${pct}%"></i></span>
        </button>`;
        }).join('');
    }

    /* ---------------------------------------------------------------------
       Progress band: counter tween
       --------------------------------------------------------------------- */

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    function tween(el, from, to, ms = 900) {
        if (reduceMotion()) {
            el.textContent = to;
            return;
        }
        const start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / ms, 1);
            el.textContent = Math.round(from + (to - from) * easeOutExpo(p));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    function syncBand() {
        const n = done.size;
        const el = $('#band-done');
        const from = parseInt(el.textContent, 10) || 0;
        tween(el, from, n);
        $('#band-pct').textContent = TOTAL ? Math.round((n / TOTAL) * 100) : 0;
        $('#band-left').textContent = TOTAL - n;

        const meta = $('#topbar-progress');
        $('[data-count-done]', meta).textContent = n;
        $('[data-count-total]', meta).textContent = TOTAL;
        meta.dataset.active = String(n > 0);
    }

    /* ---------------------------------------------------------------------
       Command palette
       --------------------------------------------------------------------- */

    let hits = [];
    let active = 0;

    const paletteIndex = window.SEARCH_INDEX;

    function score(hit, q) {
        const name = hit.name.toLowerCase();
        const at = name.indexOf(q);
        if (at === 0) return 0;
        if (at > 0) return 1;
        if (hit.chapterTitle.toLowerCase().includes(q)) return 2;
        // Subsequence fallback: "bs" -> binary search.
        let i = 0;
        for (const ch of name) if (ch === q[i]) i++;
        return i === q.length ? 3 : -1;
    }

    function renderHits() {
        const list = $('#palette-list');
        const raw = $('#palette-input').value;
        if (!hits.length) {
            list.innerHTML = `<p class="palette__none">No match for &ldquo;${esc(raw)}&rdquo;.</p>`;
            return;
        }

        const q = raw.trim().toLowerCase();
        list.innerHTML = hits
            .slice(0, 40)
            .map((h, i) => {
                const name = esc(h.name);
                const at = q ? h.name.toLowerCase().indexOf(q) : -1;
                // Split on an already-escaped string, so <mark> stays the only
                // tag in the output and the query text cannot inject markup.
                const marked =
                    at >= 0
                        ? name.slice(0, at) +
                          '<mark>' +
                          name.slice(at, at + q.length) +
                          '</mark>' +
                          name.slice(at + q.length)
                        : name;
                return `
          <button class="hit" type="button" data-slug="${esc(h.chapterSlug)}" data-ordinal="${h.ordinal}" aria-selected="${i === active}">
            <span class="hit__name">${marked}</span>
            <span class="hit__where">${esc(h.chapterTitle)} · ${String(h.ordinal).padStart(2, '0')}</span>
          </button>`;
            })
            .join('');

        $('.hit[aria-selected="true"]', list)?.scrollIntoView({ block: 'nearest' });
    }

    function search() {
        const q = $('#palette-input').value.trim().toLowerCase();
        if (!q) {
            hits = paletteIndex.slice(0, 40);
        } else {
            hits = paletteIndex
                .map((h) => ({ h, s: score(h, q) }))
                .filter((x) => x.s >= 0)
                .sort((a, b) => a.s - b.s)
                .map((x) => x.h);
        }
        active = 0;
        renderHits();
    }

    function openPalette() {
        $('#scrim').dataset.open = 'true';
        document.body.style.overflow = 'hidden';
        const input = $('#palette-input');
        input.value = '';
        search();
        input.focus();
    }

    function closePalette() {
        $('#scrim').dataset.open = 'false';
        document.body.style.overflow = '';
    }

    const paletteOpen = () => $('#scrim').dataset.open === 'true';

    function goToHit(i) {
        const h = hits[i];
        if (!h) return;
        closePalette();
        renderChapter(h.chapterSlug);
        // Let the rows paint before hunting for the target.
        requestAnimationFrame(() => {
            const row = $(`.row[data-slug="${h.chapterSlug}"][data-ordinal="${h.ordinal}"]`);
            row?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            row?.focus({ preventScroll: true });
        });
    }

    /* ---------------------------------------------------------------------
       Mobile drawer
       --------------------------------------------------------------------- */

    function toggleRail(force) {
        const rail = $('#rail');
        const open = typeof force === 'boolean' ? force : rail.dataset.open !== 'true';
        rail.dataset.open = String(open);
        $('#menu-toggle').setAttribute('aria-expanded', String(open));
    }

    /* ---------------------------------------------------------------------
       Events
       --------------------------------------------------------------------- */

    function bind() {
        // Chapter navigation, delegated because the rail and strip both re-render.
        document.addEventListener('click', (e) => {
            const chapter = e.target.closest('.chapter, .slice, .group__name');
            if (chapter) {
                toggleRail(false);
                renderChapter(chapter.dataset.slug);
                return;
            }

            const row = e.target.closest('.row');
            if (row) {
                const { slug, ordinal } = row.dataset;
                const key = `${slug}:${ordinal}`;
                if (done.has(key)) done.delete(key);
                else done.add(key);
                row.dataset.done = String(done.has(key));
                save();
                syncRail();
                syncBand();
                refreshRowProgress();
                return;
            }

            const hit = e.target.closest('.hit');
            if (hit) {
                goToHit(
                    hits.findIndex(
                        (h) =>
                            h.chapterSlug === hit.dataset.slug &&
                            h.ordinal === Number(hit.dataset.ordinal)
                    )
                );
            }
        });

        $('#theme-toggle').addEventListener('click', toggleTheme);

        $('#menu-toggle').addEventListener('click', () => toggleRail());

        $('#reset-progress').addEventListener('click', () => {
            done = new Set();
            save();
            renderChapter(currentSlug, { scroll: false });
            syncBand();
        });

        $('#search-open').addEventListener('click', openPalette);
        $('#palette-input').addEventListener('input', search);

        $('#scrim').addEventListener('mousedown', (e) => {
            if (e.target === e.currentTarget) closePalette();
        });

        document.addEventListener('keydown', (e) => {
            // ⌘K / Ctrl+K / "/" opens search from anywhere.
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                paletteOpen() ? closePalette() : openPalette();
                return;
            }

            if (paletteOpen()) {
                if (e.key === 'Escape') {
                    closePalette();
                    return;
                }
                if (e.key === 'ArrowDown' || (e.key === 'n' && e.ctrlKey)) {
                    e.preventDefault();
                    active = Math.min(active + 1, Math.min(hits.length, 40) - 1);
                    renderHits();
                    return;
                }
                if (e.key === 'ArrowUp' || (e.key === 'p' && e.ctrlKey)) {
                    e.preventDefault();
                    active = Math.max(active - 1, 0);
                    renderHits();
                    return;
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    goToHit(active);
                    return;
                }
                if (e.key === 'Tab') {
                    e.preventDefault();
                    active =
                        (active + (e.shiftKey ? -1 : 1) + hits.length) % hits.length;
                    renderHits();
                }
                return;
            }

            if (e.target.matches('input, textarea')) return;

            // j / k walk the visible rows; Enter toggles.
            if (e.key === 'j' || e.key === 'k') {
                const rows = [...document.querySelectorAll('.row')];
                if (!rows.length) return;
                const i = rows.indexOf(document.activeElement);
                const next = e.key === 'j' ? i + 1 : i - 1;
                if (next < 0) rows[rows.length - 1].focus();
                else if (next >= rows.length) rows[0].focus();
                else rows[next].focus();
                e.preventDefault();
                return;
            }

            if (e.key === 'Enter' && document.activeElement.classList?.contains('row')) {
                document.activeElement.click();
            }
        });
    }

    /** Update the header counter without re-rendering the whole list. */
    function refreshRowProgress() {
        if (currentSlug === ALL) {
            const pct = TOTAL ? Math.round((done.size / TOTAL) * 100) : 0;
            $('#progress-fill').style.setProperty('--pct', `${pct}%`);
            $('#progress-text').textContent = `${done.size}/${TOTAL}`;
        } else {
            const chapter = CURRICULUM.find((c) => c.slug === currentSlug);
            const n = doneIn(currentSlug);
            const pct = Math.round((n / chapter.problems.length) * 100);
            $('#progress-fill').style.setProperty('--pct', `${pct}%`);
            $('#progress-text').textContent = `${n}/${chapter.problems.length}`;
        }
        buildStrip();
        syncRail();
    }

    /* ---------------------------------------------------------------------
       Reveal on scroll
       --------------------------------------------------------------------- */

    function initReveal() {
        const targets = document.querySelectorAll('[data-reveal]');
        if (!('IntersectionObserver' in window)) {
            targets.forEach((el) => el.removeAttribute('data-reveal'));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    el.style.setProperty('--d', `${Math.min(i * 60, 240)}ms`);
                    el.classList.add('reveal');
                    io.unobserve(el);
                });
            },
            { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
        );

        targets.forEach((el) => io.observe(el));
    }

    /* ---------------------------------------------------------------------
       Boot
       --------------------------------------------------------------------- */

    function init() {
        load();
        initTheme();
        buildRail();

        const fromHash = CURRICULUM.find((c) => c.slug === location.hash.slice(1));
        currentSlug = fromHash ? fromHash.slug : ALL;

        renderChapter(currentSlug, { scroll: false });
        $('#band-total').textContent = TOTAL;
        syncBand();
        bind();
        initReveal();

        window.addEventListener('hashchange', () => {
            const slug = location.hash.slice(1) || ALL;
            if ((slug === ALL || CURRICULUM.some((c) => c.slug === slug)) && slug !== currentSlug) {
                renderChapter(slug);
            }
        });
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();
