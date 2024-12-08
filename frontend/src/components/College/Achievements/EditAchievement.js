

import React, {  useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Add React Router for navigation
import { updateAchievement } from '../../../api'; // Adjust the path as needed
import './EditAchievement.css'; // Optional CSS for styling
import { FaTimes } from 'react-icons/fa';

const EditAchievement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { achievement } = location.state; // Get achievement data from location state

    const [editAchievementData, setEditAchievementData] = useState(achievement);

    const handleChangeEdit = (e) => {
        const { name, value, type, checked } = e.target;
        setEditAchievementData({
            ...editAchievementData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    const handleClose = () => {
        navigate(-1); // Go back to the previous page
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAchievement(editAchievementData.id, editAchievementData);
            navigate(-1); 
        } catch (error) {
            console.error('Error updating achievement:', error);
        }
    };

    return (
        <div className="edit-achievement-container">
            <button className="close-icon" onClick={handleClose}>
                <FaTimes />
            </button>
            <h5>Edit Achievement</h5>
            <form onSubmit={handleEditSubmit}>
                <div>
                    <label>Activity Name:</label>
                    <input
                        type="text"
                        name="activityName"
                        value={editAchievementData.activityName}
                        onChange={handleChangeEdit}
                        className='edit-achievement-input'
                        required
                    />
                </div>
                <div>
                    <label>Activity Date:</label>
                    <input
                        type="date"
                        name="activityDate"
                        value={editAchievementData.activityDate}
                        className='edit-achievement-input'
                        onChange={handleChangeEdit}
                    />
                </div>
                <div>
                    <label>Activity Points:</label>
                    <input
                        type="number"
                        name="activitypoints"
                        value={editAchievementData.activitypoints}
                        className='edit-achievement-input'
                        onChange={handleChangeEdit}
                        required
                    />
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="firstPosition"
                            checked={editAchievementData.firstPosition}
                            className='edit-achievement-input'
                            onChange={handleChangeEdit}
                        />
                        First Position
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="secondPosition"
                            checked={editAchievementData.secondPosition}
                            className='edit-achievement-input'
                            onChange={handleChangeEdit}
                        />
                        Second Position
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="thirdPosition"
                            checked={editAchievementData.thirdPosition}
                            className='edit-achievement-input'
                            onChange={handleChangeEdit}
                        />
                        Third Position
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="participation"
                            checked={editAchievementData.participation}
                            className='edit-achievement-input'
                            onChange={handleChangeEdit}
                        />
                        Participation
                    </label>
                </div>
                <button type="submit" className='edit-achievement-submit-button'>Save Changes</button>
            </form>
        </div>
    );
};

export default EditAchievement;
