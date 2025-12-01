document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollToPlugin);

    const PAGES = ['hero-section', 'heritage-section', 'challenges-section', 'capacity-section'];
    let currentPageIndex = 0;
    const navNext = document.getElementById('nav-next'),
        navBack = document.getElementById('nav-back'),
        heroCta = document.getElementById('hero-cta'),
        backToTopCta = document.getElementById('back-to-top-cta');

    // Color Cycle Logic (maintains the animated colors)
    const colors = ['var(--bg-cycle-color-1)', 'var(--bg-cycle-color-2)', 'var(--bg-cycle-color-3)', 'var(--bg-cycle-color-4)', 'var(--bg-cycle-color-5)', 'var(--bg-cycle-color-6)'];

    function startColorCycle() {
        const tl = gsap.timeline({
            repeat: -1
        });
        colors.forEach(color => {
            tl.to(document.body, {
                duration: 1,
                onStart: () => {
                    document.body.style.backgroundColor = color;
                },
                delay: .1
            });
        });
    }
    startColorCycle();
    
    // Card Tilt Logic
    const handleCardTilt = e => {
        const targetCard = e.currentTarget,
            rect = targetCard.getBoundingClientRect(),
            centerX = rect.left + rect.width / 2,
            centerY = rect.top + rect.height / 2,
            sensitivity = 15;
        const rotateX = (e.clientY - centerY) / rect.height * -sensitivity,
            rotateY = (e.clientX - centerX) / rect.width * sensitivity;
        gsap.to(targetCard, {
            rotationX: rotateX,
            rotationY: rotateY,
            ease: "power1.out",
            duration: .8
        });
    };
    const resetCardTilt = e => {
        gsap.to(e.currentTarget, {
            rotationX: 0,
            rotationY: 0,
            ease: "power2.out",
            duration: .5
        });
    };
    function attachCardTiltEvents(selector) {
        document.querySelectorAll(selector).forEach(card => {
            card.addEventListener('mousemove', handleCardTilt);
            card.addEventListener('mouseleave', resetCardTilt);
        });
    }

    function updateNavigation() {
        navBack.disabled = currentPageIndex === 0;
        navNext.disabled = currentPageIndex === PAGES.length - 1;
        navNext.textContent = currentPageIndex === PAGES.length - 1 ? 'Finish' : 'Next Page';
        if (backToTopCta) {
            backToTopCta.style.display = currentPageIndex === PAGES.length - 1 ? 'inline-block' : 'none';
        }
    }

    function animateCrisisMeter(elementId, targetPercentage) {
        const meterRing = document.getElementById(elementId),
            angle = targetPercentage / 100 * 360;
        gsap.fromTo(meterRing, {
            background: `conic-gradient(var(--color-bronze) 0deg,var(--color-dark-amethyst) 0deg)`
        }, {
            duration: 2.5,
            ease: "power2.out",
            background: `conic-gradient(var(--color-bronze) ${angle}deg,var(--color-dark-amethyst) ${angle}deg)`
        });
    }

    function imageExplodeReassemble(imgElement) {
        const particles = [],
            numParticles = 20,
            parent = imgElement.parentNode;
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-effect';
            particle.style.position = 'absolute';
            particle.style.width = `${Math.random()*8+4}px`;
            particle.style.height = `${Math.random()*8+4}px`;
            particle.style.backgroundColor = 'var(--color-shimmer-gold)';
            particle.style.borderRadius = '50%';
            particle.style.zIndex = '100';
            gsap.set(particle, {
                opacity: 0,
                x: parent.offsetWidth / 2,
                y: parent.offsetHeight / 2
            });
            parent.appendChild(particle);
            particles.push(particle);
        }
        const tl = gsap.timeline({
            onStart: () => gsap.set(imgElement, {
                opacity: 0
            }),
            onComplete: () => {
                particles.forEach(p => p.remove());
                gsap.set(imgElement, {
                    opacity: 1
                });
            }
        });
        tl.to(particles, {
            opacity: 1,
            x: () => Math.random() * 300 - 150,
            y: () => Math.random() * 300 - 150,
            scale: 0,
            stagger: .05,
            duration: 1,
            ease: "power2.out"
        }).to(particles, {
            opacity: 0,
            duration: .5,
            ease: "power1.in",
            stagger: .03
        }, "+=.5");
    }

    function triggerPageAnimations(pageId) {
        gsap.killTweensOf('.capacity-grid .icon-accent');
        gsap.killTweensOf('.card-image-placeholder');
        gsap.killTweensOf('.data-point');
        gsap.killTweensOf('.main-title');
        gsap.killTweensOf('.handicraft-text');
        gsap.killTweensOf('.float-geometric');
        gsap.killTweensOf('.impact-glitch');
        gsap.killTweensOf('.hero-main-image-container');
        gsap.set('.impact-glitch', {
            animation: 'none',
            'text-shadow': 'none',
            transform: 'none'
        });
        if (pageId === 'hero-section') {
            gsap.to('.hero-image-overlay', {
                scale: 1.05,
                opacity: .2,
                filter: 'grayscale(0%) blur(2px)',
                duration: 15,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
            gsap.fromTo('.hero-main-image-container', {
                opacity: 0,
                y: 100
            }, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: .8
            });
            const geometricShapes = document.querySelectorAll('.float-geometric');
            gsap.set(geometricShapes, {
                opacity: 0,
                scale: 0,
                rotationZ: () => Math.random() * 360
            });
            gsap.to(geometricShapes, {
                opacity: .2,
                scale: 1,
                rotationZ: '+=360',
                x: () => Math.random() * (window.innerWidth / 3) - (window.innerWidth / 6),
                y: () => Math.random() * (window.innerHeight / 3) - (window.innerHeight / 6),
                duration: () => Math.random() * 10 + 5,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                stagger: .2,
                delay: .5
            });
            gsap.timeline({
                    delay: .3
                })
                .to('.main-title > span', {
                    opacity: 1,
                    transform: 'translateY(0) rotate(0)',
                    stagger: .04,
                    duration: .9,
                    ease: 'back.out(1.7)'
                })
                .to('.main-title', {
                    y: -10,
                    repeat: -1,
                    yoyo: true,
                    duration: 3,
                    ease: 'sine.inOut'
                }, "<")
                .to('.hero-subtitle,.cta-button', {
                    opacity: 1,
                    transform: 'translateY(0)',
                    stagger: .2,
                    duration: .7,
                    ease: 'power2.out'
                }, '-=.5')
                .fromTo('.handicraft-text span', {
                    opacity: 0,
                    y: 20,
                    rotationX: -90
                }, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    stagger: .05,
                    duration: .6,
                    ease: 'back.out(1.7)'
                }, "-=.2")
                .to('.handicraft-text', {
                    scale: 1.03,
                    repeat: -1,
                    yoyo: true,
                    duration: 2,
                    ease: 'sine.inOut'
                }, "<");
        } else if (pageId === 'heritage-section') {
            attachCardTiltEvents('#heritage-section .card');
            gsap.to('.heritage-grid .card', {
                opacity: 1,
                transform: 'translateY(0)',
                stagger: .15,
                duration: .8,
                ease: 'power3.out',
                delay: .5,
                onComplete: () => {
                    document.querySelectorAll('.card-image-placeholder').forEach((img, index) => {
                        gsap.delayedCall(index * .3, imageExplodeReassemble, [img]);
                    });
                }
            });
            gsap.fromTo('.card-image-placeholder', {
                scale: .5,
                rotationZ: 360,
                opacity: 0
            }, {
                scale: 1,
                rotationZ: 0,
                opacity: 1,
                duration: 1.5,
                ease: 'power3.out',
                stagger: .2,
                delay: .7,
                onComplete: () => {
                    gsap.to('.card-image-placeholder', {
                        scale: 1.05,
                        repeat: -1,
                        yoyo: true,
                        duration: 8,
                        ease: 'sine.inOut',
                        stagger: .5,
                        delay: 2
                    });
                }
            });
        } else if (pageId === 'challenges-section') {
            gsap.timeline({
                    delay: .5
                })
                .to('.challenge-box', {
                    opacity: 1,
                    transform: 'translateY(0)',
                    stagger: .15,
                    duration: .6
                })
                .to('.data-point', {
                    opacity: 1,
                    scale: 1,
                    stagger: .2,
                    duration: .8,
                    ease: 'back.out(1.7)'
                }, '-=.3')
                .to('.challenge-box i', {
                    scale: 1.1,
                    repeat: -1,
                    yoyo: true,
                    duration: 1.2,
                    ease: 'sine.inOut',
                    stagger: .3
                }, "<");
            animateCrisisMeter('income-meter', 73);
            document.querySelectorAll('#challenges-section .data-point').forEach((point, index) => {
                if (index !== 0) {
                    const numSpan = point.querySelector('.stat-number span');
                    const target = parseInt(numSpan.getAttribute('data-target'));
                    gsap.to(numSpan, {
                        innerText: target,
                        duration: 2.5,
                        ease: 'power2.inOut',
                        snap: {
                            innerText: 1
                        },
                        delay: 1.0
                    });
                }
            });
            gsap.to('#challenges-section .data-point', {
                x: i => i % 2 === 0 ? 10 : -10,
                y: i => i % 2 === 0 ? -15 : 15,
                repeat: -1,
                yoyo: true,
                duration: 5,
                ease: 'sine.inOut',
                stagger: .5,
                delay: 1.5
            });
        } else if (pageId === 'capacity-section') {
            attachCardTiltEvents('#capacity-section .card');
            gsap.to('.capacity-grid .card', {
                opacity: 1,
                transform: 'translateY(0)',
                stagger: .15,
                duration: .8,
                ease: 'power3.out',
                delay: .5,
                onComplete: () => {
                    gsap.to('.capacity-grid .icon-accent', {
                        scale: 1.05,
                        y: -3,
                        repeat: -1,
                        yoyo: true,
                        stagger: .2,
                        duration: 1.5,
                        ease: 'sine.inOut'
                    });
                }
            });
            gsap.to('.impact-glitch', {
                keyframes: [{
                    'text-shadow': '2px -2px 0 var(--color-bronze)',
                    x: -2,
                    y: 2,
                    duration: .1,
                    ease: 'none'
                }, {
                    'text-shadow': '-2px 2px 0 var(--color-shimmer-gold)',
                    x: -2,
                    y: -2,
                    duration: .1,
                    ease: 'none'
                }, {
                    'text-shadow': '2px 2px 0 var(--color-bronze)',
                    x: 2,
                    y: 2,
                    duration: .1,
                    ease: 'none'
                }, {
                    'text-shadow': '-2px -2px 0 var(--color-shimmer-gold)',
                    x: 2,
                    y: -2,
                    duration: .1,
                    ease: 'none'
                }, {
                    'text-shadow': '0 0 0 rgba(255,196,0,0)',
                    x: 0,
                    y: 0,
                    duration: .1,
                    ease: 'none'
                }, ],
                repeat: -1,
                repeatDelay: 2,
                ease: 'none',
                delay: 1.0
            });
        }
    }

    function goToPage(index, direction) {
        if (index < 0 || index >= PAGES.length || gsap.isTweening(document.querySelector('.page-container'))) return;
        const nextPage = document.getElementById(PAGES[index]),
            currentPage = document.getElementById(PAGES[currentPageIndex]);
        navNext.disabled = true;
        navBack.disabled = true;
        const tlTransition = gsap.timeline({
            onComplete: () => {
                currentPageIndex = index;
                updateNavigation();
                triggerPageAnimations(PAGES[currentPageIndex]);
            }
        });
        if (currentPage) {
            tlTransition.to(currentPage, {
                y: direction === 'next' ? '-100%' : '100%',
                opacity: 0,
                duration: 1.0,
                ease: 'power2.inOut',
                onStart: () => {
                    gsap.set(currentPage, {
                        zIndex: 20
                    });
                }
            });
        }
        tlTransition.fromTo(nextPage, {
            y: direction === 'next' ? '100%' : '-100%',
            opacity: 0,
            visibility: 'visible',
            zIndex: 10
        }, {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power2.inOut'
        }, .3);
        gsap.set(currentPage, {
            y: 0,
            zIndex: 0,
            delay: 1.5
        });
    }

    // Initialization
    gsap.set(`#${PAGES[0]}`, {
        opacity: 1,
        visibility: 'visible',
        zIndex: 10
    });
    triggerPageAnimations(PAGES[0]);
    updateNavigation();

    // Event Listeners
    navNext.addEventListener('click', () => {
        goToPage(currentPageIndex + 1, 'next');
    });
    navBack.addEventListener('click', () => {
        goToPage(currentPageIndex - 1, 'back');
    });
    heroCta.addEventListener('click', e => {
        e.preventDefault();
        goToPage(1, 'next');
    });
    if (backToTopCta) {
        backToTopCta.addEventListener('click', () => {
            goToPage(0, 'back');
        });
    }

    // Parallax Effect
    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice()) {
        const floatingElements = document.querySelectorAll('[data-lag]');
        const handleMouseMove = e => {
            const x = e.clientX - window.innerWidth / 2,
                y = e.clientY - window.innerHeight / 2;
            floatingElements.forEach(el => {
                const lag = el.getAttribute('data-lag');
                gsap.to(el, {
                    x: x * lag,
                    y: y * lag,
                    duration: .8,
                    ease: 'power3.out'
                });
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
    }
});