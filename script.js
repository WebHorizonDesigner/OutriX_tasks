document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const viewProjectsBtn = document.getElementById('viewProjectsBtn');
    const letsTalkBtn = document.getElementById('letsTalkBtn');

    const navToggle = document.querySelector('.nav-toggle');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const desktopLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    function setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          
                desktopLinks.forEach(link => link.classList.remove('active'));
                mobileLinks.forEach(link => link.classList.remove('active'));

                const activeDesktopLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                const activeMobileLink = document.querySelector(`.mobile-link[href="#${sectionId}"]`);
                
                if (activeDesktopLink) activeDesktopLink.classList.add('active');
                if (activeMobileLink) activeMobileLink.classList.add('active');
            }
        });
    }

    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    }

    [...desktopLinks, ...mobileLinks].forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    window.addEventListener('scroll', setActiveLink);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
        
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.dataset.filter;

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener('click', () => {
            const projectSection = document.getElementById('project_section');
            if (projectSection) {
                window.scrollTo({
                    top: projectSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    }

    if (letsTalkBtn) {
        letsTalkBtn.addEventListener('click', () => {
            const contactSection = document.getElementById('contact_section');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset(); 
        });
    }
});
const messageBtn = document.getElementById('messageBtn');

if (scheduleBtn) {
    scheduleBtn.addEventListener('click', () => {
        alert('Redirecting to scheduling page...');
    });
}

if (messageBtn) {
    messageBtn.addEventListener('click', () => {
        alert('Opening your default mail client...');
        window.location.href = 'mailto:contact@example.com?subject=Let%27s%20Connect';
    });
}
