import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateStudent } from '../../../api';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import './EditStudent.css';
const degreeOptions = [
    { value: 'BSc', label: 'Bachelor of Science (BSc)' },
    { value: 'BA', label: 'Bachelor of Arts (BA)' },
    { value: 'BCom', label: 'Bachelor of Commerce (BCom)' },
    { value: 'BTech', label: 'Bachelor of Technology (BTech)' },
    { value: 'MSc', label: 'Master of Science (MSc)' },
    { value: 'MA', label: 'Master of Arts (MA)' },
    { value: 'MCom', label: 'Master of Commerce (MCom)' },
    { value: 'MTech', label: 'Master of Technology (MTech)' },
];

const branchOptionsMap = {
    BSc: [
        { value: 'CS', label: 'Computer Science' },
        { value: 'Bio', label: 'Biology' },
        { value: 'Chem', label: 'Chemistry' },
        { value: 'Phy', label: 'Physics' },
    ],
    BA: [
        { value: 'Eng', label: 'English' },
        { value: 'Hist', label: 'History' },
        { value: 'Psy', label: 'Psychology' },
    ],
    BCom: [
        { value: 'Acct', label: 'Accounting' },
        { value: 'Fin', label: 'Finance' },
        { value: 'Econ', label: 'Economics' },
    ],
    BTech: [
        { value: 'CS', label: 'Computer Science Engineering' },
        { value: 'ECE', label: 'Electronics and Communication Engineering' },
        { value: 'ME', label: 'Mechanical Engineering' },
        { value: 'CE', label: 'Civil Engineering' },
    ],
    MSc: [
        { value: 'CS', label: 'Computer Science' },
        { value: 'Bio', label: 'Biology' },
        { value: 'Chem', label: 'Chemistry' },
        { value: 'Phy', label: 'Physics' },
    ],
    MA: [
        { value: 'Eng', label: 'English' },
        { value: 'Hist', label: 'History' },
        { value: 'Psy', label: 'Psychology' },
    ],
    MCom: [
        { value: 'Acct', label: 'Accounting' },
        { value: 'Fin', label: 'Finance' },
        { value: 'Econ', label: 'Economics' },
    ],
    MTech: [
        { value: 'CS', label: 'Computer Science Engineering' },
        { value: 'ECE', label: 'Electronics and Communication Engineering' },
        { value: 'ME', label: 'Mechanical Engineering' },
        { value: 'CE', label: 'Civil Engineering' },
    ],
};
const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: 'var(--college-background-color)', // Make the control background transparent
        borderRadius: '25px',
        width: '100% ',
        border: '2px solid var(--college-background-colors)',
        boxShadow: state.isFocused ? '0 0 5px #e94560' : 'none',
        transition: 'all 0.3s ease',
        color: '#e94560',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight hover effect
        },
    }),
    singleValue: (base) => ({
        ...base,
        color: 'var(--college-text)', // Set single value text color
    }),
    placeholder: (base) => ({
        ...base,
        color: 'rgba(233, 69, 96, 0.7)', // Placeholder text color
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? '#e94560' : 'transparent', // Selected option background
        color: state.isSelected ? '#1a1a2e' : '#e94560', // Selected option text color
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ff6b6b', // Hover option background
            color: '#1a1a2e', // Hover option text color
        },
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: 'var(--college-secondary-color)', // Dropdown menu background
        borderRadius: '15px',
        marginTop: '0.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    }),
    menuList: (base) => ({
        ...base,
        padding: '0',
    }),
    // Additional styles to hide unwanted elements
    container: (base) => ({
        ...base,
        backgroundColor: 'transparent', // Make the container background transparent
    }),
};

// You may also add this CSS to your stylesheet if necessary
// .css-b62m3t-container, .css-1f43avz-a11yText-A11yText {
//     background-color: transparent !important;
//     display: none; // You can hide these elements if they are not needed
// }


const EditStudent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const student = location.state.student;

    const [name, setName] = useState(student.name);
    const [rollNumber, setRollNumber] = useState(student.rollNumber);
    const [dob, setDob] = useState(student.dob);
    const [email, setEmail] = useState(student.email);
    const [phoneNumber, setPhoneNumber] = useState(student.phoneNumber);
    const [degree, setDegree] = useState(student.degree ? { value: student.degree, label: student.degree } : null);
    const [degreeYear, setDegreeYear] = useState(student.degreeYear || '');
    const [branch, setBranch] = useState(student.branch ? { value: student.branch, label: student.branch } : null);
    const [message, setMessage] = useState(null);

    const handleDegreeChange = (selectedDegree) => {
        setDegree(selectedDegree);
        setBranch(null); // Reset branch when degree changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedStudent = {
                ...student,
                name,
                rollNumber,
                dob,
                email,
                phoneNumber,
                degree: degree.value,
                degreeYear,
                branch: branch.value,
            };
            await updateStudent(student.id, updatedStudent);
            setMessage({ type: 'success', text: 'Student updated successfully!' });
            setTimeout(() => navigate('/college/dashboard/students'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update student. Please try again.' });
        }
    };

    const handleClose = () => {
        navigate(-1); // Go back to the previous page
    };

    // Filter branch options based on selected degree
    const filteredBranchOptions = degree ? branchOptionsMap[degree.value] : [];

    return (
        <form className="edit-student-form" onSubmit={handleSubmit}>
            <button className="close-icon" onClick={handleClose}>
                <FaTimes />
            </button>
            <h5>Edit Student</h5>

            <div className="edit-form-group">
                <label htmlFor="name">Student Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" "
                    required
                />
            </div>

            <div className="edit-form-group">
                <label htmlFor="rollNumber">Roll Number</label>
                <input
                    type="text"
                    id="rollNumber"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder=" "
                    required
                />
            </div>

            <div className="edit-form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                />
            </div>

            <div className="edit-form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    required
                />
            </div>

            <div className="edit-form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder=" "
                    required
                />
            </div>

            <div className="edit-form-group">
                <label htmlFor="degree">Degree</label>
                <Select
                    id="degree"
                    options={degreeOptions}
                    value={degree}
                    onChange={handleDegreeChange}
                    isSearchable
                    placeholder="Select Degree"
                    styles={customSelectStyles}
                    required
                />
            </div>

            <div className="edit-form-group">
                <label htmlFor="degreeYear">Degree Year</label>
                <input
                    type="text"
                    id="degreeYear"
                    value={degreeYear}
                    onChange={(e) => setDegreeYear(e.target.value)}
                    placeholder=" "
                    required
                />
            </div>

            <div className="edit-form-group">
                <label htmlFor="branch">Branch</label>
                <Select
                    id="branch"
                    options={filteredBranchOptions}
                    value={branch}
                    onChange={(selectedOption) => setBranch(selectedOption)}
                    isSearchable
                    placeholder="Select Branch"
                    styles={customSelectStyles}
                    required
                    isDisabled={!degree} // Disable if no degree is selected
                />
            </div>

            <button type="submit" className="submit-button">Update Student</button>

            {message && <div className={`${message.type}-message`}>{message.text}</div>}
        </form>
    );
};

export default EditStudent;
