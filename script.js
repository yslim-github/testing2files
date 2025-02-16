// DOM 요소 선택
const cursor = document.querySelector('.cursor');
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.content-section');
const closeBtns = document.querySelectorAll('.close-btn');
const title = document.querySelector('.title');
const grid = document.querySelector('.grid');

// 전역 변수
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let activeSection = null;
let glitchInterval;
let perspective = 1000;

// 커서 이벤트
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 커서 애니메이션
function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
}

// 매트릭스 효과
function createMatrixEffect(section) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const lines = [];
    const fontSize = 14;
    const columns = Math.floor(section.offsetWidth / fontSize);
    
    for (let i = 0; i < columns; i++) {
        lines[i] = 0;
    }
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    
    section.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < lines.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, lines[i] * fontSize);
            
            if (lines[i] * fontSize > canvas.height && Math.random() > 0.975) {
                lines[i] = 0;
            }
            lines[i]++;
        }
    }
    
    return setInterval(draw, 50);
}

// 섹션 애니메이션
function playSectionAnimation(section) {
    const sectionId = section.id;
    
    section.style.transform = 'translateY(20px)';
    section.style.opacity = '0';
    
    switch(sectionId) {
        case 'enter-section':
            setTimeout(() => {
                section.style.transform = 'translateY(0)';
                section.style.opacity = '1';
                createMatrixEffect(section);
            }, 100);
            break;
            
        case 'about-section':
            let glitchCount = 0;
            const glitchInterval = setInterval(() => {
                section.style.transform = `translateY(0) translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
                section.style.opacity = Math.random() > 0.5 ? '1' : '0.8';
                glitchCount++;
                
                if (glitchCount > 10) {
                    clearInterval(glitchInterval);
                    section.style.transform = 'translateY(0)';
                    section.style.opacity = '1';
                }
            }, 50);
            break;
            
        case 'contact-section':
            section.style.transform = 'translateY(0)';
            section.style.opacity = '1';
            
            const paragraphs = section.querySelectorAll('p');
            paragraphs.forEach((p, index) => {
                const originalText = p.textContent;
                p.textContent = '';
                let charIndex = 0;
                
                setTimeout(() => {
                    const typeInterval = setInterval(() => {
                        if (charIndex < originalText.length) {
                            p.textContent += originalText[charIndex];
                            charIndex++;
                        } else {
                            clearInterval(typeInterval);
                        }
                    }, 50);
                }, index * 1000);
            });
            break;
    }
}

// 섹션 표시
function showSection(sectionId) {
    console.log('Showing section:', sectionId); // 디버깅용
    
    if (activeSection) {
        activeSection.classList.remove('active');
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        activeSection = section;
        playSectionAnimation(section);
    }
}

// 타이틀 글리치 효과
function createGlitchEffect() {
    const originalText = title.textContent;
    const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    
    let counter = 0;
    glitchInterval = setInterval(() => {
        counter++;
        
        if (counter % 10 === 0) {
            title.textContent = originalText;
            return;
        }
        
        const glitchedText = originalText.split('').map(char => {
            if (Math.random() < 0.1) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
        }).join('');
        
        title.textContent = glitchedText;
    }, 50);
}

// 이벤트 리스너 설정
function initializeEventListeners() {
    // 메뉴 아이템 이벤트
    menuItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = '#00ff00';
            cursor.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
        });
        
        item.addEventListener('mouseout', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = '#00ff00';
            cursor.style.backgroundColor = 'transparent';
        });
        
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section + '-section';
            showSection(sectionId);
        });
    });
    
    // 닫기 버튼 이벤트
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (activeSection) {
                activeSection.classList.remove('active');
                activeSection = null;
            }
        });
    });
    
    // 타이틀 이벤트
    title.addEventListener('mouseover', () => {
        createGlitchEffect();
    });
    
    title.addEventListener('mouseout', () => {
        clearInterval(glitchInterval);
        title.textContent = 'ANIMAGENT';
    });
    
    // 그리드 효과
    document.addEventListener('mousemove', (e) => {
        const rotateX = (e.clientY - window.innerHeight / 2) * 0.01;
        const rotateY = (e.clientX - window.innerWidth / 2) * 0.01;
        
        grid.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
}

// 초기화
function initialize() {
    animateCursor();
    initializeEventListeners();
}

// 실행
document.addEventListener('DOMContentLoaded', initialize); 