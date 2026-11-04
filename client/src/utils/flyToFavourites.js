// A heart that pops out of the clicked like button and flies along a curve
// into the navbar Favourites icon, which then bumps to show it landed.
// On phones the icon lives in the hamburger menu, so the heart flies there.

const isVisible = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
};

const findTarget = () =>
    [...document.querySelectorAll("[data-fav-target]")].find(isVisible) ||
    [...document.querySelectorAll("[data-fav-fallback]")].find(isVisible);

const bump = (el) => {
    el.classList.remove("fav-bump");
    void el.offsetWidth; // restart the animation on quick repeat clicks
    el.classList.add("fav-bump");
    el.addEventListener("animationend", () => el.classList.remove("fav-bump"), { once: true });
};

export const flyToFavourites = (fromEl) => {
    const target = findTarget();
    if (!fromEl || !target) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !document.body.animate) {
        bump(target);
        return;
    }

    const from = fromEl.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const size = 34;
    const startX = from.left + from.width / 2 - size / 2;
    const startY = from.top + from.height / 2 - size / 2;
    const dx = to.left + to.width / 2 - size / 2 - startX;
    const dy = to.top + to.height / 2 - size / 2 - startY;

    const heart = document.createElement("div");
    heart.className = "fav-fly-heart";
    heart.textContent = "♥";
    heart.setAttribute("aria-hidden", "true");
    Object.assign(heart.style, { left: `${startX}px`, top: `${startY}px`, width: `${size}px`, height: `${size}px` });
    document.body.appendChild(heart);

    // Pop: grow and rise a little above the button
    const popUp = -46;
    const keyframes = [
        { transform: "translate(0, 0) scale(0.6)", opacity: 0.4, offset: 0 },
        { transform: `translate(0, ${popUp}px) scale(1.5)`, opacity: 1, offset: 0.22 },
        { transform: `translate(0, ${popUp}px) scale(1.25)`, opacity: 1, offset: 0.32 },
    ];

    // Fly: a curve from the popped spot to the icon, arcing upward
    const steps = 14;
    const ctrlX = dx * 0.35;
    const ctrlY = Math.min(popUp, dy) - 120;
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const x = 2 * (1 - t) * t * ctrlX + t * t * dx;
        const y = (1 - t) * (1 - t) * popUp + 2 * (1 - t) * t * ctrlY + t * t * dy;
        const scale = 1.25 - 0.85 * t;
        keyframes.push({
            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            opacity: t < 0.85 ? 1 : 0.6,
            offset: 0.32 + 0.68 * t,
        });
    }

    const flight = heart.animate(keyframes, { duration: 1000, easing: "cubic-bezier(0.45, 0, 0.25, 1)" });
    const land = () => {
        heart.remove();
        bump(target);
    };
    flight.onfinish = land;
    flight.oncancel = land;
};
