// Charts Manager for Employee Management System
// Handles all chart visualizations using Chart.js

class ChartsManager {
    constructor() {
        this.departmentChart = null;
        this.statusChart = null;
        this.init();
    }

    init() {
        // Initialize charts after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupCharts();
            });
        } else {
            this.setupCharts();
        }
    }

    setupCharts() {
        this.setupDepartmentChart();
        this.setupStatusChart();
    }

    // Department Distribution Chart
    setupDepartmentChart() {
        const canvas = document.getElementById('departmentChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        this.departmentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
                        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
                        '#ec4899', '#6366f1', '#14b8a6', '#f59e0b'
                    ],
                    borderWidth: 0,
                    borderRadius: 8,
                    cutout: '60%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                            font: {
                                size: 12,
                                family: 'Inter, sans-serif'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--surface'),
                        titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000,
                    easing: 'easeOutCubic'
                }
            }
        });
    }

    // Status Overview Chart
    setupStatusChart() {
        const canvas = document.getElementById('statusChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        this.statusChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Employees',
                    data: [],
                    backgroundColor: [
                        '#10b981', '#ef4444', '#f59e0b', '#6b7280'
                    ],
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted'),
                            font: {
                                size: 12,
                                family: 'Inter, sans-serif'
                            }
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted'),
                            font: {
                                size: 12,
                                family: 'Inter, sans-serif'
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--surface'),
                        titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            title: function(context) {
                                return `Status: ${context[0].label}`;
                            },
                            label: function(context) {
                                return `${context.parsed.y} employee${context.parsed.y !== 1 ? 's' : ''}`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutCubic'
                }
            }
        });
    }

    // Update Department Chart
    updateDepartmentChart(data) {
        if (!this.departmentChart || !data) return;

        const departments = Object.keys(data);
        const values = Object.values(data);

        this.departmentChart.data.labels = departments;
        this.departmentChart.data.datasets[0].data = values;
        
        // Update colors based on number of departments
        const colors = this.generateColors(departments.length);
        this.departmentChart.data.datasets[0].backgroundColor = colors;
        
        this.departmentChart.update('active');
    }

    // Update Status Chart
    updateStatusChart(data) {
        if (!this.statusChart || !data) return;

        const statuses = Object.keys(data);
        const values = Object.values(data);

        // Map status to more readable labels
        const statusLabels = {
            'ACTIVE': 'Active',
            'INACTIVE': 'Inactive',
            'ON_LEAVE': 'On Leave',
            'TERMINATED': 'Terminated'
        };

        const labels = statuses.map(status => statusLabels[status] || status);
        
        this.statusChart.data.labels = labels;
        this.statusChart.data.datasets[0].data = values;

        // Set colors based on status
        const statusColors = {
            'ACTIVE': '#10b981',    // Green
            'INACTIVE': '#ef4444',  // Red
            'ON_LEAVE': '#f59e0b',  // Amber
            'TERMINATED': '#6b7280' // Gray
        };

        const colors = statuses.map(status => statusColors[status] || '#6b7280');
        this.statusChart.data.datasets[0].backgroundColor = colors;
        
        this.statusChart.update('active');
    }

    // Generate colors for charts
    generateColors(count) {
        const baseColors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
            '#ec4899', '#6366f1', '#14b8a6', '#f59e0b'
        ];

        if (count <= baseColors.length) {
            return baseColors.slice(0, count);
        }

        // Generate additional colors if needed
        const colors = [...baseColors];
        while (colors.length < count) {
            colors.push(this.generateRandomColor());
        }

        return colors;
    }

    generateRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 60%, 55%)`;
    }

    // Advanced Charts for Reports (can be extended)
    createSalaryDistributionChart(containerId, data) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'histogram',
            data: {
                datasets: [{
                    label: 'Salary Distribution',
                    data: data,
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return `Salary Range: $${context[0].parsed.x}`;
                            },
                            label: function(context) {
                                return `${context.parsed.y} employees`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Salary ($)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Employees'
                        }
                    }
                }
            }
        });
    }

    createHiringTrendsChart(containerId, data) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'New Hires',
                    data: data.values,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `${context.parsed.y} new hires`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Hires'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutCubic'
                }
            }
        });
    }

    // Theme support for charts
    updateChartsTheme() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        const textColor = isDarkMode ? '#cbd5e1' : '#475569';
        const mutedColor = isDarkMode ? '#64748b' : '#94a3b8';
        const borderColor = isDarkMode ? '#334155' : '#e2e8f0';

        // Update department chart
        if (this.departmentChart) {
            this.departmentChart.options.plugins.legend.labels.color = textColor;
            this.departmentChart.options.plugins.tooltip.backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
            this.departmentChart.options.plugins.tooltip.titleColor = textColor;
            this.departmentChart.options.plugins.tooltip.bodyColor = mutedColor;
            this.departmentChart.options.plugins.tooltip.borderColor = borderColor;
            this.departmentChart.update('none');
        }

        // Update status chart
        if (this.statusChart) {
            this.statusChart.options.scales.x.ticks.color = mutedColor;
            this.statusChart.options.scales.y.ticks.color = mutedColor;
            this.statusChart.options.scales.y.grid.color = borderColor;
            this.statusChart.options.plugins.tooltip.backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
            this.statusChart.options.plugins.tooltip.titleColor = textColor;
            this.statusChart.options.plugins.tooltip.bodyColor = mutedColor;
            this.statusChart.options.plugins.tooltip.borderColor = borderColor;
            this.statusChart.update('none');
        }
    }

    // Utility method to destroy charts (useful for cleanup)
    destroyCharts() {
        if (this.departmentChart) {
            this.departmentChart.destroy();
            this.departmentChart = null;
        }
        
        if (this.statusChart) {
            this.statusChart.destroy();
            this.statusChart = null;
        }
    }

    // Resize charts (useful for responsive behavior)
    resizeCharts() {
        if (this.departmentChart) {
            this.departmentChart.resize();
        }
        
        if (this.statusChart) {
            this.statusChart.resize();
        }
    }

    // Export chart as image
    exportChart(chartInstance, filename = 'chart.png') {
        if (!chartInstance) return;
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = chartInstance.toBase64Image();
        link.click();
    }

    // Animation helpers
    animateCountUp(element, endValue, duration = 1000) {
        const startValue = parseInt(element.textContent) || 0;
        const increment = (endValue - startValue) / (duration / 16);
        let currentValue = startValue;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= endValue) {
                element.textContent = endValue.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString();
            }
        }, 16);
    }
}

// Initialize Charts Manager
const charts = new ChartsManager();

// Make charts globally available
window.charts = charts;

// Listen for theme changes to update chart colors
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Delay to allow theme change to complete
            setTimeout(() => {
                charts.updateChartsTheme();
            }, 100);
        });
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    charts.resizeCharts();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartsManager;
}
