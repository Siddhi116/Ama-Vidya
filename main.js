// Main application JavaScript

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/service-worker.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Online/Offline Status
function updateOnlineStatus() {
    const offlineIndicator = document.getElementById('offlineIndicator');
    if (navigator.onLine) {
        offlineIndicator.style.display = 'none';
    } else {
        offlineIndicator.style.display = 'block';
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Role Selection
function selectRole(role) {
    // Add selection animation
    const selectedCard = event.currentTarget;
    selectedCard.style.transform = 'scale(1.1)';
    selectedCard.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
    
    // Navigate after animation
    setTimeout(() => {
        if (role === 'student') {
            window.location.href = 'student.html';
        } else if (role === 'teacher') {
            window.location.href = 'teacher.html';
        }
    }, 300);
}

// Go back to home
function goHome() {
    window.location.href = 'index.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check online status
    updateOnlineStatus();
    
    // Initialize animations
    initializeAnimations();
});

function initializeAnimations() {
    // Animate role cards on load
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
    
    // Generate streak calendar
    generateStreakCalendar();
}

function generateStreakCalendar() {
    const calendar = document.getElementById('streakCalendar');
    if (!calendar) return;
    
    const days = 14; // Show last 2 weeks
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'streak-day';
        
        // Randomly make some days active for demo
        if (Math.random() > 0.3) {
            day.classList.add('active');
        }
        
        calendar.appendChild(day);
    }
}

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(notificationStyles);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Please try again.', 'error');
});

// Prevent context menu on production
document.addEventListener('contextmenu', function(e) {
    if (window.location.hostname !== 'localhost') {
        e.preventDefault();
    }
});