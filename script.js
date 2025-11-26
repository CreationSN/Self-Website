

  // --- LOADING SCREEN LOGIC ---
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingText = document.getElementById('loading-text');
  
  const greetings = ['Hello', 'Moi', 'नमस्ते'];
  let currentIndex = 0;
  
  // Set initial text
  loadingText.textContent = greetings[0];
  
  // Show each greeting once, no looping
  const cycleInterval = setInterval(() => {
    if (currentIndex >= greetings.length - 1) {
      // All greetings shown, fade out
      clearInterval(cycleInterval);
      
      setTimeout(() => {
        loadingText.classList.add('fade-out');
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
          document.body.classList.remove('loading');
          document.body.classList.add('loading-complete');
          if (loadingScreen) {
            loadingScreen.style.display = 'none';
            loadingScreen.removeAttribute('aria-hidden');
          }
        }, 400);
      }, 800);
      
      return;
    }
    
    // Fade out current text
    loadingText.classList.add('fade-out');
    
    setTimeout(() => {
      currentIndex++;
      loadingText.textContent = greetings[currentIndex];
      loadingText.classList.remove('fade-out');
    }, 300);
  }, 1000); // Show each greeting for 1 second
});

document.addEventListener('DOMContentLoaded', () => {
  
    // Set current year
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const targetPosition = targetElement.offsetTop;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // External links and email/phone links (ensure they work properly)
  document.querySelectorAll('a[href^="http"], a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
    // These will work naturally without preventDefault
    link.addEventListener('click', function(e) {
      // Allow default behavior for external links, mailto, and tel
      // No preventDefault - let browser handle it
    });
  });

  // Section scroll tracking for active nav indicator
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const updateActiveNav = () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // Initial call

  // Scroll direction tracking for background drips
  let lastScrollY = window.pageYOffset;
  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset;
    if (currentY < lastScrollY) {
      document.body.classList.add('scrolling-up');
    } else {
      document.body.classList.remove('scrolling-up');
    }
    lastScrollY = currentY <= 0 ? 0 : currentY;
  });

  // Scroll-triggered animations with Intersection Observer for better performance
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, 50);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const animateElements = document.querySelectorAll('[data-animate], .section-title, .works-available, .contact-social');
  animateElements.forEach(el => {
    observer.observe(el);
  });
  
  // Also observe contact social separately
  const contactSocial = document.querySelector('.contact-social');
  if (contactSocial) {
    observer.observe(contactSocial);
  }

  // Add hover effect to service tags for better interactivity
  const serviceTags = document.querySelectorAll('.service-tag');
  serviceTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      serviceTags.forEach(t => {
        if (t !== this) {
          t.style.opacity = '0.6';
        }
      });
    });
    tag.addEventListener('mouseleave', function() {
      serviceTags.forEach(t => {
        t.style.opacity = '1';
      });
    });
  });

  // Fallback for older browsers
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-animate]');
    const sectionTitles = document.querySelectorAll('.section-title');
    const windowHeight = window.innerHeight;
    const allElements = [...elements, ...sectionTitles];
    
    allElements.forEach((element) => {
      if (element.classList.contains('animated')) return;
      
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = windowHeight * 0.2;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('animated');
      }
    });
  };

  // Initial check and fallback scroll listener
  if (!window.IntersectionObserver) {
    animateOnScroll();
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          animateOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
});
