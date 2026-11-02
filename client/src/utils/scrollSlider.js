// Arrow buttons for the home page photo sliders.
// Desktop scrolls a fixed distance; mobile moves one photo and centres it.
export const scrollSlider = (slider, direction) => {
    if (!window.matchMedia("(max-width: 768px)").matches) {
        slider.scrollBy({ left: direction * 300, behavior: "smooth" });
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
