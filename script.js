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

	// --- PROJECT FILTER FUNCTIONALITY ---
	const filterBtns = document.querySelectorAll(".filter-btn");
	const projectSections = document.querySelectorAll(".projects-section");

	filterBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			const filterValue = btn.getAttribute("data-filter");

			// Update active button
			filterBtns.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");

			// Show/hide projects
			projectSections.forEach((section) => {
				const sectionFilter = section.getAttribute("data-filter");

				if (filterValue === "all" || sectionFilter === filterValue) {
					section.classList.remove("hidden");
					setTimeout(() => {
						section.style.opacity = "1";
						section.style.transform = "translateY(0)";
					}, 10);
				} else {
					section.style.opacity = "0";
					section.style.transform = "translateY(20px)";
					setTimeout(() => {
						section.classList.add("hidden");
					}, 400);
				}
			});
		});
	});

	// --- MOUSE TRACKING SPOTLIGHT EFFECT ON PROJECT CARDS ---
	const projectCards = document.querySelectorAll(".project-card");

	projectCards.forEach((card) => {
		card.addEventListener("mousemove", (e) => {
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// Convert to percentage for CSS custom properties
			const xPercent = (x / rect.width) * 100;
			const yPercent = (y / rect.height) * 100;

			// Update CSS custom properties for the radial gradient
			card.style.setProperty("--mouse-x", xPercent + "%");
			card.style.setProperty("--mouse-y", yPercent + "%");
		});

		card.addEventListener("mouseleave", () => {
			// Reset to center on mouse leave
			card.style.setProperty("--mouse-x", "50%");
			card.style.setProperty("--mouse-y", "50%");
		});
	});

	// --- CUSTOM CURSOR TRACKING WITH PEN TOOL EFFECT ---
	const cursor = document.createElement("div");
	cursor.classList.add("custom-cursor");
	document.body.appendChild(cursor);

	let mouseX = 0;
	let mouseY = 0;
	let cursorX = 0;
	let cursorY = 0;
	let isHoveringInteractive = false;

	document.addEventListener("mousemove", (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;

		// Smooth cursor follow with easing
		cursorX += (mouseX - cursorX) * 0.25;
		cursorY += (mouseY - cursorY) * 0.25;

		cursor.style.left = cursorX + "px";
		cursor.style.top = cursorY + "px";

		// Enhanced glow effect for pen tool
		if (isHoveringInteractive) {
			cursor.style.boxShadow = `0 0 30px rgba(255, 43, 47, 0.8), 0 0 60px rgba(255, 43, 47, 0.4), inset 0 0 15px rgba(255, 43, 47, 0.2)`;
		} else {
			cursor.style.boxShadow = `0 0 20px rgba(255, 43, 47, 0.5), 0 0 40px rgba(255, 43, 47, 0.2)`;
		}
	});

	document.addEventListener("mouseenter", () => {
		cursor.style.opacity = "1";
	});

	document.addEventListener("mouseleave", () => {
		cursor.style.opacity = "0";
	});

	// Enhance glow on interactive elements
	const interactiveElements = document.querySelectorAll(
		"button, a, .project-card, .experience-item, .skill-tag"
	);

	interactiveElements.forEach((el) => {
		el.addEventListener("mouseenter", () => {
			isHoveringInteractive = true;
			cursor.style.transform =
				"translate(-12px, -12px) scale(1.2)";
		});

		el.addEventListener("mouseleave", () => {
			isHoveringInteractive = false;
			cursor.style.transform =
				"translate(-12px, -12px) scale(1)";
		});
	});

	// --- ANIMATED SKILL BARS ---
	function animateSkillBars() {
		const skillTags = document.querySelectorAll(".skill-tag");
		const windowHeight = window.innerHeight;

		skillTags.forEach((tag, index) => {
			const rect = tag.getBoundingClientRect();
			if (rect.top < windowHeight) {
				setTimeout(() => {
					tag.style.opacity = "1";
					tag.style.transform = "translateX(0)";
				}, index * 50);
			}
		});
	}

	// Observe skill bars for animation
	const skillObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					animateSkillBars();
					skillObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.1 }
	);

	const skillGroup = document.querySelector(".skill-matrix");
	if (skillGroup) {
		skillObserver.observe(skillGroup);
	}

	// --- INTERACTIVE EXPERIENCE TIMELINE ---
	const experienceItems = document.querySelectorAll(".experience-item");

	experienceItems.forEach((item) => {
		item.addEventListener("mouseenter", function () {
			experienceItems.forEach((i) => {
				if (i !== this) {
					i.style.opacity = "0.4";
				}
			});
		});

		item.addEventListener("mouseleave", function () {
			experienceItems.forEach((i) => {
				i.style.opacity = "1";
			});
		});

		// Click to expand experience details with smooth animation
		item.addEventListener("click", function () {
			const isExpanded = this.classList.contains("expanded");
			experienceItems.forEach((i) => i.classList.remove("expanded"));
			if (!isExpanded) {
				this.classList.add("expanded");
			}
		});
	});

	// --- PARALLAX EFFECT ON SCROLL ---
	function applyParallax() {
		const parallaxElements = document.querySelectorAll("[data-parallax]");

		window.addEventListener(
			"scroll",
			() => {
				parallaxElements.forEach((el) => {
					const scrollPosition = window.pageYOffset;
					const elementOffset = el.offsetTop;
					const distance = scrollPosition - elementOffset;
					const yPos = distance * 0.5;

					el.style.transform = `translateY(${yPos}px)`;
				});
			},
			{ passive: true }
		);
	}

	applyParallax();

	// --- 3D CARD TILT EFFECT ---
	function apply3DCardTilt() {
		const projectCards = document.querySelectorAll(".project-card");

		projectCards.forEach((card) => {
			card.addEventListener("mousemove", (e) => {
				const rect = card.getBoundingClientRect();
				const centerX = rect.width / 2;
				const centerY = rect.height / 2;
				const mouseX = e.clientX - rect.left;
				const mouseY = e.clientY - rect.top;

				const rotateX = (mouseY - centerY) / 10;
				const rotateY = (centerX - mouseX) / 10;

				card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
			});

			card.addEventListener("mouseleave", () => {
				card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
			});
		});
	}

	apply3DCardTilt();

	// --- SMOOTH SCROLL PROGRESS INDICATOR ---
	function updateScrollProgress() {
		const scrollHeight =
			document.documentElement.scrollHeight - window.innerHeight;
		const scrolled = (window.pageYOffset / scrollHeight) * 100;

		// Store progress for use in CSS if needed
		document.documentElement.style.setProperty("--scroll-progress", scrolled + "%");
	}

	window.addEventListener("scroll", updateScrollProgress, { passive: true });

	// --- SKILL FILTER FOR PROJECTS ---
	function addSkillFilter() {
		const skillChips = document.querySelectorAll(".skill-chip");
		const projectCards = document.querySelectorAll(".project-card");

		skillChips.forEach((chip) => {
			chip.style.cursor = "pointer";
			chip.addEventListener("click", function (e) {
				e.stopPropagation();
				const skillText = this.textContent.trim();
				const isActive = this.classList.contains("active-filter");

				if (!isActive) {
					// Clear other active filters
					skillChips.forEach((c) => c.classList.remove("active-filter"));
					this.classList.add("active-filter");

					// Filter projects
					projectCards.forEach((card) => {
						const cardSkills = card.querySelectorAll(".skill-chip");
						const hasSkill = Array.from(cardSkills).some(
							(s) => s.textContent.trim() === skillText
						);

						if (hasSkill) {
							card.style.opacity = "1";
							card.style.pointerEvents = "auto";
						} else {
							card.style.opacity = "0.3";
							card.style.pointerEvents = "none";
						}
					});
				} else {
					// Clear filter
					this.classList.remove("active-filter");
					projectCards.forEach((card) => {
						card.style.opacity = "1";
						card.style.pointerEvents = "auto";
					});
				}
			});
		});

		// Reset filter on card click
		projectCards.forEach((card) => {
			card.addEventListener("click", function () {
				skillChips.forEach((c) => c.classList.remove("active-filter"));
				projectCards.forEach((c) => {
					c.style.opacity = "1";
					c.style.pointerEvents = "auto";
				});
			});
		});
	}

	addSkillFilter();

	// --- STAGGERED ANIMATION FOR PROJECT GRIDS ---
	function staggerProjectCards() {
		const projectGrids = document.querySelectorAll(".projects-grid");

		projectGrids.forEach((grid) => {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const cards = entry.target.querySelectorAll(".project-card");
							cards.forEach((card, index) => {
								setTimeout(() => {
									card.classList.add("card-animated");
								}, index * 100);
							});
							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.1 }
			);

			observer.observe(grid);
		});
	}

	staggerProjectCards();

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
