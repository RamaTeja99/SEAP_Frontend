import axios from 'axios';
import { getTokenInfo } from './utils/tokenUtils';



const API_URL = 'http://localhost:8080/api'; 
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('lastActivity');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { username, password });
        return response;
    } catch (error) {
        console.error('API error:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/logout`);
        return response;
    } catch (error) {
        console.error('API error during logout:', error);
        throw error;
    }
};
export const sendMail = async (to, subject, text) => {
    try {
        const response = await axios.post(`${API_URL}/mail/send`, { to, subject, text });
        return response;
    } catch (error) {
        console.error('API error during logout:', error);
        throw error;
    }
};

export const getColleges = async () => {
    return await axios.get(`${API_URL}/admin/colleges`);
};

export const getCollegeById = async (collegeId) => {
    return await axios.get(`${API_URL}/admin/colleges/${collegeId}`);
};

export const getCollegeUserByCollegeId = async (collegeId) => {
    return await axios.get(`${API_URL}/admin/college-user/${collegeId}`);
};

export const addCollege = async (college) => {
    return await axios.post(`${API_URL}/admin/colleges`, college);
};

export const addCollegeUser = async (user) => {
    return await axios.post(`${API_URL}/admin/addcollegeuser`, user);
};

export const updateCollege = async (collegeId, college) => {
    return await axios.put(`${API_URL}/admin/colleges/${collegeId}`, college);
};
export const updateCollegeCredentials = async (collegeId, newUsername, newPassword) => {
    return await axios.put(`${API_URL}/admin/update-college-credentials/${collegeId}`, null, {
        params: {
            newUsername,
            newPassword,
        },
    });
};

export const deleteCollege = async (id) => {
    return await axios.delete(`${API_URL}/admin/colleges/${id}`);
};

export const deleteCollegeUser = async (id) => {
    return await axios.delete(`${API_URL}/admin/collegesuser/${id}`);
}


export const getAllAchievements = async () => {
    return await axios.get(`${API_URL}/admin/achievements`);
};
export const getStudents = async () => {
    return await axios.get(`${API_URL}/admin/students`);
};
export const getStudentsByCollege = async () => {
    const tokenInfo = getTokenInfo();
    let collegeId = null;
    if(tokenInfo && tokenInfo.role === 'college') {
        collegeId = tokenInfo.roleSpecificId;
    }
    return await axios.get(`${API_URL}/colleges/${collegeId}/students`);
};

export const addStudent = async (student) => {
    const tokenInfo = getTokenInfo();
    const collegeId = tokenInfo.roleSpecificId;
    return await axios.post(`${API_URL}/colleges/${collegeId}/students`, student);
};

export const addStudentUser = async (user) => {
    return await axios.post(`${API_URL}/colleges/addstudentuser`, user);
};

export const addAchievement = async (rollNumber, achievement) => {
    return await axios.post(`${API_URL}/colleges/students/${rollNumber}/achievements/add`, achievement); // Corrected line
};
export const getAchievementsByStudent = async (rollNumber) => {
    return await axios.get(`${API_URL}/colleges/students/${rollNumber}/achievements`);
};
export const updateStudent = async (id, student) => {
    return await axios.put(`${API_URL}/colleges/students/${id}`, student);
};

export const deleteStudent = async (id) => {
    return await axios.delete(`${API_URL}/colleges/students/${id}`);
};
export const deleteStudentUser = async (id) => {
    return await axios.delete(`${API_URL}/colleges/studentsuser/${id}`);
}
export const updateAchievement = async (achievementId, updatedAchievement) => {
    return await axios.put(`${API_URL}/colleges/achievements/update/${achievementId}`, updatedAchievement);
};

export const deleteAchievement = async (achievementId) => {
    return await axios.delete(`${API_URL}/colleges/achievements/delete/${achievementId}`);
};

export const getStudentAchievements = async () => {
    const tokenInfo = getTokenInfo();
    let studentId = null;
    if(tokenInfo && tokenInfo.role === 'student') {
        studentId = tokenInfo.roleSpecificId;
        
    }
    return await axios.get(`${API_URL}/students/${studentId}/achievements`);
};
export const getStudentProfile = async () => {
    const tokenInfo = getTokenInfo();
    let studentId = null;
    if(tokenInfo && tokenInfo.role === 'student') {
        studentId = tokenInfo.roleSpecificId;
    }
    return await axios.get(`${API_URL}/students/${studentId}`);
};

export const updateStudentProfile = async (studentId, studentData) => {
    return await axios.put(`${API_URL}/students/${studentId}`, studentData);
};



export const verifyUserPassword = async (credentials) => {
    return await axios.post(`${API_URL}/auth/verify-password`, credentials);
};
export const updateStudentPassword = async (studentId, newPassword) => {
    return await axios.put(`${API_URL}/auth/update-student-password/${studentId}`, 
        { newPassword }); 
    };
export const updateCollegeUserPassword = async (collegeId, newPassword) => {
    return await axios.put(`${API_URL}/auth/update-college-password/${collegeId}`, 
    { newPassword }); 
};
export const updateAdminUserPassword = async (adminId, newPassword) => {
    return await axios.put(`${API_URL}/auth/update-admin-password/${adminId}`, 
    { newPassword }); 
};

export const updateStudentProfilePhoto = async (studentId, formData) => {
    return await axios.post(`${API_URL}/auth/update-student-profile-photo/${studentId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateCollegeUserProfilePhoto = async (collegeId, formData) => {
    return await axios.post(`${API_URL}/auth/update-college-profile-photo/${collegeId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const updateAdminUserProfilePhoto = async (adminId, formData) => {
    return await axios.post(`${API_URL}/auth/update-admin-profile-photo/${adminId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const getStudentProfilePhoto = async (studentId) => {
    return await axios.get(`${API_URL}/auth/get-student-profile-photo/${studentId}`, {
        responseType: 'blob', // Ensure the response is in blob format
    });
};

export const getCollegeProfilePhoto = async (collegeId) => {
    return await axios.get(`${API_URL}/auth/get-college-profile-photo/${collegeId}`, {
        responseType: 'blob', // Ensure the response is in blob format
    });
};
export const getAdminProfilePhoto = async (adminId) => {
    return await axios.get(`${API_URL}/auth/get-admin-profile-photo/${adminId}`, {
        responseType: 'blob', // Ensure the response is in blob format
    });
};


export const fetchCollegeCount = async () => {
    return await axios.get(`${API_URL}/admin/colleges/count`);
};

export const fetchStudentCount = async () => {
    return await axios.get(`${API_URL}/admin/students/count`);
};

export const fetchAchievementCount = async () => {
    return await axios.get(`${API_URL}/admin/achievements/count`);
};