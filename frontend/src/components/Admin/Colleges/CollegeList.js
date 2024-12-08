import React, { useState, useEffect } from 'react';
import { getColleges, deleteCollege, deleteCollegeUser } from '../../../api';
import EditCollege from './EditCollege';
import { FaUserEdit } from "react-icons/fa";
import { AiOutlineUserDelete } from "react-icons/ai";
import './CollegeList.css';

const CollegeList = () => {
    const [colleges, setColleges] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCollegeId, setSelectedCollegeId] = useState(null);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const response = await getColleges();
                setColleges(response.data);
                
            } catch (error) {
                console.error('Failed to fetch colleges:', error);
            }
        };
        fetchColleges();
    }, []);

    const handleEditClick = (collegeId) => {
        setSelectedCollegeId(collegeId);
        setIsEditing(true);
    };

    const handleDeleteClick = async (collegeId) => {
        if (window.confirm('Are you sure you want to delete this college?')) {
            try {
                deleteCollegeUser(collegeId);
                await deleteCollege(collegeId);
                setColleges(colleges.filter((college) => college.id !== collegeId));
            } catch (error) {
                console.error(`Failed to delete college with ID ${collegeId}:`, error);
            }
        }
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
        setSelectedCollegeId(null);
    };

    return (
        <div className="collegelist-container">
            <div className="collegelist-header">
                <h3 className="collegelist-title">Colleges</h3>
            </div>
            <ul className="collegelist">
                {colleges.map((college) => (
                    <li key={college.id} className="collegelist-item">
                        <div className="collegelist-info">
                            <span className="collegelist-name">{college.name}</span>
                        </div>
                        <div className="collegelist-actions">
                            <button onClick={() => handleEditClick(college.id)} className="collegelist-edit-button"><FaUserEdit className='edit-icon'/></button>
                            <button onClick={() => handleDeleteClick(college.id)} className="collegelist-delete-button"><AiOutlineUserDelete className='delete-icon'/></button>
                        </div>
                    </li>
                ))}
            </ul>
            {isEditing && (
                <EditCollege collegeId={selectedCollegeId} onClose={handleCloseEdit} />
            )}
        </div>
    );
};

export default CollegeList;
