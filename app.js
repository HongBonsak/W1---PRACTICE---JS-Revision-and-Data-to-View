// Main App Coordination and Navigation

// Current active view
let currentView = "player";

// Menu navigation
const menuItems = document.querySelectorAll(".menu-item");

// Initialize app
function initApp() {
    // Set up menu navigation
    setupMenuNavigation();
    
    // Check URL hash for initial view
    const hash = window.location.hash.substring(1);
    if (hash === "editor") {
        switchView("editor");
    } else {
        switchView("player");
    }
    
    // Handle browser back/forward
    window.addEventListener("hashchange", handleHashChange);
}

// Setup menu navigation
function setupMenuNavigation() {
    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const viewName = item.getAttribute("data-view");
            switchView(viewName);
        });
    });
}

// Switch between views
function switchView(viewName) {
    currentView = viewName;
    
    // Update URL hash
    window.location.hash = viewName;
    
    // Update active menu item
    menuItems.forEach(item => {
        if (item.getAttribute("data-view") === viewName) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
    
    // Show/hide views
    if (viewName === "player") {
        show(dom_start);
        hide(dom_quiz);
        hide(dom_score);
        hide(dom_editor);
        hide(dom_menu);
        resetGameState();
    } else if (viewName === "editor") {
        hide(dom_start);
        hide(dom_quiz);
        hide(dom_score);
        show(dom_editor);
        show(dom_menu);
        renderQuestionsList();
    }
}

// Handle browser navigation
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && hash !== currentView) {
        if (hash === "editor" || hash === "player") {
            switchView(hash);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
