// --- LIGHTWEIGHT BACKGROUND DROPS ON SCROLL ---
let dropTriggered = false;
const triggeredSections = new Set();

function triggerBackgroundDrops() {
	if (dropTriggered) return;
	dropTriggered = true;

	const bgLayer = document.querySelector(".bg-drip-layer");
	if (bgLayer) {
		bgLayer.style.opacity = "0.6";
		bgLayer.style.transition = "opacity 0.8s ease";
	}
}

function checkSectionDrops() {
	const sections = document.querySelectorAll(".section-drops");
	const windowHeight = window.innerHeight;

	sections.forEach((sectionDrop) => {
		const sectionName = sectionDrop.getAttribute("data-section");
		const rect = sectionDrop.getBoundingClientRect();

		// Trigger when section enters viewport
		if (rect.top < windowHeight * 0.75 && rect.bottom > 0) {
			if (!triggeredSections.has(sectionName)) {
				sectionDrop.classList.add("active");
				triggeredSections.add(sectionName);
			}
		}
	});
}

// Initial check on page load
window.addEventListener("load", () => {
	setTimeout(checkSectionDrops, 500);
	setTimeout(checkTextVisibility, 500);
});

// --- TEXT VISIBILITY ON SCROLL ---
function checkTextVisibility() {
	const sections = document.querySelectorAll("section");
	const windowHeight = window.innerHeight;

	sections.forEach((section) => {
		const rect = section.getBoundingClientRect();

		// Make text visible when section is in viewport
		if (rect.top < windowHeight * 0.75 && rect.bottom > windowHeight * 0.25) {
			section.classList.add("text-visible");

			// Trigger stat counting animation for about section
			if (
				section.id === "about" &&
				!section.classList.contains("stats-counted")
			) {
				section.classList.add("stats-counted");
				animateStatNumbers();
			}
		}
	});
}

// --- STAT COUNTER ANIMATION ---
function animateStatNumbers() {
	const statNumbers = document.querySelectorAll(".stat-number");

	statNumbers.forEach((stat) => {
		const text = stat.textContent;
		const hasPlus = text.includes("+");
		const targetValue = parseInt(text.replace("+", ""));

		if (isNaN(targetValue)) return;

		let currentValue = 0;
		const duration = 2000; // 2 seconds
		const increment = targetValue / (duration / 16); // 60fps
		const startTime = performance.now();

		function updateCounter(currentTime) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Easing function for smooth animation
			const easeOutQuad = progress * (2 - progress);
			currentValue = Math.floor(easeOutQuad * targetValue);

			stat.textContent = currentValue + (hasPlus ? "+" : "");

			if (progress < 1) {
				requestAnimationFrame(updateCounter);
			} else {
				stat.textContent = targetValue + (hasPlus ? "+" : "");
			}
		}

		requestAnimationFrame(updateCounter);
	});
}

// Add text visibility check to scroll listener
const originalScrollHandler = window.addEventListener(
	"scroll",
	() => {
		if (window.pageYOffset > window.innerHeight * 0.3) {
			triggerBackgroundDrops();
		}
		checkSectionDrops();
		checkTextVisibility();
	},
	{ passive: true }
);

// --- LOADING SCREEN LOGIC WITH TYPEWRITER ---
window.addEventListener("load", () => {
	const loadingScreen = document.getElementById("loading-screen");
	const loadingText = document.getElementById("loading-text");

	const greetings = ["Hello", "Moi", "नमस्ते"];
	let currentIndex = 0;
	let charIndex = 0;
	let isPaused = false;

	function typeWriter() {
		const currentWord = greetings[currentIndex];

		if (isPaused) {
			setTimeout(typeWriter, 1000);
			isPaused = false;
			return;
		}

		if (charIndex <= currentWord.length) {
			// Typing
			loadingText.textContent = currentWord.substring(0, charIndex);
			charIndex++;

			if (charIndex > currentWord.length) {
				// Word complete
				if (currentIndex === greetings.length - 1) {
					// Last word - fade out after pause
					setTimeout(() => {
						loadingText.classList.add("fade-out");
						loadingScreen.classList.add("fade-out");

						setTimeout(() => {
							document.body.classList.remove("loading");
							document.body.classList.add("loading-complete");
							if (loadingScreen) {
								loadingScreen.style.display = "none";
								loadingScreen.removeAttribute("aria-hidden");
							}
						}, 600);
					}, 1200);
					return;
				} else {
					// Not last word - add space and move to next
					loadingText.textContent += " ";
					isPaused = true;
					currentIndex++;
					charIndex = 0;
				}
			}
			setTimeout(typeWriter, 120);
		}
	}

	// Start typewriter effect
	loadingText.textContent = "";
	typeWriter();
});

document.addEventListener("DOMContentLoaded", () => {
	// Set current year
	const currentYearElement = document.getElementById("current-year");
	if (currentYearElement) {
		currentYearElement.textContent = new Date().getFullYear();
	}

	// Smooth scroll for anchor links
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			const href = this.getAttribute("href");
			if (href !== "#" && href.startsWith("#")) {
				e.preventDefault();
				const targetId = href.substring(1);
				const targetElement = document.getElementById(targetId);
				if (targetElement) {
					const targetPosition = targetElement.offsetTop;
					window.scrollTo({
						top: targetPosition,
						behavior: "smooth",
					});
				}
			}
		});
	});

	// External links and email/phone links (ensure they work properly)
	document
		.querySelectorAll('a[href^="http"], a[href^="mailto:"], a[href^="tel:"]')
		.forEach((link) => {
			// These will work naturally without preventDefault
			link.addEventListener("click", function (e) {
				// Allow default behavior for external links, mailto, and tel
				// No preventDefault - let browser handle it
			});
		});

	// Section scroll tracking for active nav indicator
	const sections = document.querySelectorAll("section[id]");
	const navLinks = document.querySelectorAll(".nav-link");

	const updateActiveNav = () => {
		let current = "";

		sections.forEach((section) => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.clientHeight;

			if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
				current = section.getAttribute("id");
			}
		});

		navLinks.forEach((link) => {
			link.classList.remove("active");
			if (link.getAttribute("href") === `#${current}`) {
				link.classList.add("active");
			}
		});
	};

	window.addEventListener("scroll", updateActiveNav);
	updateActiveNav(); // Initial call

	// Scroll direction tracking for background drips
	let lastScrollY = window.pageYOffset;
	window.addEventListener("scroll", () => {
		const currentY = window.pageYOffset;
		if (currentY < lastScrollY) {
			document.body.classList.add("scrolling-up");
		} else {
			document.body.classList.remove("scrolling-up");
		}
		lastScrollY = currentY <= 0 ? 0 : currentY;
	});

	// Scroll-triggered animations with Intersection Observer for better performance
	const observerOptions = {
		threshold: 0.1,
		rootMargin: "0px 0px -50px 0px",
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				setTimeout(() => {
					entry.target.classList.add("animated");
				}, 50);
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Observe all animated elements
	const animateElements = document.querySelectorAll(
		"[data-animate], .section-title, .works-available, .contact-social"
	);
	animateElements.forEach((el) => {
		observer.observe(el);
	});

	// Also observe contact social separately
	const contactSocial = document.querySelector(".contact-social");
	if (contactSocial) {
		observer.observe(contactSocial);
	}

	// Add hover effect to service tags for better interactivity
	const serviceTags = document.querySelectorAll(".service-tag");
	serviceTags.forEach((tag) => {
		tag.addEventListener("mouseenter", function () {
			serviceTags.forEach((t) => {
				if (t !== this) {
					t.style.opacity = "0.6";
				}
			});
		});
		tag.addEventListener("mouseleave", function () {
			serviceTags.forEach((t) => {
				t.style.opacity = "1";
			});
		});
	});

	// Fallback for older browsers
	const animateOnScroll = () => {
		const elements = document.querySelectorAll("[data-animate]");
		const sectionTitles = document.querySelectorAll(".section-title");
		const windowHeight = window.innerHeight;
		const allElements = [...elements, ...sectionTitles];

		allElements.forEach((element) => {
			if (element.classList.contains("animated")) return;

			const elementTop = element.getBoundingClientRect().top;
			const elementVisible = windowHeight * 0.2;

			if (elementTop < windowHeight - elementVisible) {
				element.classList.add("animated");
			}
		});
	};

	// Initial check and fallback scroll listener
	if (!window.IntersectionObserver) {
		animateOnScroll();
		let ticking = false;
		window.addEventListener("scroll", () => {
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
