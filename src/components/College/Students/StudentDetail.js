import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAchievementsByStudent, deleteAchievement } from '../../../api';
import './StudentDetail.css';
import { FaTimes, FaTrash, FaDownload } from 'react-icons/fa';
import { FiEdit3 } from "react-icons/fi";
import CertificateGenerator from '../Achievements/CertificateGenerator';

const StudentDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const student = location.state.student;
    const [achievements, setAchievements] = useState([]);
    const [showAchievements, setShowAchievements] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await getAchievementsByStudent(student.rollNumber);
                setAchievements(response.data);
            } catch (error) {
                console.error('Error fetching achievements:', error);
            }
        };
        fetchAchievements();
    }, [student.rollNumber]);

    const handleDeleteClick = async (achievementId) => {
        try {
            await deleteAchievement(achievementId);
            setAchievements(achievements.filter((ach) => ach.id !== achievementId));
        } catch (error) {
            console.error('Error deleting achievement:', error);
        }
    };

    const handleEditClick = (achievement) => {
        navigate('/college/dashboard/edit-achievement', {
            state: { achievement },
        });
    };

    const handleClose = () => {
        navigate(-1);
    };

    const handleGenerateCertificate = (achievement) => {
        if (!isGenerating) {
            setIsGenerating(true);
            setSelectedAchievement(achievement);
        }
    };

    const handleGenerationComplete = () => {
        setSelectedAchievement(null);
        setIsGenerating(false);
    };

    return (
        <div className={`student-detail-container ${showAchievements ? 'show-achievements' : ''}`}>
            <button className="close-icon" onClick={handleClose}>
                <FaTimes />
            </button>

            <h4>Details of {student.name}</h4>
            <p>Roll Number: {student.rollNumber}</p>
            <p>Email: {student.email}</p>
            <p>Phone: {student.phoneNumber}</p>
            <p>Branch: {student.branch}</p>
            <p>Degree: {student.degree}</p>
            <p>Degree Year: {student.degreeYear}</p>
            <p>Date of Birth: {new Date(student.dob).toLocaleDateString()}</p>

            <h5 className="achievements-toggle" onClick={() => setShowAchievements(!showAchievements)}>
                {showAchievements ? 'Hide Achievements' : 'Show Achievements'}
            </h5>

            {showAchievements && achievements.length > 0 && (
                <div className="achievements-table-container">
                    <table className="achievements-table">
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Date</th>
                                <th>Points</th>
                                <th>Position</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {achievements.map((achievement) => (
                                <tr key={achievement.id} className="achievement-row">
                                    <td>{achievement.activityName}</td>
                                    <td>{new Date(achievement.activityDate).toLocaleDateString('en-GB', { 
                                        day: 'numeric', 
                                        month: 'long', 
                                        year: 'numeric' 
                                    })}</td>
                                    <td>{achievement.activitypoints}</td>
                                    <td>
                                        {achievement.firstPosition ? 'First Position' :
                                         achievement.secondPosition ? 'Second Position' :
                                         achievement.thirdPosition ? 'Third Position' : 'Participation'}
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleEditClick(achievement)} 
                                            className="icon-button"
                                        >
                                            <FiEdit3 />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(achievement.id)} 
                                            className="delete-icon-button"
                                        >
                                            <FaTrash title="Delete" />
                                        </button>
                                        <button 
                                            onClick={() => handleGenerateCertificate(achievement)} 
                                            className="download-icon-button"
                                            disabled={isGenerating}
                                        >
                                            <FaDownload title="Download Certificate" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedAchievement && (
                <CertificateGenerator 
                    achievement={selectedAchievement}
                    onComplete={handleGenerationComplete}
                />
            )}
        </div>
    );
};

export default StudentDetail;