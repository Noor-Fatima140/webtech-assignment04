// Default Markdown sample as requested
const defaultMarkdown = `# This is Slide 01
## This is Heading 02 in slide 01
This is your content on slide 01
---
# This is Slide 02
## This is Heading 02 in slide 02
This is your content on slide 02`;

// DOM Selectors
const markdownInput = document.getElementById('markdownInput');
const slideContent = document.getElementById('slideContent');
const slideDisplayArea = document.getElementById('slideDisplayArea');
const slidePreviewContainer = document.getElementById('slidePreviewContainer');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const fullScreenBtn = document.getElementById('fullScreenBtn');
const fullScreenIcon = document.getElementById('fullScreenIcon');
const fullScreenText = document.getElementById('fullScreenText');
const currentSlideNum = document.getElementById('currentSlideNum');
const totalSlidesNum = document.getElementById('totalSlidesNum');
const saveBtn = document.getElementById('saveBtn');
const saveStatus = document.getElementById('saveStatus');

let slides = [];
let currentSlideIndex = 0;

// Load saved slides from LocalStorage
function loadSavedSlides() {
    const savedData = localStorage.getItem('markdown_slides_data');
    if (savedData) {
        markdownInput.value = savedData;
    } else {
        markdownInput.value = defaultMarkdown;
    }
    parseSlides();
}

// Parse markdown into slides using '---'
function parseSlides() {
    const rawText = markdownInput.value;
    slides = rawText.split(/^---$/m).map(slide => slide.trim());
    
    if (slides.length === 0 || (slides.length === 1 && slides[0] === '')) {
        slides = ['# Blank Slide'];
    }

    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = slides.length - 1;
    }
    if (currentSlideIndex < 0) {
        currentSlideIndex = 0;
    }

    renderCurrentSlide();
}

// Render active slide & toggle button states
function renderCurrentSlide() {
    // Format: {current slide number} / {total number of slides}
    currentSlideNum.textContent = currentSlideIndex + 1;
    totalSlidesNum.textContent = slides.length;

    // Render HTML from markdown
    const slideMd = slides[currentSlideIndex] || '';
    slideContent.innerHTML = marked.parse(slideMd);

    // Button states
    leftBtn.disabled = (currentSlideIndex === 0);
    rightBtn.disabled = (currentSlideIndex === slides.length - 1);
}

// Slide Navigation
function goToNextSlide() {
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        renderCurrentSlide();
    }
}

function goToPrevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderCurrentSlide();
    }
}

// Save to Browser Local Storage
function saveSlidesToStorage() {
    localStorage.setItem('markdown_slides_data', markdownInput.value);
    saveStatus.classList.remove('hidden');
    setTimeout(() => {
        saveStatus.classList.add('hidden');
    }, 2000);
}

// Fullscreen Presentation Mode Toggle
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (slidePreviewContainer.requestFullscreen) {
            slidePreviewContainer.requestFullscreen();
        } else if (slidePreviewContainer.webkitRequestFullscreen) {
            slidePreviewContainer.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const isFullscreen = !!document.fullscreenElement;
    if (isFullscreen) {
        fullScreenText.textContent = 'Exit Full Screen';
        fullScreenIcon.className = 'fa-solid fa-compress';
        slideDisplayArea.classList.add('presentation-fullscreen');
    } else {
        fullScreenText.textContent = 'Full Screen';
        fullScreenIcon.className = 'fa-solid fa-expand';
        slideDisplayArea.classList.remove('presentation-fullscreen');
    }
}

// Event Listeners
markdownInput.addEventListener('input', parseSlides);
leftBtn.addEventListener('click', goToPrevSlide);
rightBtn.addEventListener('click', goToNextSlide);
fullScreenBtn.addEventListener('click', toggleFullScreen);
saveBtn.addEventListener('click', saveSlidesToStorage);

// Keyboard Shortcuts (Left, Right, F11, Ctrl+S)
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        saveSlidesToStorage();
        return;
    }

    const isEditing = (document.activeElement === markdownInput);

    if (event.key === 'ArrowRight') {
        if (!isEditing || event.ctrlKey) {
            event.preventDefault();
            goToNextSlide();
        }
    } else if (event.key === 'ArrowLeft') {
        if (!isEditing || event.ctrlKey) {
            event.preventDefault();
            goToPrevSlide();
        }
    } else if (event.key === 'F11') {
        event.preventDefault();
        toggleFullScreen();
    }
});

// App Initialization
window.addEventListener('DOMContentLoaded', loadSavedSlides);