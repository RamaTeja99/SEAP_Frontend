import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { addCollege, addCollegeUser,sendMail } from '../../../api';
import './AddCollege.css';

const AddCollege = () => {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode); // Access theme state
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (username.length < 8) {
            setMessage({ type: 'error', text: 'Username must be exactly 8 characters long.' });
            return;
        }
        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters long and include letters, numbers, and symbols.' });
            return;
        }

        try {
            const college = { name, location, email };
            const response = await addCollege(college);
            if (!response?.data) {
                throw new Error('Failed to create college');
            }
            const savedCollege = response.data;
            const user = { username, password, role: 'college', roleSpecificId: savedCollege.id };
            const userResponse = await addCollegeUser(user);
            if (!userResponse?.data) {
                throw new Error('Failed to create college user');
            }
            try {
                const emailBody = `Your username is ${userResponse.data.username} and password is ${userResponse.data.password}. Please do not share your credentials with anyone. Thanks for using SEA.`;
                await sendMail(
                    savedCollege.email,
                    'College Credentials from SEA',
                    emailBody
                );
                setMessage({ type: 'success', text: 'College added successfully and credentials sent!' });
            } catch (emailError) {
                // If email fails, still consider the operation successful
                console.error('Email sending failed:', emailError);
                setMessage({ type: 'success', text: 'College added successfully! (Email delivery failed)' });
            }
            setMessage({ type: 'success', text: 'College added successfully!' });
            setName('');
            setLocation('');
            setEmail('');
            setUsername('');
            setPassword('');
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to add college. Please try again.' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className={`addcollege-container ${isDarkMode ? 'dark' : 'light'}`}>
            <form onSubmit={handleSubmit} className="addcollege-form">
                <h2 className="addcollege-form-header">Add New College</h2>
                <div className="addcollege-form-group">
                    <label htmlFor="name" className="addcollege-form-label">College Name</label>
                    <input 
                        type="text" 
                        id="name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="addcollege-form-input"
                    />
                </div>
                <div className="addcollege-form-group">
                    <label htmlFor="location" className="addcollege-form-label">Location</label>
                    <input 
                        type="text" 
                        id="location"
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        required 
                        className="addcollege-form-input"
                    />
                </div>
                <div className="addcollege-form-group">
                    <label htmlFor="email" className="addcollege-form-label">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="addcollege-form-input"
                    />
                </div>
                <div className="addcollege-form-group">
                    <label htmlFor="username" className="addcollege-form-label">Username</label>
                    <input 
                        type="text" 
                        id="username"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        className="addcollege-form-input"
                    />
                </div>
                <div className="addcollege-form-group">
                    <label htmlFor="password" className="addcollege-form-label">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="addcollege-form-input"
                    />
                </div>
                <button type="submit" className="addcollege-submit-button">Add College</button>
                {message && (
                    <div className={`addcollege-${message.type}-message`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddCollege;
