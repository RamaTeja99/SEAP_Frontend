import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentsByCollege, deleteStudent, deleteStudentUser } from '../../../api';
import { LiaUserEditSolid } from "react-icons/lia";
import { AiOutlineUserDelete } from "react-icons/ai";
import { BiSolidUserDetail } from "react-icons/bi";
import './StudentListByCollege.css';

const StudentListByCollege = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await getStudentsByCollege();
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, []);

    const handleStudentClick = (student) => {
        navigate('/college/dashboard/student-detail', {
            state: { student },
        });
    };

    const handleEditClick = (student) => {
        navigate('/college/dashboard/edit-student', {
            state: { student },
        });
    };

    const handleDeleteUser = async (studentId) => {
        try {
            await deleteStudentUser(studentId);
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const handleDeleteClick = async (studentId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this student?');
        if (confirmDelete) {
            try {
                await deleteStudent(studentId);
                await handleDeleteUser(studentId);
                setStudents((prevStudents) => prevStudents.filter((student) => student.id !== studentId));
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        }
    };

    const filteredStudents = students.filter(student =>
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="student-list-container">
            <div className="admin-student-list-header">
                <h3>Students</h3>
                <div className="admin-search-bar">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search by roll number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <ul className="student-list">
                {filteredStudents.map((student) => (
                    <li key={student.id} className="student-item">
                        <span className="student-roll" onClick={() => handleStudentClick(student)}>
                            {student.rollNumber}
                        </span>
                        <div className="icon-container">
                            <BiSolidUserDetail onClick={() => handleStudentClick(student)} className="details-icon" />
                            <LiaUserEditSolid onClick={() => handleEditClick(student)} className="edit-icon" />
                            <AiOutlineUserDelete onClick={() => handleDeleteClick(student.id)} className="delete-icon" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentListByCollege;
