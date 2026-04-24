document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('chartContainer');
    const barCount = 12;
    
    // Create bars
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        chartContainer.appendChild(bar);
        
        // Randomize heights after a slight delay
        setTimeout(() => {
            const randomHeight = Math.floor(Math.random() * 200) + 50;
            bar.style.height = `${randomHeight}px`;
        }, 500 + (i * 100));
    }

    // Interactive hover effect
    chartContainer.addEventListener('mousemove', (e) => {
        const rect = chartContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Optional: Add a subtle glow following the mouse
        chartContainer.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.05) 0%, var(--glass-bg) 50%)`;
    });

    chartContainer.addEventListener('mouseleave', () => {
        chartContainer.style.background = 'var(--glass-bg)';
    });

    console.log('Chart UI Initialized');
});
