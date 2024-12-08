import React, { useState, useEffect } from 'react';
import { getStudents } from '../../../api'; // Adjust the import path as necessary
import './StudentList.css'; // Ensure this path is correct

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayCount, setDisplayCount] = useState(12);
    const [expandedStudent, setExpandedStudent] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await getStudents();
                setStudents(response.data);
            } catch (error) {
                console.error('Failed to fetch students:', error);
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedStudents = filteredStudents.slice(0, displayCount);

    const loadMore = () => {
        setDisplayCount(prevCount => prevCount + 12);
    };

    const toggleExpand = (student) => {
        if (expandedStudent === student.id) {
            setExpandedStudent(null); // Collapse if the same student is clicked
        } else {
            setExpandedStudent(student.id); // Expand the selected student
        }
    };

    return (
        <div className="admin-student-list-container">
            <div className="admin-student-list-header">
                <h3>Students</h3>
                <div className="admin-search-bar">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <table className="admin-student-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Degree</th>
                        <th>College</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedStudents.map((student) => (
                        <React.Fragment key={student.id}>
                            <tr className="admin-student-row" onClick={() => toggleExpand(student)}>
                                <td>{student.name}</td>
                                <td>{student.rollNumber}</td>
                                <td>{student.degree}</td>
                                <td>{student.college ? student.college.name : 'N/A'}</td>
                            </tr>
                            {expandedStudent === student.id && (
                                <tr className="admin-student-details">
                                    <td colSpan="4">
                                        <div className="admin-student-detail-content">
                                            <p><strong>Email:</strong> {student.email}</p>
                                            <p><strong>Phone Number:</strong> {student.phoneNumber}</p>
                                            <p><strong>Date of Birth:</strong> {student.dob}</p>
                                            <p><strong>Branch:</strong> {student.branch}</p>
                                            <p><strong>Bio:</strong> {student.bio}</p>
                                            <p><strong>Degree Year:</strong> {student.degreeYear}</p>
                                            <p><strong>College Location:</strong> {student.college ? student.college.location : 'N/A'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {displayCount < filteredStudents.length && (
                <button className="admin-load-more" onClick={loadMore}>
                    Load More
                </button>
            )}
        </div>
    );
};

export default StudentList;
