import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { getTokenInfo } from './utils/tokenUtils';
import Home from './components/Home';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import CollegeDashboard from './components/College/CollegeDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import CollegeList from './components/Admin/Colleges/CollegeList';
import StudentList from './components/Admin/Students/StudentList';
import AddCollege from './components/Admin/Colleges/AddCollege';
import AchievementList from './components/Admin/Achievements/AchievementList';
import AddStudent from './components/College/Students/AddStudent';
import StudentListByCollege from './components/College/Students/StudentListByCollege';
import Achievements from './components/Student/StudentAchievements';
import Portfolio from './components/Student/Portfolio';
import EditCollege from './components/Admin/Colleges/EditCollege';
import AddAchievement from './components/College/Achievements/AddAchievement';
import EditAchievement from './components/College/Achievements/EditAchievement';
import StudentDetail from './components/College/Students/StudentDetail';
import EditStudent from './components/College/Students/EditStudent';
import StudentEdit from './components/Student/StudentEdit';
import StudentSettings from './components/Student/StudentSettings';
import CollegeEditProfile from './components/College/CollegeEditProfile';
import CollegeSettings from './components/College/CollegeSettings';
import AdminEditProfile from './components/Admin/AdminEditProfile';
import AdminSettings from './components/Admin/AdminSettings';
import SubscriptionPage from "./components/College/SubscriptionPage";
const ProtectedRoute = ({ children, allowedRole }) => {
    const location = useLocation();
    const tokenInfo = getTokenInfo();
    if (!tokenInfo) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (tokenInfo.role !== allowedRole) {
        const redirectPath = {
            admin: '/admin/dashboard/colleges',
            college: '/college/dashboard/students',
            student: '/student/dashboard/achievements'
        }[tokenInfo.role];

        return <Navigate to={redirectPath} replace />;
    }

    // Check token expiration
    if (tokenInfo.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard/*" element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }>
                    <Route path="colleges" element={<CollegeList />} />
                    <Route path="students" element={<StudentList />} />
                    <Route path="achievements" element={<AchievementList />} />
                    <Route path="add-college" element={<AddCollege />} />
                    <Route path="edit-college" element={<EditCollege />} />
                    <Route path="edit-profile" element={<AdminEditProfile />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* College Routes */}
                <Route path="/college/dashboard/*" element={
                    <ProtectedRoute allowedRole="college">
                        <CollegeDashboard />
                    </ProtectedRoute>
                }>
                    <Route path="students" element={<StudentListByCollege />} />
                    <Route path="add-student" element={<AddStudent />} />
                    <Route path="edit-student" element={<EditStudent />} />
                    <Route path="add-achievement" element={<AddAchievement />} />
                    <Route path="edit-achievement" element={<EditAchievement />} />
                    <Route path="student-detail" element={<StudentDetail />} />
                    <Route path="edit-profile" element={<CollegeEditProfile />} />
                    <Route path="settings" element={<CollegeSettings />} />
                    <Route path="subscribe" element={
                        <ProtectedRoute allowedRole="college">
                            <SubscriptionPage />
                        </ProtectedRoute>
                    } />
                </Route>

                {/* Student Routes */}
                <Route path="/student/dashboard/*" element={
                    <ProtectedRoute allowedRole="student">
                        <StudentDashboard />
                    </ProtectedRoute>
                }>
                    <Route path="achievements" element={<Achievements />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="edit-profile" element={<StudentEdit />} />
                    <Route path="settings" element={<StudentSettings />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
