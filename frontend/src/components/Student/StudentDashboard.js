import React from 'react'; 
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileDropdown from '../Auth/ProfileDropdown';
import ThemeToggle from '../ThemeToggle';
import IdleTimer from '../Auth/IdleTimer';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const location = useLocation();
    
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    return (
        <div className={`student-dashboard ${isDarkMode ? 'dark' : 'light'}`}>
            <IdleTimer />
            <header className="student-header">
                <h2>Student Dashboard</h2>
                <nav className="student-nav">
                    <div className="student-nav-links">
                        <Link to="/student/dashboard/achievements" className={location.pathname === '/student/dashboard/achievements' ? 'active' : ''}>Achievements</Link>
                        <Link to="/student/dashboard/portfolio" className={location.pathname === '/student/dashboard/portfolio' ? 'active' : ''}>Portfolio</Link>
                    </div>
                    <div className="header-actions">
                        <ThemeToggle />
                        <ProfileDropdown dashboardType="student" />
                    </div>
                </nav>
            </header>
            <div className="student-content">
                <Outlet /> {/* This will render the matched child route */}
            </div>
        </div>
    );
};

export default StudentDashboard;
