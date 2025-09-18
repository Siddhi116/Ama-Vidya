// Student Dashboard JavaScript

class StudentDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.videoFilters = 'all';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupVideoFilters();
        this.loadRecentAchievements();
        this.generateStreakCalendar();
        this.animateOnLoad();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').replace('#', '');
                this.showSection(section);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Trigger section-specific animations
            this.animateSection(sectionId);
        }
    }

    animateSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Add stagger animation to cards
        const cards = section.querySelectorAll('.dashboard-card, .video-card, .game-card, .achievement-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupVideoFilters() {
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const category = tag.getAttribute('data-category');
                this.filterVideos(category);
                
                // Update active filter
                filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
            });
        });

        // Setup video card clicks
        const videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.getAttribute('data-video');
                this.playVideo(videoId);
            });
        });
    }

    filterVideos(category) {
        const videoCards = document.querySelectorAll('.video-card');
        
        videoCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    }

    playVideo(videoId) {
        // Create video modal
        const modal = this.createVideoModal(videoId);
        document.body.appendChild(modal);
        
        // Record activity
        if (typeof progressManager !== 'undefined') {
            const videoCard = document.querySelector(`[data-video="${videoId}"]`);
            const subject = videoCard ? videoCard.getAttribute('data-category') : 'science';
            progressManager.recordActivity('video_watched', { subject });
        }
    }

    createVideoModal(videoId) {
        const videoData = this.getVideoData(videoId);
        
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-content">
                <div class="video-header">
                    <h3>${videoData.title}</h3>
                    <button class="close-video" onclick="this.closest('.video-modal').remove()">×</button>
                </div>
                <div class="video-player">
                    <div class="video-placeholder">
                        <div class="video-icon">${videoData.icon}</div>
                        <p>${videoData.description}</p>
                        <div class="video-meta">
                            <span class="duration">${videoData.duration}</span>
                            <span class="difficulty ${videoData.difficulty.toLowerCase()}">${videoData.difficulty}</span>
                        </div>
                        <button class="play-video-btn" onclick="this.textContent='Playing video...'; this.disabled=true;">
                            ▶️ Play Video
                        </button>
                    </div>
                </div>
                <div class="video-info">
                    <h4>What you'll learn:</h4>
                    <ul>
                        ${videoData.learningPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        `;

        return modal;
    }

    getVideoData(videoId) {
        const videos = {
            'photosynthesis': {
                title: 'How Plants Make Food',
                icon: '🌱',
                description: 'Discover the amazing process of photosynthesis and how plants convert sunlight into energy.',
                duration: '5:30',
                difficulty: 'Easy',
                learningPoints: [
                    'What is photosynthesis?',
                    'How do plants use sunlight?',
                    'The role of chlorophyll',
                    'Why plants are green'
                ]
            },
            'geometry': {
                title: 'Fun with Shapes',
                icon: '📐',
                description: 'Explore the wonderful world of geometry with circles, triangles, and squares.',
                duration: '7:15',
                difficulty: 'Medium',
                learningPoints: [
                    'Basic geometric shapes',
                    'Properties of circles',
                    'Triangle types',
                    'Area and perimeter'
                ]
            }
        };

        return videos[videoId] || videos['photosynthesis'];
    }

    loadRecentAchievements() {
        const container = document.getElementById('recentAchievements');
        if (!container) return;

        // Get recent achievements from progress manager
        let achievements = [];
        if (typeof progressManager !== 'undefined') {
            const progress = progressManager.getProgress();
            achievements = progress.unlockedAchievements.slice(-3); // Last 3 achievements
        }

        if (achievements.length === 0) {
            achievements = ['first_video']; // Default achievement
        }

        container.innerHTML = achievements.map(achievementId => {
            const achievement = this.getAchievementData(achievementId);
            return `
                <div class="achievement-item animate-slideInRight">
                    <span class="achievement-badge">${achievement.icon}</span>
                    <span class="achievement-text">${achievement.name}</span>
                </div>
            `;
        }).join('');
    }

    getAchievementData(achievementId) {
        const achievements = {
            'first_video': { name: 'First Video Completed!', icon: '🎬' },
            'first_game': { name: 'First Game Played!', icon: '🎮' },
            'streak_3': { name: '3-Day Streak!', icon: '🔥' },
            'video_enthusiast': { name: 'Video Enthusiast!', icon: '📺' },
            'game_master': { name: 'Game Master!', icon: '🎯' }
        };

        return achievements[achievementId] || achievements['first_video'];
    }

    generateStreakCalendar() {
        const calendar = document.getElementById('streakCalendar');
        if (!calendar) return;

        calendar.innerHTML = ''; // Clear existing
        
        const days = 14; // Show last 2 weeks
        let activeStreak = 0;
        
        if (typeof progressManager !== 'undefined') {
            activeStreak = progressManager.getProgress().currentStreak;
        }

        for (let i = days - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'streak-day';
            
            // Make recent days active based on current streak
            if (i < activeStreak && i < 7) {
                day.classList.add('active');
            }
            
            calendar.appendChild(day);
        }
    }

    animateOnLoad() {
        // Animate dashboard cards on load
        setTimeout(() => {
            const cards = document.querySelectorAll('.dashboard-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }, index * 200);
            });
        }, 300);

        // Animate stats with counting effect
        this.animateStats();
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent) || 0;
            let current = 0;
            const increment = target / 20;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 50);
        });
    }

    updateAchievements() {
        const achievementsGrid = document.getElementById('achievementsGrid');
        if (!achievementsGrid) return;

        let unlockedAchievements = [];
        if (typeof progressManager !== 'undefined') {
            unlockedAchievements = progressManager.getProgress().unlockedAchievements;
        }

        const allAchievements = [
            { id: 'first_video', name: 'Video Watcher', icon: '🎬', description: 'Watch your first STEM video' },
            { id: 'game_master', name: 'Gamemaster', icon: '🎮', description: 'Complete 10 learning games', progress: '3/10' },
            { id: 'stem_champion', name: 'STEM Champion', icon: '🏆', description: 'Master all four STEM subjects', progress: '1/4' },
            { id: 'streak_7', name: 'Week Warrior', icon: '🗓️', description: 'Learn for 7 consecutive days' },
            { id: 'knowledge_seeker', name: 'Knowledge Seeker', icon: '📚', description: 'Earn 500 XP' }
        ];

        achievementsGrid.innerHTML = allAchievements.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const cardClass = isUnlocked ? 'achievement-card earned' : 'achievement-card locked';
            
            return `
                <div class="${cardClass}">
                    <div class="achievement-badge">${achievement.icon}</div>
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                    ${isUnlocked ? 
                        '<div class="achievement-date">Earned: Today</div>' : 
                        achievement.progress ? 
                            `<div class="achievement-progress">${achievement.progress}</div>` : 
                            '<div class="achievement-progress">Locked</div>'
                    }
                </div>
            `;
        }).join('');
    }
}

// Add video modal styles
const videoStyles = document.createElement('style');
videoStyles.textContent = `
    .video-modal .video-content {
        background: white;
        border-radius: 16px;
        width: 90%;
        max-width: 800px;
        max-height: 90%;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease-out;
    }
    
    .video-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
    }
    
    .video-header h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
    }
    
    .close-video {
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .close-video:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
    }
    
    .video-player {
        padding: 2rem;
        text-align: center;
        background: #f8fafc;
    }
    
    .video-placeholder {
        padding: 3rem 2rem;
        border: 2px dashed #d1d5db;
        border-radius: 12px;
        background: white;
    }
    
    .video-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    
    .video-placeholder p {
        font-size: 1.1rem;
        color: #6b7280;
        margin-bottom: 1.5rem;
    }
    
    .video-meta {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .duration {
        background: #e5e7eb;
        color: #374151;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .play-video-btn {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .play-video-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }
    
    .video-info {
        padding: 2rem;
        background: white;
    }
    
    .video-info h4 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1rem;
    }
    
    .video-info ul {
        list-style: none;
        padding: 0;
    }
    
    .video-info li {
        padding: 0.5rem 0;
        color: #6b7280;
        position: relative;
        padding-left: 1.5rem;
    }
    
    .video-info li::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #10b981;
        font-weight: bold;
    }
`;
document.head.appendChild(videoStyles);

// Initialize student dashboard
let studentDashboard;
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.dashboard-container')) {
        studentDashboard = new StudentDashboard();
        
        // Update achievements when progress changes
        if (typeof progressManager !== 'undefined') {
            setTimeout(() => {
                studentDashboard.updateAchievements();
            }, 1000);
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StudentDashboard;
}