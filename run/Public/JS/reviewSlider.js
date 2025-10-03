const slider = document.getElementById('slider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        slider.style.transform = `translateX(-${currentIndex * 320}px)`;
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < slider.children.length - 1) {
        currentIndex++;
        slider.style.transform = `translateX(-${currentIndex * 320}px)`;
    }
});