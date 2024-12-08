import React, { useState, useEffect } from 'react';
import { getStudentAchievements } from '../../api';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import './Portfolio.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Portfolio = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await getStudentAchievements();
            setAchievements(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching achievements:', error);
            setLoading(false);
        }
    };

    const categoryData = achievements.reduce((acc, achievement) => {
        acc[achievement.activityCategory] = (acc[achievement.activityCategory] || 0) + 1;
        return acc;
    }, {});

    // Aggregate data by activity name to ensure labels and points match correctly
    const aggregatedData = achievements.reduce((acc, curr) => {
        if (!acc[curr.activityName]) {
            acc[curr.activityName] = curr.activitypoints;
        } else {
            acc[curr.activityName] += curr.activitypoints;
        }
        return acc;
    }, {});

    const pieChartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    const barChartData = {
        labels: Object.keys(aggregatedData),
        datasets: [
            {
                label: 'Achievement Points',
                data: Object.values(aggregatedData), // Use aggregated points
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="student-portfolio">
            <h2>Your Achievement Portfolio</h2>
            {loading ? (
                <div className="loading-spinner"></div>
            ) : (
                <div className="portfolio-content">
                    <div className="chart-container">
                        <h3>Achievement Categories</h3>
                        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                    <div className="chart-container">
                        <h3>Achievement Points</h3>
                        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                    <div className="achievements-table">
                        <h3>Achievements Details</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Points</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {achievements.map((achievement) => (
                                    <tr key={achievement.id} className="achievement-row">
                                        <td>{achievement.activityName}</td>
                                        <td>{achievement.activityCategory}</td>
                                        <td>{achievement.activitypoints}</td>
                                        <td>{new Date(achievement.activityDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
