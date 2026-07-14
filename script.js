/* ========================================
   翊霖设计小屋 - 孟菲斯风格网站交互脚本（多页面版）
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const currentPage = body.getAttribute('data-page') || 'home';
    const isHome = currentPage === 'home';

    // ===== 网页入场动画（仅首页） =====
    if (isHome) {
        const splashEntry = document.getElementById('splashEntry');
        if (splashEntry) {
            // 入场动画期间隐藏页面滚动条
            document.body.classList.add('splash-active');

            const hideSplash = () => {
                splashEntry.classList.add('splash-hidden');
                document.body.classList.remove('splash-active');
            };

            const splashTimer = setTimeout(hideSplash, 6200);

            const splashHangingSign = document.getElementById('splashHangingSign');
            if (splashHangingSign) {
                splashHangingSign.addEventListener('click', () => {
                    clearTimeout(splashTimer);
                    hideSplash();
                });
            }
        }
    }

    // ===== 导航栏 =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 子页面导航栏始终显示背景
    if (!isHome) {
        navbar.classList.add('scrolled');
        // 子页面：目录栏默认收起，鼠标靠近顶部时唤出
        body.classList.add('subpage');

        let navHideTimer = null;
        const revealNav = () => body.classList.add('nav-reveal');
        const hideNav = () => body.classList.remove('nav-reveal');

        // 鼠标靠近顶部（含导航栏自身）时显示目录
        document.addEventListener('mousemove', (e) => {
            if (e.clientY < 60) {
                revealNav();
                clearTimeout(navHideTimer);
            } else if (e.clientY > 120) {
                // 离开顶部区域后延时收起
                clearTimeout(navHideTimer);
                navHideTimer = setTimeout(hideNav, 400);
            }
        });

        // 鼠标在导航栏上时不收起
        navbar.addEventListener('mouseenter', () => {
            revealNav();
            clearTimeout(navHideTimer);
        });
        navbar.addEventListener('mouseleave', () => {
            navHideTimer = setTimeout(hideNav, 400);
        });
    }

    // 首页滚动检测
    window.addEventListener('scroll', () => {
        if (isHome) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        updateBackToTop();
        updateEvTabs();
    });

    // 活动策划页标签高亮跟随滚动
    function updateEvTabs() {
        const tabs = document.querySelectorAll('.ev-tab');
        if (tabs.length === 0) return;

        const sections = document.querySelectorAll('.event-category[id]');
        const scrollPos = window.scrollY + 200;

        let activeId = '';
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                activeId = section.getAttribute('id');
            }
        });

        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (activeId && tab.getAttribute('href') === '#' + activeId) {
                tab.classList.add('active');
            }
        });
    }
    updateEvTabs();

    // 移动端菜单切换
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ===== 回到顶部按钮 =====
    const backToTop = document.getElementById('backToTop');

    function updateBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== 数字滚动动画（仅首页） =====
    if (isHome) {
        const statNumbers = document.querySelectorAll('.stat-number');

        function animateNumbers() {
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-count'));
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

                if (isVisible && !el.classList.contains('counted')) {
                    el.classList.add('counted');
                    let current = 0;
                    const duration = 2000;
                    const increment = target / (duration / 16);

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = Math.floor(current).toLocaleString() + (target > 100 ? '+' : '');
                    }, 16);

                    setTimeout(() => {
                        el.textContent = target.toLocaleString() + (target > 100 ? '+' : '');
                    }, duration + 50);
                }
            });
        }

        animateNumbers();
        window.addEventListener('scroll', animateNumbers);
    }

    // ===== AOS 滚动动画 =====
    const aosElements = document.querySelectorAll('[data-aos]');

    function initAOS() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.getAttribute('data-aos-delay') || 0;

                    setTimeout(() => {
                        el.classList.add('aos-animate');
                    }, parseInt(delay));

                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        aosElements.forEach(el => observer.observe(el));
    }

    initAOS();

    // ===== 卡片鼠标光效 =====
    const glowCards = document.querySelectorAll('.case-card, .pricing-card, .brandip-card, .photo-item');

    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    // ===== 定价切换（个人版/企业版 · 包月/包年） =====
    const pricingSwitch = document.getElementById('pricingSwitch');
    if (pricingSwitch) {
        const toggleMonthly = document.getElementById('toggleMonthly');
        const toggleYearly = document.getElementById('toggleYearly');
        const personalPrice = document.getElementById('personalPrice');
        const personalPeriod = document.getElementById('personalPeriod');
        const personalYearlyHint = document.getElementById('personalYearlyHint');
        const enterprisePrice = document.getElementById('enterprisePrice');
        const enterprisePeriod = document.getElementById('enterprisePeriod');
        const enterpriseYearlyHint = document.getElementById('enterpriseYearlyHint');

        pricingSwitch.addEventListener('change', () => {
            const isYearly = pricingSwitch.checked;

            toggleMonthly.classList.toggle('active', !isYearly);
            toggleYearly.classList.toggle('active', isYearly);

            if (isYearly) {
                // 包年价格
                personalPrice.textContent = '200';
                personalPeriod.textContent = '/年';
                personalYearlyHint.style.display = 'block';
                enterprisePrice.textContent = '2,000';
                enterprisePeriod.textContent = '/年';
                enterpriseYearlyHint.style.display = 'block';
            } else {
                // 包月价格
                personalPrice.textContent = '19.9';
                personalPeriod.textContent = '/月';
                personalYearlyHint.style.display = 'none';
                enterprisePrice.textContent = '199';
                enterprisePeriod.textContent = '/月';
                enterpriseYearlyHint.style.display = 'none';
            }
        });
    }

    // ===== 客户评价自动轮播（移动端） =====
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    if (testimonialTrack && testimonialCards.length > 0 && window.innerWidth <= 768) {
        let currentSlide = 0;
        const totalSlides = testimonialCards.length;

        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }, 4000);
    }

    // ===== 孟菲斯形状轻微视差（仅首页） =====
    if (isHome) {
        const hero = document.querySelector('.hero');
        if (hero) {
            const shapes = hero.querySelectorAll('.memphis-shape');
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                if (scrollY < window.innerHeight) {
                    shapes.forEach((shape, index) => {
                        const speed = 0.1 + (index * 0.03);
                        const y = scrollY * speed;
                        shape.style.transform = `translateY(${y}px) rotate(var(--rot))`;
                    });
                }
            });
        }
    }

    console.log('🎨 翊霖设计小屋 - 孟菲斯风格网站已就绪 [' + currentPage + ']');
});
