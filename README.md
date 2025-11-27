# Personal Portfolio Website

A modern, animated, and responsive personal portfolio website built with HTML, CSS, and vanilla JavaScript. It's designed to showcase projects, experience, and skills in a visually engaging way. This project was created as a personal showcase and is now open-sourced for the community.

## Live Demo

Check out the live version of the website [here](https://creationsn.github.io/Self-Website/).

## Features

-   **Animated Hero Section:** A welcoming hero section with a typewriter effect and word-by-word title animation.
-   **Interactive 3D Project Cards:** Project cards have a 3D tilt and a spotlight effect on mouse hover, creating an engaging user experience.
-   **Dynamic Project Filtering:** Users can filter projects by category (e.g., Web Development, Graphic Design) and also by specific skills/technologies by clicking on the skill chips.
-   **Scroll-Triggered Animations:** Elements gracefully fade and slide into view as the user scrolls down the page, guided by `IntersectionObserver` for performance.
-   **Responsive Design:** The layout is fully responsive and optimized for a seamless experience on desktops, tablets, and mobile devices.
-   **Dual Navigation System:** Features a sleek floating sidebar navigation for desktop and a clean, functional hamburger menu for mobile.
-   **Creative Loading Screen:** An initial loading screen with a multi-language greeting and a typewriter animation provides a unique first impression.
-   **Custom Cursor:** A custom-designed cursor enhances the user experience on desktop devices.

## Setup and Installation

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/CreationSN/Self-Website.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd Self-Website
    ```
3.  **Run the project:**
    Simply open the `index.html` file in your web browser. For the best development experience, it is recommended to use a live server extension in your code editor (like "Live Server" for VS Code) to automatically reload the page on changes.

## File Structure

The project is organized into three main files:

-   `index.html`: This is the main structural file for the website. All text content, project details, experience history, and links are located here.
-   `styles.css`: This file contains all the styling for the website. It includes base styles, animations, responsive media queries, and custom properties for theming.
-   `script.js`: This file handles all the interactivity, including animations, project filtering, the 3D card effects, and navigation logic.

## Customization Guide

You can easily customize the portfolio to make it your own.

-   **Content:** All text content—including project descriptions, job titles, and personal information—can be edited directly within the `index.html` file. Each section is clearly marked with comments.
-   **Styling:** To change the color scheme, fonts, or other global styles, modify the CSS variables located in the `:root` block at the top of the `styles.css` file.
-   **Profile Picture:** To change the profile picture, replace the `Pic.JPG` file with your own image. Make sure to update the `src` attribute in the `<img>` tag within the "About Me" section of `index.html` if you use a different file name.
-   **Parallax Effect:** The parallax background effect (`.section-drops`) was temporarily disabled to resolve a layout bug. The code is still present but commented out in `index.html`. If you wish to re-enable it, you will need to uncomment the `<div class="section-drops">...</div>` blocks. **Important:** To prevent layout issues, you must also ensure the corresponding CSS in `styles.css` for `[data-parallax]` correctly uses `position: absolute` to take these elements out of the document flow.

## Technologies Used

-   **HTML5**
-   **CSS3** (utilizing Custom Properties and advanced animations)
-   **Vanilla JavaScript** (no external libraries or frameworks)
-   **Google Fonts** (Inter and Noto Sans Devanagari)

## License

This project is open source and distributed under the MIT License. See the `LICENSE` file for more information.
