/* =========================================================
   OnlineXpress — script.js
   ========================================================= */

// ── Scroll progress bar ──────────────────────────────────
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

// ── Mobile nav ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
        Object.assign(mainNav.style, {
            display: 'flex', position: 'absolute', top: '100%',
            left: '0', right: '0', flexDirection: 'column',
            background: '#FAFAF8', padding: '20px 24px',
            borderBottom: '1px solid #ECE9E3', gap: '16px',
        });
    } else {
        mainNav.removeAttribute('style');
    }
});
mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        mainNav.removeAttribute('style');
    });
});

// ── Grouped nav dropdowns (Platform / Company) ───────────
const navTriggers = document.querySelectorAll('.nav-trigger');

function closeAllNavDropdowns(exceptTrigger) {
    navTriggers.forEach(trigger => {
        if (trigger === exceptTrigger) return;
        trigger.setAttribute('aria-expanded', 'false');
        trigger.closest('.nav-item').classList.remove('is-open');
    });
}

navTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const navItem = trigger.closest('.nav-item');
        const isOpen = navItem.classList.contains('is-open');

        closeAllNavDropdowns(trigger);
        navItem.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) closeAllNavDropdowns();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllNavDropdowns();
});

// ── Scroll reveal ────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in-view');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.13 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated counters ────────────────────────────────────
function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const v = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        el.textContent = v.toLocaleString('en-IN') + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('en-IN') + suffix;
    };
    requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
    });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-num').forEach(c => counterObserver.observe(c));

// ── Header shadow + scroll progress + scroll-to-top ──────
const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scrollTop');
let docHeightCache = document.documentElement.scrollHeight - window.innerHeight;
const refreshDocHeight = () => { docHeightCache = document.documentElement.scrollHeight - window.innerHeight; };
window.addEventListener('resize', refreshDocHeight);
window.addEventListener('load', refreshDocHeight);

let headerTicking = false;
function updateHeaderChrome() {
    headerTicking = false;
    const scrolled = window.scrollY;
    header.classList.toggle('scrolled', scrolled > 20);
    progressBar.style.width = (scrolled / Math.max(docHeightCache, 1) * 100) + '%';
    scrollTopBtn.classList.toggle('show', scrolled > 600);
}
window.addEventListener('scroll', () => {
    if (!headerTicking) {
        headerTicking = true;
        requestAnimationFrame(updateHeaderChrome);
    }
}, { passive: true });
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Floating parcel particles in hero (kept light — restraint over spectacle) ──
const parcels = ['🚚', '✈️', '📦'];
const heroSection = document.querySelector('.hero');

function spawnParcel() {
    if (!heroSection) return;
    const el = document.createElement('div');
    el.className = 'parcel';
    el.textContent = parcels[Math.floor(Math.random() * parcels.length)];
    const duration = 6000 + Math.random() * 6000;
    const size = 14 + Math.random() * 12;
    el.style.cssText = `
    left: ${5 + Math.random() * 90}%;
    bottom: 60px;
    font-size: ${size}px;
    animation-duration: ${duration}ms;
    animation-delay: 0ms;
  `;
    heroSection.appendChild(el);
    setTimeout(() => el.remove(), duration + 200);
}
setInterval(spawnParcel, 1400);
for (let i = 0; i < 3; i++) setTimeout(spawnParcel, i * 400);

// ── Pulsing map pins in hero ──────────────────────────────
const pinPositions = [
    { top: '60%', left: '88%', yellow: false },
    { top: '72%', left: '6%', yellow: true },
];
pinPositions.forEach(({ top, left, yellow }, i) => {
    const pin = document.createElement('div');
    pin.className = 'map-pin' + (yellow ? ' pin-yellow' : '');
    Object.assign(pin.style, { top, left, position: 'absolute', animationDelay: `${i * 0.4}s` });
    heroSection && heroSection.appendChild(pin);
});

// ── Delivery truck in stats band ─────────────────────────
const statsBand = document.querySelector('.stats-band');
if (statsBand) {
    const lane = document.createElement('div');
    lane.className = 'truck-lane';
    lane.innerHTML = '<div class="truck-road"></div><div class="truck-icon">🚚</div>';
    statsBand.querySelector('.container').appendChild(lane);
}

// ── AWB ticker in hero track panel (only runs if that panel exists) ──
const trackId = document.querySelector('.track-id');
if (trackId) {
    const prefix = 'AWB · OX';
    const randomAWB = () => prefix + Math.floor(1000000000 + Math.random() * 9000000000);
    setInterval(() => {
        trackId.style.opacity = '0';
        setTimeout(() => {
            trackId.textContent = randomAWB();
            trackId.style.transition = 'opacity .4s';
            trackId.style.opacity = '1';
        }, 300);
    }, 3200);
}

// ── Button ripple effect ──────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const ripple = document.createElement('span');
        ripple.className = 'ripple-circle';
        Object.assign(ripple.style, {
            width: size + 'px', height: size + 'px',
            left: (e.clientX - rect.left - size / 2) + 'px',
            top: (e.clientY - rect.top - size / 2) + 'px',
            position: 'absolute',
        });
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ── 3D tilt + cursor spotlight on cards ──────────────────
// Combines the existing tilt with a spotlight glow (CSS reads --mx/--my)
// so hover feels like one cohesive light source, not two competing effects.
const TILT_CARDS = '.pricing-card, .testimonial-card';
document.querySelectorAll(TILT_CARDS).forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
        card.style.transition = 'transform .1s ease';
        card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
        card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
    });
});

// ── Solutions scroll-stack: continuous scroll-linked stacking ───
// All cards share ONE sticky container (.stack-sticky). We compute a
// single continuous progress value (0 → N-1) across the whole
// .solutions-stack scroll distance. Each card gets its own "slot" of
// that range, split into three phases so it actually pops into place
// and STAYS put long enough to read before the next one arrives:
//   1. rise    — slides up from below into full view
//   2. hold    — sits still at full size, fully readable (HOLD share
//                of the slot — this is the part that was too short
//                before, so the card felt like it never settled)
//   3. recede  — as the next card starts rising, this one shrinks
//                back and settles into a fixed "peek" band behind it
// Because every card lives in the same sticky box, there's no dead
// zone between cards — the incoming card is always physically
// overlapping the one it's covering.
(() => {
    const stack = document.querySelector('.solutions-stack');
    if (!stack) return;
    const cards = Array.from(stack.querySelectorAll('.stack-card'));
    const n = cards.length;
    if (!n) return;

    const HOLD = 0.01;        // share of each card's slot spent fully still & readable
    const PEEK = 26;          // px offset per index once a card has settled behind
    const MAX_SHRINK = 0.05;  // settled cards scale down slightly (1 → 0.95)
    const MAX_DIM = 0.14;     // settled cards dim slightly (brightness 1 → 0.86)

    // Smoothstep: zero velocity at t=0 and t=1. Used so a transition
    // starts/ends at the SAME (zero) rate of change as the hold phase
    // it's connecting to — no sudden jump in speed at the boundary.
    // That velocity discontinuity (hold = 0 speed -> transition = full
    // speed, instantly) is what reads as "friction"/a catch-up scroll.
    const ease = t => t * t * (3 - 2 * t);

    const mq = window.matchMedia('(max-width: 860px)');
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    let ticking = false;

    // Cache the section's document-relative top offset and scrollable
    // range up front (a layout read), rather than calling
    // getBoundingClientRect() on every scroll frame. Reading layout
    // geometry every frame is risky on a page with other continuous DOM
    // mutations happening elsewhere (e.g. the hero's floating parcels
    // being appended/removed on an interval) — any pending mutation can
    // force a full synchronous layout recalc right when we ask for
    // geometry, which is a classic cause of scroll jank. Scroll position
    // itself (window.scrollY) is cheap and doesn't force layout, so once
    // we know where the section sits, every frame after that is layout-free.
    let stackTop = 0;
    let total = 0;
    function measure() {
        const rect = stack.getBoundingClientRect();
        stackTop = rect.top + window.scrollY;
        total = rect.height - window.innerHeight;
    }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);

    function update() {
        ticking = false;
        if (mq.matches) return; // mobile: plain static stack, CSS handles it
        if (total <= 0) return;

        const scrolled = clamp(window.scrollY - stackTop, 0, total);
        const progress = scrolled / total;      // 0 → 1 across the whole section
        const pos = progress * (n - 1);          // 0 → n-1 "playhead" in card units

        cards.forEach((card, i) => {
            const isLast = i === n - 1;
            const enterStart = i - 1 + HOLD;
            const enterEnd = i;
            const recedeStart = i + HOLD;
            const recedeEnd = i + 1;

            let y, scale, dim;

            if (pos <= enterStart) {
                // Hasn't arrived yet — parked below, out of view.
                y = '100%';
                scale = 1;
                dim = 1;
            } else if (pos < enterEnd) {
                // Rising into place. Eased so it leaves the "parked below"
                // state at zero speed (matches the stillness before it)
                // and arrives at full-view also at zero speed (matches
                // the hold state right after) — no jarring speed-up/stop.
                const t = ease((pos - enterStart) / (enterEnd - enterStart));
                y = `${(1 - t) * 100}%`;
                scale = 1;
                dim = 1;
            } else if (pos <= recedeStart || isLast) {
                // Holding — fully in view and fully readable. The last
                // card never recedes (nothing comes after it).
                y = '0px';
                scale = 1;
                dim = 1;
            } else if (pos < recedeEnd) {
                // Receding as the next card rises over it. Same eased
                // curve for the same reason — smooth hand-off out of hold.
                const t = ease((pos - recedeStart) / (recedeEnd - recedeStart));
                y = `${t * (i * PEEK)}px`;
                scale = 1 - t * MAX_SHRINK;
                dim = 1 - t * MAX_DIM;
            } else {
                // Settled permanently into its peek slot.
                y = `${i * PEEK}px`;
                scale = 1 - MAX_SHRINK;
                dim = 1 - MAX_DIM;
            }

            card.style.setProperty('--stack-y', y);
            card.style.setProperty('--stack-scale', scale.toFixed(4));
            card.style.setProperty('--stack-dim', dim.toFixed(4));
            card.classList.toggle('is-current', pos > enterStart && pos <= recedeStart);
        });
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (mq.addEventListener) mq.addEventListener('change', update);
    update();
})();


// ── Spotlight-only (no tilt) for integration pills ───────
document.querySelectorAll('.int-pill').forEach(pill => {
    pill.addEventListener('mousemove', e => {
        const r = pill.getBoundingClientRect();
        pill.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        pill.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
});

// ── Courier pills staggered entrance ─────────────────────
const pillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.courier-pill').forEach((pill, i) => {
                pill.style.animationDelay = `${i * 0.06}s`;
                pill.classList.add('visible');
            });
            pillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
const courierGrid = document.querySelector('.courier-grid');
if (courierGrid) pillObserver.observe(courierGrid);

// ── Magnetic hover on primary CTA buttons ────────────────
document.querySelectorAll('.btn-primary, .btn-lg').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1)';
    });
});

// ── Hero visual: subtle pointer-parallax tilt (desktop only) ─────────────
const heroImgWrap = document.querySelector('.hero-img-wrap');
if (heroImgWrap && window.matchMedia('(min-width: 1024px)').matches) {
    const heroInner = document.querySelector('.hero-inner');
    heroInner && heroInner.addEventListener('mousemove', e => {
        const r = heroInner.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        heroImgWrap.style.setProperty('--rx', `${x * 6}deg`);
        heroImgWrap.style.setProperty('--ry', `${-y * 6}deg`);
    });
    heroInner && heroInner.addEventListener('mouseleave', () => {
        heroImgWrap.style.setProperty('--rx', `0deg`);
        heroImgWrap.style.setProperty('--ry', `0deg`);
    });
}

// ── AWB badge under hero visual tracking card (only if panel exists) ─────
const trackPanel = document.querySelector('.track-panel');
if (trackPanel) {
    const badge = document.createElement('div');
    badge.className = 'awb-badge';
    badge.innerHTML = 'Live tracking &nbsp;<span>●</span>&nbsp; OX7741209384';
    trackPanel.style.position = 'relative';
    trackPanel.appendChild(badge);
}

// ── Contact form submit ──────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const statusEl = document.getElementById('formStatus');
    const submitBtn = contactForm.querySelector('.contact-submit');
    const submitLabel = contactForm.querySelector('.contact-submit-label');
    const originalLabel = submitLabel ? submitLabel.textContent : 'Send Message';

    const nameField = document.getElementById('cf-name');
    const emailField = document.getElementById('cf-email');
    const mobileField = document.getElementById('cf-mobile');
    const messageField = document.getElementById('cf-message');

    const setStatus = (text, kind) => {
        statusEl.textContent = text;
        statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            mobile: mobileField.value.trim(),
            message: messageField.value.trim(),
        };

        if (!payload.name || !payload.email || !payload.mobile || !payload.message) {
            setStatus('Please fill in all fields.', 'error');
            return;
        }

        submitBtn.disabled = true;
        if (submitLabel) submitLabel.textContent = 'Sending…';
        setStatus('');

        try {
            const res = await fetch('https://onlinexpress.co.in/php/contactMail.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Request failed with status ' + res.status);

            setStatus("Thanks! We'll get back to you within a business day.", 'success');
            contactForm.reset();
        } catch (err) {
            setStatus('Something went wrong. Please try again or email sales@onlinexpress.co.in directly.', 'error');
        } finally {
            submitBtn.disabled = false;
            if (submitLabel) submitLabel.textContent = originalLabel;
        }
    });
}

// ── Track page: tab switching + live results ─────────────
const trackForm = document.getElementById('trackForm');
if (trackForm) {

    // ── OnlineXpress Core API (tracking) ─────────────────
    // SECURITY NOTE: TRACK_API_ADMIN_BEARER is a long-lived admin
    // credential. Keeping it in client-side JS means anyone who opens
    // dev tools can read it and mint their own tokens against the
    // core.onlinexpress.co.in API. This was a deliberate call to ship
    // fast; move token minting behind a small server-side (PHP) proxy
    // before this goes to production.
    const TRACK_API_COMPANY_ID = 1;
    const TRACK_API_BASE = 'https://core.onlinexpress.co.in/api/b2c';
    const TRACK_API_ADMIN_BEARER = '3016|GEhADJbmWvT5SU2LFircz4lPzb3nCeSoBcZwq8Yh1262df0d';

    // Cached short-lived access token, minted on demand and reused
    // until a request comes back 401.
    let trackAccessToken = null;

    const getTrackAccessToken = async (forceRefresh = false) => {
        // if (trackAccessToken && !forceRefresh) return trackAccessToken;

        // const res = await fetch(
        //     `${TRACK_API_BASE}/tokens/create?company_id=${TRACK_API_COMPANY_ID}`,
        //     {
        //         method: 'POST',
        //         headers: {
        //             'Accept': 'application/json, text/plain, */*',
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${TRACK_API_ADMIN_BEARER}`,
        //         },
        //         body: JSON.stringify({ token_name: 'admin', user_id: 1 }),
        //     }
        // );

        // if (!res.ok) throw new Error('Could not create tracking access token (status ' + res.status + ')');

        // const data = await res.json();
        // // Response shape wasn't confirmed — this covers the common
        // // variants. Adjust the field name here if the real API differs.
        // trackAccessToken = data.token || data.access_token
        //     || (data.data && (data.data.token || data.data.access_token));

        // if (!trackAccessToken) throw new Error('Token response did not contain a recognizable token field');
        return trackAccessToken;
    };

    const fetchTrackingByNumber = async (trackingNo) => {
        const callTrack = (token) => fetch(
            `${TRACK_API_BASE}/track/${encodeURIComponent(trackingNo)}?company_id=${TRACK_API_COMPANY_ID}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        let token = await getTrackAccessToken();
        let res = await callTrack(token);

        // Token may have expired between page load and this lookup —
        // mint a fresh one and retry exactly once.
        if (res.status === 401) {
            token = await getTrackAccessToken(true);
            res = await callTrack(token);
        }

        if (res.status === 404) return null; // no shipment for this number
        if (!res.ok) throw new Error('Tracking request failed with status ' + res.status);

        const json = await res.json();
        // Unwrap a { data: {...} } envelope if the API uses one.
        return json && json.data ? json.data : json;
    };

    // Caches the last-looked-up shipment(s) by docket number so
    // "View Details" can read shipment_histories without a second call.
    const trackShipmentCache = new Map();

    const trackInput = document.getElementById('trackInput');
    const trackStatus = document.getElementById('trackStatus');
    const trackTabs = document.querySelectorAll('.track-tab');
    const trackSubmitBtn = trackForm.querySelector('.btn-primary');
    const trackSubmitLabel = trackForm.querySelector('.track-submit-label');
    const trackSubmitOriginal = trackSubmitLabel ? trackSubmitLabel.textContent : 'Track Now';

    const resultWrap = document.getElementById('trackResultWrap');
    const resultTableHost = document.getElementById('trackResultTable');
    const downloadBtn = document.getElementById('trackDownloadBtn');

    const historyModal = document.getElementById('trackHistoryModal');
    const historyContent = document.getElementById('trackHistoryContent');
    const historyClose = document.getElementById('trackHistoryClose');

    const placeholders = {
        awb: 'Enter AWB number(s), separated by spaces',
        order: 'Enter Order ID(s), separated by spaces',
        mobile: 'Enter registered mobile number(s), separated by spaces',
    };

    trackTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            trackTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const mode = tab.dataset.mode;
            trackInput.placeholder = placeholders[mode] || '';
            trackInput.type = mode === 'mobile' ? 'tel' : 'text';
            trackInput.value = '';
            trackStatus.textContent = '';
            trackStatus.className = 'form-status';
        });
    });

    const setStatus = (text, kind) => {
        trackStatus.textContent = text;
        trackStatus.className = 'form-status' + (kind ? ' ' + kind : '');
    };

    const openHistoryModal = () => historyModal.classList.add('open');
    const closeHistoryModal = () => historyModal.classList.remove('open');
    historyClose && historyClose.addEventListener('click', closeHistoryModal);
    historyModal && historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) closeHistoryModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeHistoryModal();
    });

    const escapeHtml = (str) => String(str ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));

    // "Delhi_delhi" -> "Delhi, Delhi"
    const formatCity = (city) => {
        if (!city) return '—';
        return city.split('_')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(', ');
    };

    // Builds the results row straight from the JSON tracking response —
    // same table shape/classes the page used to get from the PHP backend.
    const buildResultsTable = (shipments, queriedValues) => {
        const table = document.createElement('table');
        table.className = 'result-table';
        table.id = 'resultTable';

        const rows = shipments.map((shipment, i) => {
            const queriedValue = queriedValues[i] || '—';

            if (!shipment) {
                return `
                <tr>
                    <td data-label="Consignment No.">${escapeHtml(queriedValue)}</td>
                    <td data-label="Order ID">—</td>
                    <td data-label="Vendor AWB">—</td>
                    <td data-label="Origin">—</td>
                    <td data-label="Destination">—</td>
                    <td data-label="Consignee">—</td>
                    <td data-label="Status">NOT FOUND</td>
                    <td data-label="Pickup Date">—</td>
                    <td data-label="Delivery Date">—</td>
                </tr>
            `;
            }

            const docket = shipment.docket_number || shipment.vendor_tracking_no || queriedValue;
            trackShipmentCache.set(docket, shipment);

            return `
            <tr>
                <td data-label="Consignment No.">${escapeHtml(docket)}</td>
                <td data-label="Order ID">${escapeHtml(shipment.order_id) || '—'}</td>
                <td data-label="Vendor AWB">${escapeHtml(shipment.vendor_tracking_no) || '—'}</td>
                <td data-label="Origin">${escapeHtml(formatCity(shipment.origin_city))}</td>
                <td data-label="Destination">${escapeHtml(formatCity(shipment.destination_city))}</td>
                <td data-label="Consignee">${escapeHtml(shipment.receiver) || '—'}</td>
                <td data-label="Status">
                    ${escapeHtml((shipment.status_description || '').toUpperCase()) || '—'}<br>
                    <a href="#modal-${escapeHtml(docket)}" class="detail-link" data-docket="${escapeHtml(docket)}">View Details</a>
                </td>
                <td data-label="Pickup Date">${escapeHtml(shipment.pickup_date) || '—'}</td>
                <td data-label="Delivery Date">${escapeHtml(shipment.delivery_date) || '—'}</td>
            </tr>
        `;
        }).join('');

        table.innerHTML = `
        <thead>
            <tr>
                <th>Consignment No.</th>
                <th>Order ID</th>
                <th>Vendor AWB</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Consignee</th>
                <th>Status</th>
                <th>Pickup Date</th>
                <th>Delivery Date</th>
            </tr>
        </thead>
        <tbody>${rows}</tbody>
    `;
        return table;
    };

    // Renders shipment_histories in the same Date/Time/Location/Status
    // shape the modal used to show.
    const buildHistoryTable = (histories) => {
        if (!histories || !histories.length) {
            return '<p>No tracking history available yet.</p>';
        }

        const rows = histories.map(h => `
            <tr>
                <td data-label="Date">${escapeHtml(h.formatted_run_date) || '—'}</td>
                <td data-label="Time">${escapeHtml(h.run_time) || '—'}</td>
                <td data-label="Location">${escapeHtml(h.location) || '—'}</td>
                <td data-label="Status">${escapeHtml(h.status_description || h.vendor_status || '—')}</td>
            </tr>
        `).join('');

        return `
            <h4>Tracking Details</h4>
            <table class="style1">
                <thead>
                    <tr>
                        <th class="tal">Date</th>
                        <th class="tal">Time</th>
                        <th class="tal">Location</th>
                        <th class="tal">Status</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    };

    // Delegated click handler for "View Details" links inside the injected table
    resultTableHost && resultTableHost.addEventListener('click', (e) => {
        const link = e.target.closest('.detail-link');
        if (!link) return;
        e.preventDefault();

        const docket = link.dataset.docket;
        const shipment = trackShipmentCache.get(docket);

        historyContent.innerHTML = shipment
            ? buildHistoryTable(shipment.shipment_histories)
            : '<p>Could not load tracking history. Please try again.</p>';

        openHistoryModal();
    });

    // "Download Excel" — reads whatever's currently rendered in the results
    // table (works for one row or many, including NOT FOUND rows) and
    // exports it client-side as a real .xlsx via SheetJS. No server round-trip.
    downloadBtn && downloadBtn.addEventListener('click', () => {
        const table = resultTableHost.querySelector('table');
        if (!table) return;

        if (typeof XLSX === 'undefined') {
            setStatus('Could not load the Excel export library. Please refresh and try again.', 'error');
            return;
        }

        // Pull header row + body rows straight from the DOM as-rendered,
        // so the export always matches what the user is looking at.
        const headerCells = Array.from(table.querySelectorAll('thead th'))
            .map(th => th.textContent.trim());

        const bodyRows = Array.from(table.querySelectorAll('tbody tr')).map(tr =>
            Array.from(tr.querySelectorAll('td')).map(td => {
                // Strip the "View Details" link text out of the Status cell,
                // keep only the status text itself.
                const clone = td.cloneNode(true);
                clone.querySelectorAll('a').forEach(a => a.remove());
                return clone.textContent.replace(/\s+/g, ' ').trim();
            })
        );

        const aoa = [headerCells, ...bodyRows];
        const worksheet = XLSX.utils.aoa_to_sheet(aoa);

        // Reasonable column widths so it's readable on open, not auto-fit
        // to a single squished column.
        worksheet['!cols'] = headerCells.map((_, colIdx) => {
            const maxLen = aoa.reduce((max, row) => {
                const cell = row[colIdx] ? String(row[colIdx]).length : 0;
                return Math.max(max, cell);
            }, headerCells[colIdx].length);
            return { wch: Math.min(Math.max(maxLen + 2, 12), 40) };
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tracking Results');

        const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
        XLSX.writeFile(workbook, `OnlineXpress-Tracking-Results-${stamp}.xlsx`);
    });

    const renderResults = (shipments, queriedValues) => {
        resultTableHost.innerHTML = '';

        const list = Array.isArray(shipments) ? shipments : [shipments];
        const found = list.filter(Boolean);

        if (!found.length) {
            resultTableHost.innerHTML =
                '<div class="track-result-empty">No shipment found for the number(s) entered. Double-check them and try again.</div>';
            resultWrap.hidden = false;
            return;
        }

        resultTableHost.appendChild(buildResultsTable(list, queriedValues));
        resultWrap.hidden = false;

        const headerEl = document.getElementById('header');
        const headerOffset = (headerEl ? headerEl.offsetHeight : 80) + 20;
        const targetTop = resultWrap.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    };

    trackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const raw = trackInput.value.trim();

        if (!raw) {
            setStatus('Please enter a value to track your shipment.', 'error');
            return;
        }

        // Space-separated → multiple lookups, same API call per value
        const values = [...new Set(raw.split(/\s+/).filter(Boolean))];

        trackSubmitBtn.disabled = true;
        if (trackSubmitLabel) trackSubmitLabel.textContent = 'Tracking…';
        setStatus('');
        resultWrap.hidden = true;

        try {
            const shipments = await Promise.all(
                values.map(v => fetchTrackingByNumber(v).catch(() => null))
            );
            renderResults(shipments, values);
            setStatus('');
        } catch (err) {
            setStatus('Something went wrong while tracking your shipment. Please try again in a moment.', 'error');
        } finally {
            trackSubmitBtn.disabled = false;
            if (trackSubmitLabel) trackSubmitLabel.textContent = trackSubmitOriginal;
        }
    });
}
/* ============================================================
   FAQ — accordion, category filter, live search
   ============================================================ */
(() => {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;

    const searchInput = document.getElementById('faqSearch');
    const tabs = Array.from(document.querySelectorAll('.faq-tab'));
    const items = Array.from(faqList.querySelectorAll('.faq-item'));
    const emptyState = document.getElementById('faqEmpty');

    let activeCat = 'all';

    const applyFilters = () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        items.forEach(item => {
            const inCategory = activeCat === 'all' || item.dataset.cat === activeCat;
            const matchesQuery = !query || item.textContent.toLowerCase().includes(query);
            const show = query ? matchesQuery : inCategory;

            item.hidden = !show;
            if (show) visibleCount += 1;
        });

        if (emptyState) emptyState.hidden = visibleCount !== 0;
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('is-active')) return;

            tabs.forEach(t => {
                t.classList.remove('is-active');
                t.setAttribute('aria-pressed', 'false');
            });
            tab.classList.add('is-active');
            tab.setAttribute('aria-pressed', 'true');
            activeCat = tab.dataset.cat;

            if (searchInput && searchInput.value) searchInput.value = '';
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    items.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            items.forEach(other => {
                other.classList.remove('is-open');
                const btn = other.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('is-open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    applyFilters();
})();

(function (w, d, s, c, r, a, m) {
    w['KiwiObject'] = r;
    w[r] = w[r] || function () {
        (w[r].q = w[r].q || []).push(arguments)
    };
    w[r].l = 1 * new Date();
    a = d.createElement(s);
    m = d.getElementsByTagName(s)[0];
    a.async = 1;
    a.src = c;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', "https://app.interakt.ai/kiwi-sdk/kiwi-sdk-17-prod-min.js?v=" + new Date().getTime(), 'kiwi');
window.addEventListener("load", function () {
    kiwi.init('', 'JtiJa2AjH0gPhTBIAm9cfTUpUqV1bR4K', {});
});
