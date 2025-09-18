// Teacher Dashboard JavaScript

class TeacherDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.studentData = this.generateSampleData();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDateRange();
        this.setupStudentTable();
        this.setupContentTabs();
        this.drawCharts();
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
        const cards = section.querySelectorAll('.stat-card, .chart-card, .analytics-card, .content-item');
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

    setupDateRange() {
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            dateRange.addEventListener('change', (e) => {
                this.updateStatistics(e.target.value);
            });
        }
    }

    updateStatistics(period) {
        // Simulate updating statistics based on date range
        const stats = {
            today: { students: 124, progress: 87, games: 342, videos: 156 },
            week: { students: 124, progress: 85, games: 2100, videos: 890 },
            month: { students: 124, progress: 82, games: 8500, videos: 3200 }
        };

        const currentStats = stats[period] || stats.today;
        
        // Update stat cards with animation
        this.animateStatUpdate('stat-card:nth-child(1) h3', currentStats.students);
        this.animateStatUpdate('stat-card:nth-child(2) h3', `${currentStats.progress}%`);
        this.animateStatUpdate('stat-card:nth-child(3) h3', currentStats.games);
        this.animateStatUpdate('stat-card:nth-child(4) h3', currentStats.videos);
    }

    animateStatUpdate(selector, newValue) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.transform = 'scale(1.2)';
            element.style.color = '#3b82f6';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 200);
        }
    }

    setupStudentTable() {
        const searchInput = document.getElementById('studentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterStudents(e.target.value);
            });
        }

        this.populateStudentTable();
    }

    populateStudentTable() {
        const tbody = document.getElementById('studentsTableBody');
        if (!tbody) return;

        const students = this.generateStudentList();
        
        tbody.innerHTML = students.map(student => `
            <tr class="student-row" style="opacity: 0; transform: translateY(20px);">
                <td>
                    <div class="student-info">
                        <img src="assets/images/student-avatar.svg" alt="Avatar" class="student-avatar">
                        <span>${student.name}</span>
                    </div>
                </td>
                <td>
                    <div class="progress-bar small">
                        <div class="progress-fill" style="width: ${student.progress}%;"></div>
                    </div>
                    <span class="progress-text">${student.progress}%</span>
                </td>
                <td>${student.lastActive}</td>
                <td>
                    <div class="achievements-mini">
                        ${student.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                    </div>
                </td>
                <td>
                    <button class="btn-small" onclick="teacherDashboard.viewStudent('${student.id}')">View</button>
                </td>
            </tr>
        `).join('');

        // Animate rows
        setTimeout(() => {
            const rows = document.querySelectorAll('.student-row');
            rows.forEach((row, index) => {
                setTimeout(() => {
                    row.style.transition = 'all 0.5s ease';
                    row.style.opacity = '1';
                    row.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    }

    generateStudentList() {
        const names = [
            'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown',
            'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chen', 'Jack Robinson'
        ];
        
        const badges = ['🎬', '🎮', '📊', '🏆', '🔥', '📚'];
        
        return names.map((name, index) => ({
            id: `student-${index}`,
            name,
            progress: Math.floor(Math.random() * 40) + 60, // 60-100%
            lastActive: this.getRandomTimeAgo(),
            badges: this.getRandomBadges(badges, Math.floor(Math.random() * 3) + 1)
        }));
    }

    getRandomTimeAgo() {
        const times = ['2 hours ago', '1 day ago', '3 hours ago', '30 minutes ago', '1 week ago'];
        return times[Math.floor(Math.random() * times.length)];
    }

    getRandomBadges(badges, count) {
        const shuffled = badges.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    filterStudents(searchTerm) {
        const rows = document.querySelectorAll('.student-row');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const name = row.querySelector('.student-info span').textContent.toLowerCase();
            if (name.includes(term)) {
                row.style.display = '';
                row.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                row.style.display = 'none';
            }
        });
    }

    viewStudent(studentId) {
        // Create student detail modal
        const modal = this.createStudentModal(studentId);
        document.body.appendChild(modal);
    }

    createStudentModal(studentId) {
        const student = this.studentData.find(s => s.id === studentId) || {
            name: 'Sample Student',
            progress: 78,
            subjects: {
                science: 85,
                mathematics: 72,
                technology: 68,
                engineering: 79
            },
            recentActivity: [
                { type: 'video', title: 'How Plants Make Food', time: '2 hours ago' },
                { type: 'game', title: 'Math Quiz Challenge', time: '1 day ago' },
                { type: 'video', title: 'Fun with Shapes', time: '2 days ago' }
            ]
        };

        const modal = document.createElement('div');
        modal.className = 'student-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Student Profile: ${student.name}</h3>
                    <button class="close-modal" onclick="this.closest('.student-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="student-overview">
                        <div class="overview-stat">
                            <h4>Overall Progress</h4>
                            <div class="progress-circle">
                                <span class="progress-number">${student.progress}%</span>
                            </div>
                        </div>
                        <div class="subject-breakdown">
                            <h4>Subject Progress</h4>
                            ${Object.entries(student.subjects || {}).map(([subject, progress]) => `
                                <div class="subject-item">
                                    <span class="subject-name">${subject}</span>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${progress}%;"></div>
                                    </div>
                                    <span class="subject-percent">${progress}%</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="recent-activity">
                        <h4>Recent Activity</h4>
                        <div class="activity-list">
                            ${(student.recentActivity || []).map(activity => `
                                <div class="activity-item">
                                    <span class="activity-type">${activity.type === 'video' ? '🎥' : '🎮'}</span>
                                    <div class="activity-details">
                                        <span class="activity-title">${activity.title}</span>
                                        <span class="activity-time">${activity.time}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
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

    setupContentTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabType = button.getAttribute('data-tab');
                this.switchContentTab(tabType);
                
                // Update active tab
                tabButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
            });
        });

        this.loadContentItems('videos');
    }

    switchContentTab(tabType) {
        this.loadContentItems(tabType);
    }

    loadContentItems(type) {
        const contentGrid = document.getElementById('contentGrid');
        if (!contentGrid) return;

        const contentItems = this.getContentItems(type);
        
        contentGrid.innerHTML = contentItems.map(item => `
            <div class="content-item" style="opacity: 0; transform: translateY(20px);">
                <div class="content-thumbnail">
                    <div class="content-type">${type.toUpperCase()}</div>
                    <div class="content-preview">${item.icon}</div>
                </div>
                <div class="content-info">
                    <h4>${item.title}</h4>
                    <p>${item.meta}</p>
                    <div class="content-stats">
                        <span>👁️ ${item.views} views</span>
                        <span>⭐ ${item.rating}/5</span>
                    </div>
                </div>
                <div class="content-actions">
                    <button class="btn-small">Edit</button>
                    <button class="btn-small danger">Delete</button>
                </div>
            </div>
        `).join('');

        // Animate content items
        setTimeout(() => {
            const items = contentGrid.querySelectorAll('.content-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    }

    getContentItems(type) {
        const items = {
            videos: [
                { title: 'How Plants Make Food', icon: '🌱', meta: 'Science • 5:30 • Easy', views: 456, rating: 4.8 },
                { title: 'Fun with Shapes', icon: '📐', meta: 'Mathematics • 7:15 • Medium', views: 387, rating: 4.6 },
                { title: 'Simple Machines', icon: '⚙️', meta: 'Engineering • 6:45 • Medium', views: 312, rating: 4.7 },
                { title: 'Digital Art Basics', icon: '💻', meta: 'Technology • 8:20 • Easy', views: 298, rating: 4.5 }
            ],
            games: [
                { title: 'Math Quiz Challenge', icon: '🧮', meta: 'Mathematics • Interactive • Easy', views: 423, rating: 4.9 },
                { title: 'Virtual Science Lab', icon: '🧪', meta: 'Science • Simulation • Medium', views: 356, rating: 4.7 },
                { title: 'Pattern Master', icon: '🎨', meta: 'Mathematics • Puzzle • Hard', views: 289, rating: 4.6 },
                { title: 'Code Builder', icon: '💻', meta: 'Technology • Programming • Medium', views: 267, rating: 4.8 }
            ],
            quizzes: [
                { title: 'Plant Biology Quiz', icon: '🌿', meta: 'Science • 10 Questions • Medium', views: 234, rating: 4.4 },
                { title: 'Geometry Basics', icon: '📊', meta: 'Mathematics • 15 Questions • Easy', views: 198, rating: 4.3 },
                { title: 'Tech History', icon: '📱', meta: 'Technology • 12 Questions • Hard', views: 156, rating: 4.2 },
                { title: 'Engineering Principles', icon: '🔧', meta: 'Engineering • 8 Questions • Medium', views: 134, rating: 4.5 }
            ]
        };

        return items[type] || items.videos;
    }

    drawCharts() {
        this.drawActivityChart();
        this.animatePerformanceBars();
    }

    drawActivityChart() {
        const canvas = document.getElementById('activityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw simple chart
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, width, height);

        // Draw chart data (simplified)
        const data = [30, 45, 28, 62, 41, 55, 38];
        const barWidth = width / data.length;

        ctx.fillStyle = '#3b82f6';
        data.forEach((value, index) => {
            const barHeight = (value / 70) * height * 0.8;
            const x = index * barWidth + 10;
            const y = height - barHeight - 20;
            
            ctx.fillRect(x, y, barWidth - 20, barHeight);
        });

        // Add labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((day, index) => {
            ctx.fillText(day, index * barWidth + barWidth/2, height - 5);
        });
    }

    animatePerformanceBars() {
        const performanceBars = document.querySelectorAll('.performance-fill');
        performanceBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.style.width;
                bar.style.width = '0%';
                bar.style.transition = 'width 1s ease-out';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }, index * 200);
        });
    }

    generateSampleData() {
        // Generate sample data for demonstration
        return [
            {
                id: 'student-0',
                name: 'Alice Johnson',
                progress: 78,
                subjects: { science: 85, mathematics: 72, technology: 68, engineering: 79 },
                recentActivity: [
                    { type: 'video', title: 'How Plants Make Food', time: '2 hours ago' },
                    { type: 'game', title: 'Math Quiz Challenge', time: '1 day ago' }
                ]
            }
        ];
    }

    animateOnLoad() {
        // Animate stat cards on load
        setTimeout(() => {
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }, index * 150);
            });
        }, 300);

        // Animate numbers
        this.animateStatNumbers();
    }

    animateStatNumbers() {
        const statNumbers = document.querySelectorAll('.stat-card h3');
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const number = parseInt(text);
            
            if (!isNaN(number) && number > 0) {
                let current = 0;
                const increment = number / 30;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        current = number;
                        clearInterval(timer);
                        stat.textContent = text; // Restore original format
                    } else {
                        stat.textContent = Math.floor(current) + (text.includes('%') ? '%' : '');
                    }
                }, 50);
            }
        });
    }
}

// Add teacher-specific modal styles
const teacherStyles = document.createElement('style');
teacherStyles.textContent = `
    .student-modal .modal-content {
        background: white;
        border-radius: 16px;
        width: 90%;
        max-width: 600px;
        max-height: 90%;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease-out;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        color: white;
    }
    
    .modal-header h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
    }
    
    .close-modal {
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
    
    .close-modal:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
    }
    
    .modal-body {
        padding: 2rem;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .student-overview {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .progress-circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: conic-gradient(#10b981 0deg, #10b981 ${78 * 3.6}deg, #e5e7eb ${78 * 3.6}deg);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        margin: 1rem auto;
    }
    
    .progress-circle::before {
        content: '';
        width: 70px;
        height: 70px;
        background: white;
        border-radius: 50%;
        position: absolute;
    }
    
    .progress-number {
        font-size: 1.5rem;
        font-weight: bold;
        color: #10b981;
        z-index: 1;
    }
    
    .subject-breakdown h4,
    .recent-activity h4 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1rem;
    }
    
    .subject-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .subject-name {
        width: 80px;
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
        text-transform: capitalize;
    }
    
    .subject-item .progress-bar {
        flex: 1;
        height: 6px;
    }
    
    .subject-percent {
        width: 40px;
        text-align: right;
        font-size: 0.875rem;
        font-weight: 600;
        color: #10b981;
    }
    
    .activity-list {
        display: grid;
        gap: 1rem;
    }
    
    .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
    }
    
    .activity-type {
        font-size: 1.5rem;
        width: 40px;
        text-align: center;
    }
    
    .activity-details {
        flex: 1;
    }
    
    .activity-title {
        display: block;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .activity-time {
        font-size: 0.875rem;
        color: #6b7280;
    }
`;
document.head.appendChild(teacherStyles);

// Initialize teacher dashboard
let teacherDashboard;
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.teacher-sidebar')) {
        teacherDashboard = new TeacherDashboard();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeacherDashboard;
}