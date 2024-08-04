var clickableImageContainer = document.getElementById('clickable-image-container');
const clickableImage = document.getElementById('clickable-image');
const dropZone = document.getElementById('drop-zone');
// 추가: click 텍스트 요소 선택
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
    
    // 클릭 시 텍스트 숨기기
    clickText.style.display = 'none';
    
    // 오디오 재생
    playAudio();

    // 커스텀 커서 생성
    createCustomCursor();

    // 마우스 이동 이벤트 리스너 추가
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

    // 원본 이미지 숨기기
    clickableImage.style.visibility = 'hidden';

    // 마우스 기본 커서 숨기기
    document.body.style.cursor = 'none';
}

// function playAudio() {
//     if (isPlayerReady && player && typeof player.playVideo === 'function') {
//         player.playVideo();
//         player.setVolume(30);
//     } else {
//         console.log("Player is not ready yet");
//     }
// }


clickableImage.addEventListener('click', (e) => {
    isImageClicked = true;
    
    // 추가: 클릭 시 텍스트 숨기기
    clickText.style.display = 'none';

    // 오디오 재생
    playAudio();
    // 커스텀 커서 생성
    customCursor = document.createElement('img');
    customCursor.src = clickableImage.src;
    customCursor.style.position = 'fixed';
    customCursor.style.pointerEvents = 'none';
    customCursor.style.zIndex = '1000';
    customCursor.style.width = '50px'; // 커서 크기 조절
    customCursor.style.height = '50px';
    document.body.appendChild(customCursor);

    // 원본 이미지 숨기기
    clickableImage.style.visibility = 'hidden';

    // 마우스 기본 커서 숨기기
    document.body.style.cursor = 'none';

    // 마우스 이동 이벤트 리스너 추가
    document.addEventListener('mousemove', moveCustomCursor);
});

function moveCustomCursor(e) {
    if (customCursor) {
        customCursor.style.left = `${e.clientX - 25}px`; // 커서 중앙 정렬
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
    document.getElementById('second-screen').style.display = 'block';
    const secondScreen = document.getElementById('second-screen');
    secondScreen.style.display = 'block';
    
    // 배경 이미지 추가
    const backgroundContainer = document.getElementById('background-container');
    const backgroundImage = document.createElement('img');
    backgroundImage.src = 'background.png'; // 배경 이미지 경로를 지정하세요
    backgroundContainer.appendChild(backgroundImage);

    // 가이드 메시지 표시
    const guideMessage = document.getElementById('guide-message');
    guideMessage.style.opacity = '1';
    
    // 5초 후 가이드 메시지 숨기기
    setTimeout(() => {
        guideMessage.style.opacity = '0';
    }, 5000);

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
    const sequence = [0, 1, 0, 2]; // 1, 2, 1, 3 순서 (인덱스 기준)
    
    const SPEED_MULTIPLIER = 4; // 속도 배수
    const BASE_VELOCITY = 5;
    const ANIMATION_INTERVAL = 80; // 밀리초 단위 (더 작은 값 = 더 빠른 애니메이션)
    
    function updateImage() {
        if (velocity !== 0) {
            sequenceIndex = (sequenceIndex + 1) % sequence.length;
            let imageIndex = sequence[sequenceIndex];
            let imageSrc = velocity < 0 ? imagesLeft[imageIndex] : imagesRight[imageIndex];
            movingImage.style.backgroundImage = `url('${imageSrc}')`;
        } else {
            movingImage.style.backgroundImage = "url('idle-image.png')";
        }
        movingImage.style.transform = `translateX(${position}px)`;
    }
    
    function updatePosition() {
        position += velocity;
        // 게임 영역 경계 체크
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
    
    setInterval(() => {
        updatePosition();
        updateImage();
    }, ANIMATION_INTERVAL);
}


function preloadImages() {
    const imageUrls = ['move1r.png', 'move2r.png', 'move3r.png', 'move1l.png', 'move2l.png', 'move3l.png'];
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// 페이지 로드 시 실행
window.onload = preloadImages;