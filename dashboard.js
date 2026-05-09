document.addEventListener('DOMContentLoaded', () => {

    // 1. Animated Counters
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // lower is slower

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCount();
    });

    // 2. Chart.js Setup
    // Common options for dark theme
    Chart.defaults.color = '#8b949e';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Communication Load Analysis (Bar Chart)
    const ctxLoad = document.getElementById('loadChart').getContext('2d');

    // Create gradient
    const gradientBlue = ctxLoad.createLinearGradient(0, 0, 0, 400);
    gradientBlue.addColorStop(0, 'rgba(47, 129, 247, 0.8)');
    gradientBlue.addColorStop(1, 'rgba(47, 129, 247, 0.1)');

    const gradientPurple = ctxLoad.createLinearGradient(0, 0, 0, 400);
    gradientPurple.addColorStop(0, 'rgba(188, 140, 255, 0.8)');
    gradientPurple.addColorStop(1, 'rgba(188, 140, 255, 0.1)');

    new Chart(ctxLoad, {
        type: 'line',
        data: {
            labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
            datasets: [
                {
                    label: 'API Requests',
                    data: [1200, 1900, 3000, 5000, 2400, 1800, 900],
                    borderColor: '#2f81f7',
                    backgroundColor: gradientBlue,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'ERP Sync Events',
                    data: [800, 1200, 2500, 3500, 1800, 1200, 500],
                    borderColor: '#bc8cff',
                    backgroundColor: gradientPurple,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            }
        }
    });

    // System Delivery Performance (Doughnut Chart)
    const ctxPerf = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctxPerf, {
        type: 'doughnut',
        data: {
            labels: ['Delivered', 'Pending', 'Failed'],
            datasets: [{
                data: [95.8, 3.2, 1.0],
                backgroundColor: [
                    '#3fb950', // Green
                    '#d29922', // Orange
                    '#ff7b72'  // Red
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 3. Real-time Activity Monitoring Logs
    const logList = document.getElementById('activity-log');

    const sampleLogs = [
        { type: 'info', msg: 'ERP Sync: Student batch 2024 records updated.' },
        { type: 'success', msg: 'API Gateway: Webhook delivered to Mobile App (23ms).' },
        { type: 'info', msg: 'Biometric: Device #04 (Library) connection established.' },
        { type: 'warning', msg: 'Comm Engine: SMS Gateway rate limit approaching 80%.' },
        { type: 'success', msg: 'Mobile App: FCM payload delivered to 14,021 devices.' },
        { type: 'info', msg: 'Security: Admin login detected from IP 192.168.1.45' },
        { type: 'error', msg: 'API Gateway: Auth token expired for UserID 4992.' },
        { type: 'success', msg: 'ERP Sync: Fee transaction ID #TX992 verified.' }
    ];

    function createLogEntry(log) {
        const li = document.createElement('li');
        li.className = 'log-item';

        const time = new Date().toLocaleTimeString([], { hour12: false });

        li.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-badge ${log.type}">${log.type}</span>
            <span class="log-message">${log.msg}</span>
        `;

        // Add to top
        logList.insertBefore(li, logList.firstChild);

        // Keep max 20 logs
        if (logList.children.length > 20) {
            logList.removeChild(logList.lastChild);
        }
    }

    // Initial pop
    createLogEntry(sampleLogs[0]);
    createLogEntry(sampleLogs[1]);
    createLogEntry(sampleLogs[2]);

    // Randomly generate logs
    setInterval(() => {
        const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        createLogEntry(randomLog);
    }, 3500); // New log every 3.5 seconds

});
