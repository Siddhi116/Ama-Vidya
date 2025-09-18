// Progress Tracking and Rewards System

class ProgressManager {
    constructor() {
        this.data = this.loadProgress();
        this.achievements = this.loadAchievements();
        this.init();
    }

    init() {
        this.updateDisplays();
        this.checkAchievements();
    }

    loadProgress() {
        const defaultData = {
            totalXP: 0,
            currentLevel: 1,
            videosWatched: 0,
            gamesPlayed: 0,
            timeSpent: 0,
            currentStreak: 0,
            lastActiveDate: null,
            subjects: {
                science: { progress: 0, xp: 0 },
                mathematics: { progress: 0, xp: 0 },
                technology: { progress: 0, xp: 0 },
                engineering: { progress: 0, xp: 0 }
            },
            dailyActivity: [],
            completedContent: [],
            unlockedAchievements: []
        };

        const saved = localStorage.getItem('studentProgress');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    loadAchievements() {
        return [
            {
                id: 'first_video',
                name: 'Video Watcher',
                description: 'Watch your first STEM video',
                icon: '🎬',
                xpReward: 10,
                condition: (data) => data.videosWatched >= 1
            },
            {
                id: 'video_enthusiast',
                name: 'Video Enthusiast',
                description: 'Watch 10 STEM videos',
                icon: '📺',
                xpReward: 50,
                condition: (data) => data.videosWatched >= 10
            },
            {
                id: 'first_game',
                name: 'Game Starter',
                description: 'Play your first learning game',
                icon: '🎮',
                xpReward: 15,
                condition: (data) => data.gamesPlayed >= 1
            },
            {
                id: 'game_master',
                name: 'Gamemaster',
                description: 'Complete 10 learning games',
                icon: '🎯',
                xpReward: 100,
                condition: (data) => data.gamesPlayed >= 10
            },
            {
                id: 'streak_3',
                name: '3-Day Streak',
                description: 'Learn for 3 consecutive days',
                icon: '🔥',
                xpReward: 30,
                condition: (data) => data.currentStreak >= 3
            },
            {
                id: 'streak_7',
                name: 'Week Warrior',
                description: 'Learn for 7 consecutive days',
                icon: '🗓️',
                xpReward: 70,
                condition: (data) => data.currentStreak >= 7
            },
            {
                id: 'science_explorer',
                name: 'Science Explorer',
                description: 'Complete 50% of science content',
                icon: '🔬',
                xpReward: 75,
                condition: (data) => data.subjects.science.progress >= 50
            },
            {
                id: 'math_genius',
                name: 'Math Genius',
                description: 'Complete 50% of mathematics content',
                icon: '🧮',
                xpReward: 75,
                condition: (data) => data.subjects.mathematics.progress >= 50
            },
            {
                id: 'tech_savvy',
                name: 'Tech Savvy',
                description: 'Complete 50% of technology content',
                icon: '💻',
                xpReward: 75,
                condition: (data) => data.subjects.technology.progress >= 50
            },
            {
                id: 'engineer_mind',
                name: 'Engineering Mind',
                description: 'Complete 50% of engineering content',
                icon: '⚙️',
                xpReward: 75,
                condition: (data) => data.subjects.engineering.progress >= 50
            },
            {
                id: 'stem_champion',
                name: 'STEM Champion',
                description: 'Master all four STEM subjects',
                icon: '🏆',
                xpReward: 200,
                condition: (data) => Object.values(data.subjects).every(s => s.progress >= 75)
            },
            {
                id: 'knowledge_seeker',
                name: 'Knowledge Seeker',
                description: 'Earn 500 XP',
                icon: '📚',
                xpReward: 50,
                condition: (data) => data.totalXP >= 500
            }
        ];
    }

    saveProgress() {
        localStorage.setItem('studentProgress', JSON.stringify(this.data));
    }

    addXP(amount, source = 'general') {
        this.data.totalXP += amount;
        this.updateLevel();
        this.saveProgress();
        this.showXPGained(amount);
        this.checkAchievements();
        this.updateDisplays();
    }

    updateLevel() {
        const newLevel = Math.floor(this.data.totalXP / 100) + 1;
        if (newLevel > this.data.currentLevel) {
            this.data.currentLevel = newLevel;
            this.showLevelUp();
        }
    }

    recordActivity(type, details = {}) {
        const today = new Date().toDateString();
        
        switch (type) {
            case 'video_watched':
                this.data.videosWatched++;
                this.addSubjectProgress(details.subject, 5);
                this.addXP(10);
                break;
            case 'game_played':
                this.data.gamesPlayed++;
                this.addSubjectProgress(details.subject, 10);
                this.addXP(details.xp || 20);
                break;
            case 'time_spent':
                this.data.timeSpent += details.minutes || 1;
                break;
        }

        this.updateStreak(today);
        this.recordDailyActivity(today, type);
        this.saveProgress();
        this.updateDisplays();
    }

    addSubjectProgress(subject, amount) {
        if (this.data.subjects[subject]) {
            this.data.subjects[subject].progress = Math.min(100, this.data.subjects[subject].progress + amount);
            this.data.subjects[subject].xp += amount;
        }
    }

    updateStreak(today) {
        const lastActive = this.data.lastActiveDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (!lastActive) {
            this.data.currentStreak = 1;
        } else if (lastActive === yesterdayStr) {
            this.data.currentStreak++;
        } else if (lastActive !== today) {
            this.data.currentStreak = 1;
        }

        this.data.lastActiveDate = today;
    }

    recordDailyActivity(date, type) {
        let dayActivity = this.data.dailyActivity.find(d => d.date === date);
        if (!dayActivity) {
            dayActivity = { date, activities: [] };
            this.data.dailyActivity.push(dayActivity);
        }
        
        dayActivity.activities.push({
            type,
            timestamp: new Date().toISOString()
        });

        // Keep only last 30 days
        if (this.data.dailyActivity.length > 30) {
            this.data.dailyActivity = this.data.dailyActivity.slice(-30);
        }
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.data.unlockedAchievements.includes(achievement.id) && 
                achievement.condition(this.data)) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        this.data.unlockedAchievements.push(achievement.id);
        this.addXP(achievement.xpReward);
        this.showAchievementUnlocked(achievement);
        this.saveProgress();
    }

    showXPGained(amount) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.innerHTML = `+${amount} XP`;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-weight: bold;
            font-size: 1.2rem;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(251, 191, 36, 0.5);
            animation: xpPop 1.5s ease-out forwards;
            pointer-events: none;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 1500);
    }

    showLevelUp() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div style="font-size: 2rem;">🎉</div>
            <div>Level Up!</div>
            <div>Level ${this.data.currentLevel}</div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            font-weight: bold;
            font-size: 1.5rem;
            z-index: 1000;
            text-align: center;
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.5);
            animation: levelUpPop 2s ease-out forwards;
            pointer-events: none;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    showAchievementUnlocked(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div style="font-size: 3rem;">${achievement.icon}</div>
            <div style="font-size: 1.2rem; margin: 0.5rem 0;">Achievement Unlocked!</div>
            <div style="font-size: 1.5rem; font-weight: bold;">${achievement.name}</div>
            <div style="font-size: 1rem; opacity: 0.9;">${achievement.description}</div>
            <div style="margin-top: 1rem; color: #fbbf24;">+${achievement.xpReward} XP</div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            font-weight: 500;
            z-index: 1000;
            text-align: center;
            box-shadow: 0 20px 40px rgba(16, 185, 129, 0.5);
            animation: achievementPop 3s ease-out forwards;
            pointer-events: none;
            max-width: 350px;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    updateDisplays() {
        // Update XP and level displays
        const totalXPElement = document.getElementById('totalXP');
        if (totalXPElement) totalXPElement.textContent = this.data.totalXP;

        const currentLevelElement = document.getElementById('currentLevel');
        if (currentLevelElement) currentLevelElement.textContent = this.data.currentLevel;

        // Update activity stats
        const videosWatchedElement = document.getElementById('videosWatched');
        if (videosWatchedElement) videosWatchedElement.textContent = this.data.videosWatched;

        const gamesPlayedElement = document.getElementById('gamesPlayed');
        if (gamesPlayedElement) gamesPlayedElement.textContent = this.data.gamesPlayed;

        const timeSpentElement = document.getElementById('timeSpent');
        if (timeSpentElement) timeSpentElement.textContent = this.data.timeSpent;

        const currentStreakElement = document.getElementById('currentStreak');
        if (currentStreakElement) currentStreakElement.textContent = this.data.currentStreak;

        // Update subject progress
        Object.keys(this.data.subjects).forEach(subject => {
            const progressElement = document.querySelector(`.progress-fill.${subject}`);
            if (progressElement) {
                progressElement.style.width = `${this.data.subjects[subject].progress}%`;
            }
        });

        // Update overall progress
        const overallProgress = Object.values(this.data.subjects).reduce((avg, subject) => avg + subject.progress, 0) / 4;
        const overallElement = document.getElementById('overallProgress');
        if (overallElement) {
            overallElement.style.width = `${overallProgress}%`;
            const textElement = overallElement.parentElement.nextElementSibling;
            if (textElement) textElement.textContent = `${Math.round(overallProgress)}% Complete`;
        }
    }

    getProgress() {
        return this.data;
    }

    resetProgress() {
        localStorage.removeItem('studentProgress');
        this.data = this.loadProgress();
        this.updateDisplays();
    }

    exportProgress() {
        return JSON.stringify(this.data, null, 2);
    }

    importProgress(progressData) {
        try {
            this.data = JSON.parse(progressData);
            this.saveProgress();
            this.updateDisplays();
            return true;
        } catch (error) {
            console.error('Failed to import progress:', error);
            return false;
        }
    }
}

// Add CSS for notifications
const progressStyles = document.createElement('style');
progressStyles.textContent = `
    @keyframes xpPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -100px) scale(1);
        }
    }
    
    @keyframes levelUpPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
    }
    
    @keyframes achievementPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }
`;
document.head.appendChild(progressStyles);

// Initialize progress manager
let progressManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('student-dashboard') || 
        document.getElementById('totalXP')) {
        progressManager = new ProgressManager();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressManager;
}