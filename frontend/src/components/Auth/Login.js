import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api';
import Background3D from './Background3D';
import { getTokenInfo } from '../../utils/tokenUtils';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errors, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate username and password length
        if (username.length < 8) {
            setError('Username must be exactly 8 characters long.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and include letters, numbers, and symbols.');
            return;
        }

        try {
            const response = await login(username, password);

            if (response.status === 200 && response.data) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('lastActivity', new Date().getTime());

                const tokenInfo = getTokenInfo();
                if (tokenInfo) {
                    switch (tokenInfo.role) {
                        case 'admin':
                            navigate('/admin/dashboard/colleges');
                            break;
                        case 'college':
                            navigate('/college/dashboard/students');
                            break;
                        case 'student':
                            navigate('/student/dashboard/achievements');
                            break;
                        default:
                            break;
                    }
                }
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
            localStorage.removeItem('token');
            localStorage.removeItem('lastActivity');
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <Background3D />
            </div>
            <div className="login-box-wrapper">
                <div className="login-box">
                    <h2>Login</h2>
                    {errors && <div className="error-message">{errors}</div>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <button type="submit" className='login-button'>Login</button>
                    </form>
                </div>
            </div>
            <button onClick={() => navigate("/")} className="back-button">Back</button>
        </div>
    );
};

export default Login;
