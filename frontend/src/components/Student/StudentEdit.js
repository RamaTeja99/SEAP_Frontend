import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenInfo } from '../../utils/tokenUtils';
import './StudentEdit.css'; // Import custom CSS
import { getStudentProfile, updateStudentProfile } from '../../api';
import { FaArrowLeft } from 'react-icons/fa';

const StudentEdit = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState({
        name: '',
        rollNumber: '',
        dob: '',
        email: '',
        phoneNumber: '',
        branch: '',
        degree: '',
        degreeYear: '',
        bio: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchStudentDetails();
    }, []);

    const fetchStudentDetails = async () => {
        try {
            const response = await getStudentProfile();
            setStudent(response.data);
        } catch (error) {
            setError('Failed to fetch student details');
            console.error('Error fetching student details:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tokenInfo = getTokenInfo();
            const response = await updateStudentProfile(tokenInfo.roleSpecificId, student);
            
            if (response.data) {
                setSuccess('Profile updated successfully!');
                setError('');
            }
        } catch (error) {
            setError('Failed to update profile');
            setSuccess('');
            console.error('Error updating student:', error);
        }
    };

    return (
        <div className="container">
           
                <h2 className='studentedit-title'>Edit Profile</h2>
            
            <div className="card">
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    
                    <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                <button  onClick={() => navigate('/student/dashboard/achievements')}>
                    <FaArrowLeft /> 
                </button>
            </div>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={student.name}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Roll Number</label>
                            <input
                                type="text"
                                name="rollNumber"
                                value={student.rollNumber}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={student.dob}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={student.email}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={student.phoneNumber}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Branch</label>
                            <input
                                type="text"
                                name="branch"
                                value={student.branch}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Degree</label>
                            <input
                                type="text"
                                name="degree"
                                value={student.degree}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Degree Year</label>
                            <input
                                type="text"
                                name="degreeYear"
                                value={student.degreeYear}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bio</label>
                            <textarea
                                rows={3}
                                name="bio"
                                value={student.bio}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentEdit;
