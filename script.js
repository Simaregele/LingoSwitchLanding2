// JS из index.html
// ...весь JS из <script> блока будет вставлен сюда...
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });

    // FAQ Accordion
    const faqCards = document.querySelectorAll('.faq-accordion-card');
    faqCards.forEach(card => {
        const btn = card.querySelector('.faq-accordion-question');
        btn.addEventListener('click', () => {
            card.classList.toggle('open');
        });
    });

    // Fixed Navigation
    const fixedNav = document.getElementById('fixedNav');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Показываем меню при скролле вниз больше 200px
        if (scrollTop > 200) {
            fixedNav.classList.add('show');
        } else {
            fixedNav.classList.remove('show');
        }
        
        lastScrollTop = scrollTop;
    });
}); 