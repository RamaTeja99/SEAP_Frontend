import React, { useState, useEffect } from 'react';
import { getStudentAchievements } from '../../api';
import './StudentAchievements.css';
import CertificateGenerator from '../College/Achievements/CertificateGenerator';
import { HiOutlineDocumentDownload } from 'react-icons/hi';

const StudentAchievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

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
        <div className="student-achievements">
            <h2>Your Achievements</h2>
            {loading ? (
                <div className="loading-spinner"></div>
            ) : (
                <ul className="achievement-list">
                    {achievements.map((achievement) => (
                        <li key={achievement.id} className="achievement-item">
                            <div className="achievement-content">
                                <h3>Activity: {achievement.activityName}</h3>
                                <p>Date: {new Date(achievement.activityDate).toLocaleDateString()}</p>
                                <p>Category: {achievement.activityCategory}</p>
                                <p>Points: {achievement.activitypoints}</p>
                                <p>Position: {achievement.firstPosition ? 'First' : 
                                           achievement.secondPosition ? 'Second' : 
                                           achievement.thirdPosition ? 'Third' : 'Participation'}</p>
                            </div>
                            <button 
                                onClick={() => handleGenerateCertificate(achievement)} 
                                className="generate-certificate-button"
                                disabled={isGenerating}
                            >
                                <HiOutlineDocumentDownload className='download-icon'/> 
                            </button>
                        </li>
                    ))}
                </ul>
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

export default StudentAchievements;