'use client';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Defaults
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

// Set default color to white
ChartJS.defaults.color = '#ffffff';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

export function AnalyticsCharts({ statusStats, monthlyStats }: { statusStats: any[], monthlyStats: Record<string, number> }) {

    const pieData = {
        labels: statusStats.map(s => s.status),
        datasets: [
            {
                data: statusStats.map(s => s.count),
                backgroundColor: [
                    '#f59e0b', // Pending (Warning)
                    '#22c55e', // Approved (Success)
                    '#ef4444', // Rejected (Danger)
                ],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: Object.keys(monthlyStats),
        datasets: [
            {
                label: 'Queries per Month',
                data: Object.values(monthlyStats),
                backgroundColor: '#2563eb',
            },
        ],
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Query Status Distribution</h2>
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                    {statusStats.length > 0 ? <Pie data={pieData} /> : <p>No data available</p>}
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Monthly Query Trends</h2>
                <div style={{ height: '300px' }}>
                    {Object.keys(monthlyStats).length > 0 ? <Bar data={barData} options={{ maintainAspectRatio: false }} /> : <p style={{ textAlign: 'center' }}>No data available</p>}
                </div>
            </div>
        </div>
    );
}
