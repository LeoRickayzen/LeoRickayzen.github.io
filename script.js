const verbs = [
    'learning',
    'building',
    'coding',
    'designing',
    'running',
    'climbing',
    'reading',
    'eating',
    'listening',
    'talking',
    'analyzing',
    'solving'
];

let currentIndex = 0;
const textElement = document.getElementById('cycling-text');

function cycleText() {
    currentIndex = (currentIndex + 1) % verbs.length;
    textElement.textContent = verbs[currentIndex];
}

// Set initial text
textElement.textContent = verbs[0];

// Start cycling
setInterval(cycleText, 1500);
