import React from 'react'; 
import { Link, useLocation, Outlet} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileDropdown from '../Auth/ProfileDropdown';
import ThemeToggle from '../ThemeToggle';
import IdleTimer from '../Auth/IdleTimer';
import './CollegeDashboard.css';

const CollegeDashboard = () => {
    const location = useLocation();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    

    return (
        <div className={`college-dashboard ${isDarkMode ? 'dark' : 'light'}`}>
            <IdleTimer />
            <header className="college-header">
                <h2>College Dashboard</h2>
                <nav className="college-nav">
                    <div className="nav-links">
                        <Link to="/college/dashboard/students" className={location.pathname === '/college/dashboard/students' ? 'active' : ''}>Students</Link>
                        <Link to="/college/dashboard/add-student" className={location.pathname === '/college/dashboard/add-student' ? 'active' : ''}>Add Student</Link>
                        <Link to="/college/dashboard/add-achievement" className={location.pathname === '/college/dashboard/add-achievement' ? 'active' : ''}>Add Achievement</Link>
                    </div>
                    <div className="header-actions">
                        <ThemeToggle />
                        <ProfileDropdown dashboardType="college"/>
                    </div>
                </nav>
            </header>
            <div className="college-content">
                    <Outlet />
            </div>
        </div>
    );
};

export default CollegeDashboard;
