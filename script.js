// Enhanced CV/Resume Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initSmoothScrolling();
    initCardAnimations();
    initSkillInteractions();
    initEthereumWatermark();
    initTypingAnimation();
    initCollapsibleCards();
    initCipherEffects();
    
    console.log('🚀 CV loaded with Ethereum vibes');
});

// Initialize collapsible cards
function initCollapsibleCards() {
    const cards = document.querySelectorAll('.collapsible-card');
    
    cards.forEach(card => {
        const toggleBtn = card.querySelector('.toggle-card-btn');
        const content = card.querySelector('.card-content');
        
        // Set initial state (collapsed)
        card.classList.add('collapsed');
        
        // Set initial height to 0
        if (content) {
            content.style.maxHeight = '0';
        }
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleCardContent(card);
            });
        }
    });
}

// Toggle card content visibility
function toggleCardContent(card) {
    const content = card.querySelector('.card-content');
    const toggleIcon = card.querySelector('.toggle-card-icon');
    
    if (card.classList.contains('collapsed')) {
        // Expand
        card.classList.remove('collapsed');
        card.classList.add('expanded');
        if (toggleIcon) toggleIcon.textContent = '-';
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
            setTimeout(() => {
                content.style.maxHeight = 'none';
            }, 300);
        }
    } else {
        // Collapse
        card.classList.remove('expanded');
        card.classList.add('collapsed');
        if (toggleIcon) toggleIcon.textContent = '+';
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
            setTimeout(() => {
                content.style.maxHeight = '0';
            }, 10);
        }
    }
}

// Add cipher-inspired visual effects
function initCipherEffects() {
    // Random binary/hex code effect for section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    
    sectionTitles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            const originalText = this.textContent;
            let iterations = 0;
            
            const interval = setInterval(() => {
                this.textContent = originalText.split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return ['0', '1', 'A', 'F', '7', 'E', '9'][Math.floor(Math.random() * 7)];
                    })
                    .join('');
                
                if (iterations >= originalText.length) {
                    clearInterval(interval);
                    this.textContent = originalText;
                }
                
                iterations += 1 / 3;
            }, 30);
        });
    });
    
    // Add subtle glow effect to cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 15px rgba(0, 246, 255, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// Smooth scrolling for internal links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced card hover animations with stagger effect
function initCardAnimations() {
    const cards = document.querySelectorAll('.card');
    
    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Interactive skill items with enhanced effects
function initSkillInteractions() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
            this.style.boxShadow = '0 4px 12px rgba(0, 246, 255, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Add click effect for mobile
        item.addEventListener('click', function() {
            this.style.background = 'rgba(0, 246, 255, 0.1)';
            setTimeout(() => {
                this.style.background = 'rgba(98, 126, 234, 0.1)';
            }, 200);
        });
    });
}

// Enhanced Ethereum watermark with particle effect
function initEthereumWatermark() {
    const watermark = document.querySelector('.eth-watermark');
    
    // Add subtle rotation on scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const rotation = (scrollY * 0.1) % 360;
        watermark.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
        lastScrollY = scrollY;
    }, { passive: true });
    
    // Create particle effect around watermark
    createParticleEffect();
}

// Particle effect for enhanced visual appeal
function createParticleEffect() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particleContainer);
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        createParticle(particleContainer, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 3 + 1;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 20 + 10;
    const delay = index * 0.5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(0, 246, 255, 0.2);
        border-radius: 50%;
        left: ${startX}px;
        top: 100vh;
        animation: floatUp ${duration}s linear infinite;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatUp {
        from {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Typing animation for the title
function initTypingAnimation() {
    const titleElement = document.querySelector('.title');
    const originalText = titleElement.textContent;
    titleElement.textContent = '';
    
    let index = 0;
    const typingSpeed = 100;
    
    function typeText() {
        if (index < originalText.length) {
            titleElement.textContent += originalText.charAt(index);
            index++;
            setTimeout(typeText, typingSpeed);
        }
    }
    
    // Start typing animation after a short delay
    setTimeout(typeText, 1000);
}

// Enhanced social link interactions
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.textShadow = '0 2px 8px rgba(0, 246, 255, 0.3)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.textShadow = 'none';
    });
});