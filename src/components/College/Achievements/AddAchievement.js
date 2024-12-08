import React, { useState } from 'react';
import { addAchievement } from '../../../api'; // Ensure to adjust the path to your api.js file
import Papa from 'papaparse'; // Import PapaParse for CSV parsing
import './AddAchievement.css'; // Import the CSS file

const AddAchievement = () => {
    const [studentRollNumber, setStudentRollNumber] = useState('');
    const [achievementData, setAchievementData] = useState({
        activityName: '',
        activityDescription: '',
        activityCategory: '',
        activityDate: '',
        activitypoints: 0,
        firstPosition: false,
        secondPosition: false,
        thirdPosition: false,
        participation: false,
    });
    const [isManual, setIsManual] = useState(true); // State to toggle between manual and CSV
    const [csvData, setCsvData] = useState([]); // State to store parsed CSV data
    const [message, setMessage] = useState(null); // State for messages

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setAchievementData(prevState => ({
                ...prevState,
                // Ensure only one position is checked
                firstPosition: name === 'firstPosition' ? checked : false,
                secondPosition: name === 'secondPosition' ? checked : false,
                thirdPosition: name === 'thirdPosition' ? checked : false,
                participation: name === 'participation' ? checked : false,
            }));
        } else {
            setAchievementData({
                ...achievementData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addAchievement(studentRollNumber, achievementData);
            setStudentRollNumber('');
            setAchievementData({
                activityName: '',
                activityDescription: '',
                activityCategory: '',
                activityDate: '',
                activitypoints: 0,
                firstPosition: false,
                secondPosition: false,
                thirdPosition: false,
                participation: false,
            });
            setMessage({ type: 'success', text: 'Achievement added successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to add achievement. Please try again.' });
            setTimeout(() => setMessage(null), 3000);
        }
    };
    const reformatDate = (dateStr) => {
        if(!dateStr){
            return null;
        }
        console.log(dateStr);
        const trimmedDateStr = dateStr.trim(); 
        const dateParts = trimmedDateStr.split('-');
        const [day, month, year] = dateParts;
        console.log(day, month, year);
        return `${year}-${month}-${day}`; 

    };

    const handleCsvUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            parseCsv(file);
        }
    };

    const parseCsv = (file) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                console.log(results.data, results.achievement);
                const parsedData = results.data.map((achievement) => ({
                    ...achievement,
                    activityDate: reformatDate(achievement.activityDate),
                    firstPosition: achievement.firstPosition === 'TRUE',
                    secondPosition: achievement.secondPosition === 'TRUE',
                    thirdPosition: achievement.thirdPosition === 'TRUE',
                    participation: achievement.participation === 'TRUE',
                }));
                console.log(parsedData);

                setCsvData(parsedData);
                setMessage({ type: 'success', text: 'CSV file parsed successfully. Ready to save achievements.' });
                setTimeout(() => setMessage(null), 3000);
            },
            error: (error) => {
                setMessage({ type: 'error', text: 'Failed to process CSV. Please try again.' });
                setTimeout(() => setMessage(null), 3000);
            }
        });
    };

    const saveAchievementsFromCsv = async () => {
        for (const achievement of csvData) {
            try {
                console.log(achievement.data);
                await addAchievement(achievement.studentRollNumber, achievement);
            } catch (error) {
                console.error('Failed to save achievement:', achievement, error);
            }
        }
        setMessage({ type: 'success', text: 'Achievements added successfully!' });
        setTimeout(() => setMessage(null), 3000);
        setCsvData([]); // Clear CSV data after saving
    };

    const handleToggle = (mode) => {
        setIsManual(mode === 'manual');
    };

    return (
        <div className="add-achievement-form">
            <h3 className="form-title">Add Achievement</h3>
            <div className="toggle-buttons">
                <button type="button" className={isManual ? 'active' : ''} onClick={() => handleToggle('manual')}>Manual Entry</button>
                <button type="button" className={!isManual ? 'active' : ''} onClick={() => handleToggle('csv')}>Upload CSV</button>
            </div>
            <form onSubmit={handleSubmit}>
                {isManual && (
                    <>
                        <div>
                            <label>Student Roll Number:</label>
                            <input
                                type="text"
                                name="studentRollNumber"
                                value={studentRollNumber}
                                onChange={(e) => setStudentRollNumber(e.target.value)}
                                className='achievement-input'
                                required
                            />
                        </div>
                        <div>
                            <label>Activity Name:</label>
                            <input
                                type="text"
                                name="activityName"
                                value={achievementData.activityName}
                                onChange={handleChange}
                                className='achievement-input'
                                required
                            />
                        </div>
                        <div>
                            <label>Activity Description:</label>
                            <textarea
                                name="activityDescription"
                                value={achievementData.activityDescription}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Activity Category:</label>
                            <select
                                name="activityCategory"
                                value={achievementData.activityCategory}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Sports">Sports</option>
                                <option value="Arts">Arts</option>
                                <option value="Academic Clubs">Academic Clubs</option>
                                <option value="Volunteer Work">Volunteer Work/Community Service</option>
                            </select>
                        </div>
                        <div>
                            <label>Activity Date:</label>
                            <input
                                type="date"
                                name="activityDate"
                                value={achievementData.activityDate}
                                onChange={handleChange}
                                className='achievement-input'
                                required
                            />
                        </div>
                        <div>
                            <label>Activity Points:</label>
                            <input
                                type="number"
                                name="activitypoints"
                                value={achievementData.activitypoints}
                                onChange={handleChange}
                                className='achievement-input'
                                required
                            />
                        </div>
                        <div>
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="firstPosition"
                                    className="checkbox"
                                    name="firstPosition"
                                    checked={achievementData.firstPosition}
                                    onChange={handleChange}
                                />
                                <label className="checkbox-label" htmlFor="firstPosition">First Position</label>
                            </div>
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="secondPosition"
                                    className="checkbox"
                                    name="secondPosition"
                                    checked={achievementData.secondPosition}
                                    onChange={handleChange}
                                />
                                <label className="checkbox-label" htmlFor="secondPosition">Second Position</label>
                            </div>
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="thirdPosition"
                                    className="checkbox"
                                    name="thirdPosition"
                                    checked={achievementData.thirdPosition}
                                    onChange={handleChange}
                                />
                                <label className="checkbox-label" htmlFor="thirdPosition">Third Position</label>
                            </div>
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="participation"
                                    className="checkbox"
                                    name="participation"
                                    checked={achievementData.participation}
                                    onChange={handleChange}
                                />
                                <label className="checkbox-label" htmlFor="participation">Participation</label>
                            </div>
                        </div>
                        <button type="submit">Add Achievement</button>
                    </>
                )}

                {!isManual && (
                    <div className="upload-csv">
                        <label>Upload CSV</label>
                        <input type="file" accept=".csv" onChange={handleCsvUpload} />
                        {csvData.length > 0 && (
                            <button type="button" className="save-button" onClick={saveAchievementsFromCsv}>
                                Save Achievements
                            </button>
                        )}
                    </div>
                )}

                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddAchievement;
