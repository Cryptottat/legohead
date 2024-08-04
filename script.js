var clickableImageContainer = document.getElementById('clickable-image-container');
const clickableImage = document.getElementById('clickable-image');
const dropZone = document.getElementById('drop-zone');
const clickText = document.getElementById('click-text');
let isImageClicked = false;
let customCursor = null;

var player;
var isPlayerReady = false;

// YouTube IFrame API 로드
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'MVlbP7BkJEU',
        playerVars: {
            'autoplay': 0,
            'controls': 0
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
    clickableImageContainer.style.display = 'block';
    clickableImage.addEventListener('click', handleClick);
}

function handleClick(e) {
    if (!isPlayerReady) return;

    isImageClicked = true;
    clickText.style.display = 'none';
    playAudio();
    createCustomCursor();
    document.addEventListener('mousemove', moveCustomCursor);
}

function playAudio() {
    if (isPlayerReady && player && typeof player.playVideo === 'function') {
        player.playVideo();
        player.setVolume(50);
    } else {
        console.log("Player is not ready yet");
    }
}

function createCustomCursor() {
    customCursor = document.createElement('img');
    customCursor.src = clickableImage.src;
    customCursor.style.position = 'fixed';
    customCursor.style.pointerEvents = 'none';
    customCursor.style.zIndex = '1000';
    customCursor.style.width = '50px';
    customCursor.style.height = '50px';
    document.body.appendChild(customCursor);

    clickableImage.style.visibility = 'hidden';
    document.body.style.cursor = 'none';
}

function moveCustomCursor(e) {
    if (customCursor) {
        customCursor.style.left = `${e.clientX - 25}px`;
        customCursor.style.top = `${e.clientY - 25}px`;
    }

    if (isImageClicked) {
        const rect = dropZone.getBoundingClientRect();
        if (e.clientX > rect.left && e.clientX < rect.right &&
            e.clientY > rect.top && e.clientY < rect.bottom) {
            dropImage(e);
        }
    }
}

function dropImage(e) {
    isImageClicked = false;
    document.body.style.cursor = 'default';
    
    if (customCursor) {
        document.body.removeChild(customCursor);
        customCursor = null;
    }
    
    const droppedImage = document.createElement('img');
    dropZone.src = 'transformed-image.png';
    droppedImage.src = 'transformed-image.png';
    droppedImage.style.position = 'absolute';
    droppedImage.style.left = `${e.clientX - dropZone.getBoundingClientRect().left}px`;
    droppedImage.style.top = `${e.clientY - dropZone.getBoundingClientRect().top}px`;
    droppedImage.style.width = '100px';
    droppedImage.style.height = '100px';
    
    dropZone.appendChild(droppedImage);
    
    document.removeEventListener('mousemove', moveCustomCursor);
    
    setTimeout(switchToSecondScreen, 2000);
}

function switchToSecondScreen() {
    document.getElementById('first-screen').style.display = 'none';
    const secondScreen = document.getElementById('second-screen');
    secondScreen.style.display = 'block';
    
    const backgroundContainer = document.getElementById('background-container');
    const backgroundImage = document.createElement('img');
    backgroundImage.src = 'background.png';
    backgroundContainer.appendChild(backgroundImage);

    const guideMessage = document.getElementById('guide-message');
    guideMessage.style.opacity = '1';
    
    setTimeout(() => {
        guideMessage.style.opacity = '0';
    }, 5000);

    clickableImage.removeEventListener('click', handleClick);
    document.removeEventListener('mousemove', moveCustomCursor);

    initializeMovingImage();
}

function initializeMovingImage() {
    const gameArea = document.getElementById('game-area');
    const movingImage = document.createElement('img');
    movingImage.id = 'moving-image';
    movingImage.src = 'idle-image.png';
    gameArea.appendChild(movingImage);
    
    let velocity = 0;
    let position = 0;
    const imagesRight = ['move1r.png', 'move2r.png', 'move3r.png'];
    const imagesLeft = ['move1l.png', 'move2l.png', 'move3l.png'];
    let sequenceIndex = 0;
    const sequence = [0, 1, 0, 2];
    
    const SPEED_MULTIPLIER = 2;
    const BASE_VELOCITY = 3;
    
    function updateImage() {
        if (velocity !== 0) {
            sequenceIndex = (sequenceIndex + 1) % sequence.length;
            let imageIndex = sequence[sequenceIndex];
            movingImage.src = velocity < 0 ? imagesLeft[imageIndex] : imagesRight[imageIndex];
        } else {
            movingImage.src = 'idle-image.png';
        }
        movingImage.style.transform = `translateX(${position}px)`;
    }
    
    function updatePosition() {
        position += velocity;
        const gameAreaWidth = gameArea.offsetWidth;
        const imageWidth = movingImage.offsetWidth;
        if (position < 0) {
            position = 0;
        } else if (position > gameAreaWidth - imageWidth) {
            position = gameAreaWidth - imageWidth;
        }
    }
    
    gameArea.addEventListener('mousemove', (e) => {
        const rect = gameArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        if (x > rect.width * 0.6) {
            velocity = BASE_VELOCITY * SPEED_MULTIPLIER;
        } else if (x < rect.width * 0.4) {
            velocity = -BASE_VELOCITY * SPEED_MULTIPLIER;
        } else {
            velocity = 0;
        }
    });
    
    function animate() {
        updatePosition();
        updateImage();
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function preloadImages() {
    const imageUrls = [
        'move1r.png', 'move2r.png', 'move3r.png', 
        'move1l.png', 'move2l.png', 'move3l.png', 
        'idle-image.png', 'transformed-image.png', 'background.png'
    ];
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

window.onload = preloadImages;