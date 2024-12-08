import React, { useState } from 'react';
import Select from 'react-select';
import { addStudent, addStudentUser, sendMail } from '../../../api';
import './AddStudent.css';
import Papa from 'papaparse';

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
        backgroundColor: 'transparent', // Make the control background transparent
        borderRadius: '25px',
        borderStyle: 'none',
        width: '98.5%',
        paddingTop:'0rem',
        boxShadow: state.isFocused ? '0 0 5px #e94560' : 'none',
        transition: 'all 0.3s ease',
        color: 'var(--college-text)',
        border: '1px  var(--college-content-color)',
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
        backgroundColor: 'var(--college-primary-color)', // Dropdown menu background
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


const AddStudent = () => {
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [degree, setDegree] = useState(null);
    const [degreeYear, setDegreeYear] = useState('');
    const [branch, setBranch] = useState(null);
    const [message, setMessage] = useState(null);
    const [isManual, setIsManual] = useState(true);
    const [csvData, setCsvData] = useState([]); // State to store parsed CSV data

    const handleDegreeChange = (selectedDegree) => {
        setDegree(selectedDegree);
        setBranch(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const student = {
                name,
                rollNumber,
                dob,
                email,
                phoneNumber,
                degree: degree.value,
                degreeYear,
                branch: branch.value,
            };
            const response = await addStudent(student);
            const savedStudent = response.data;
            const nameParts = name.trim().split(' ');
            let passwordBase = '';
    
            for (const part of nameParts) {
                if (passwordBase.length < 2) {
                    passwordBase += part; 
                } else {
                    break; 
                }
            }
    
            
            while (passwordBase.length < 2 && nameParts.length) {
                passwordBase += nameParts.shift(); 
            }
    
            const rollNumberDigits = rollNumber.slice(-5);
            const password = `${passwordBase}${rollNumberDigits}@`;
            
            const user = {
                username: rollNumber,
                password: password,
                role: 'student',
                roleSpecificId: savedStudent.id,
            };

            const userResponse = await addStudentUser(user);
            setMessage({ type: 'success', text: 'Student added successfully!' });
            try {
                const emailBody = `Hello ${response.data.name},\n\nWelcome to our platform!\nYour credentials are:\n  Username: ${userResponse.data.username}\n  Password: ${userResponse.data.password}\n\nThank you.`;
                await sendMail(response.data.email, 'Your Student Credentials', emailBody);
                setMessage({ type: 'success', text: 'Student added successfully and email sent!' });
            } catch {
                setMessage({ type: 'success', text: 'Student added successfully! (Email delivery failed)' });
            }

            // Reset form fields
            setName('');
            setRollNumber('');
            setDob('');
            setEmail('');
            setPhoneNumber('');
            setDegree(null);
            setDegreeYear('');
            setBranch(null);
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to add student. Please try again.' });
            setTimeout(() => setMessage(null), 3000);
        }
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
                setCsvData(results.data); // Store parsed data in state
                setMessage({ type: 'success', text: 'CSV file parsed successfully. Ready to save students.' });
                setTimeout(() => setMessage(null), 3000);
            },
            error: (error) => {
                setMessage({ type: 'error', text: 'Failed to process CSV. Please try again.' });
                setTimeout(() => setMessage(null), 3000);
            }
        });
    };

    const saveStudentsFromCsv = async () => {
        for (const studentData of csvData) {
            try {
                const response = await addStudent(studentData);
                const savedStudent = response.data;

                const rollNumberDigits = studentData.rollNumber.slice(-5);
                const password = `${studentData.name}${rollNumberDigits}@`;

                const user = {
                    username: studentData.rollNumber,
                    password: password,
                    role: 'student',
                    roleSpecificId: savedStudent.id,
                };

                const userResponse = await addStudentUser(user);
                try {
                    const emailBody = `Hello ${response.data.name},\n\nWelcome to our platform! \nYour credentials are: \n  Username: ${userResponse.data.username}\n  Password: ${userResponse.data.password}\n\nThank you.`;
                    await sendMail(response.data.email, 'Your Student Credentials', emailBody);
                    setMessage({ type: 'success', text: 'Student added successfully and email sent!' });
                } catch {
                    setMessage({ type: 'success', text: 'Student added successfully! (Email delivery failed)' });
                }
    
            } catch (error) {
                console.error('Failed to save student:', studentData, error);
            }
        }
        setMessage({ type: 'success', text: 'Students added successfully!' });
        setTimeout(() => setMessage(null), 3000);
        setCsvData([]); // Clear CSV data after saving
    };

    const filteredBranchOptions = degree ? branchOptionsMap[degree.value] : [];

    const handleToggle = (mode) => {
        setIsManual(mode === 'manual');
    };

    return (
        <form className="add-student-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Add New Student</h2>
            <div className="toggle-buttons">
                <button type="button" className={isManual ? 'active' : ''} onClick={() => handleToggle('manual')}>Manual Entry</button>
                <button type="button" className={!isManual ? 'active' : ''} onClick={() => handleToggle('csv')}>Upload CSV</button>
            </div>

            {isManual && (
                <>
                    {/* Manual entry form fields */}
                    <label>Student Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label>Roll Number</label>
                    <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />

                    <label>Date of Birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />

                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label>Phone Number</label>
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />

                    <label>Degree</label>
                    <Select
                        className="custom-select"
                        options={degreeOptions}
                        value={degree}
                        onChange={handleDegreeChange}
                        isSearchable
                        placeholder="Select Degree"
                        required
                        styles={customSelectStyles}
                    />

                    <label>Degree Year</label>
                    <input type="text" value={degreeYear} onChange={(e) => setDegreeYear(e.target.value)} required />

                    <label>Branch</label>
                    <Select
                        className="custom-select"
                        options={filteredBranchOptions}
                        value={branch}
                        onChange={(selectedOption) => setBranch(selectedOption)}
                        isSearchable
                        placeholder="Select Branch"
                        required
                        styles={customSelectStyles}
                    />

                    <button type="submit" className="submit-button">Add Student</button>
                </>
            )}

            {!isManual && (
                <div className="upload-csv">
                    <label>Upload CSV</label>
                    <input type="file" accept=".csv" onChange={handleCsvUpload} />
                    {csvData.length > 0 && (
                        <button type="button" className="save-button" onClick={saveStudentsFromCsv}>
                            Save Students
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
    );
};

export default AddStudent;
