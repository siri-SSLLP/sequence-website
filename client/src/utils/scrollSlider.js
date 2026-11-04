// Arrow buttons for the home page photo sliders.
// Desktop scrolls a fixed distance, or a whole screenful of photos when
// `page` is set; mobile moves one photo and centres it.
export const scrollSlider = (slider, direction, { page = false } = {}) => {
    if (!window.matchMedia("(max-width: 768px)").matches) {
        let distance = 300;
        if (page && slider.children.length > 1) {
            // One step = card width + gap; a page is as many as fit on screen
            const step = slider.children[1].offsetLeft - slider.children[0].offsetLeft;
            distance = step * Math.max(1, Math.round(slider.clientWidth / step));
        }
        // Clamp to the ends: a smooth scroll that overshoots is dropped
        // when the slider uses scroll snapping
        const max = slider.scrollWidth - slider.clientWidth;
        const left = Math.min(Math.max(slider.scrollLeft + direction * distance, 0), max);
        slider.scrollTo({ left, behavior: "smooth" });
        return;
    }

    const cards = [...slider.children];
    if (cards.length === 0) return;

    const sliderRect = slider.getBoundingClientRect();
    const middle = sliderRect.left + sliderRect.width / 2;
    const offsets = cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return rect.left + rect.width / 2 - middle;
    });

    const current = offsets.reduce(
        (closest, offset, i) => (Math.abs(offset) < Math.abs(offsets[closest]) ? i : closest),
        0
    );
    const target = Math.min(Math.max(current + direction, 0), cards.length - 1);

    slider.scrollBy({ left: offsets[target], behavior: "smooth" });
};
