// Add a new utility file for token handling
import { jwtDecode } from 'jwt-decode';

export const getTokenInfo = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const decoded = jwtDecode(token);
        return {
            username: decoded.sub,
            role: decoded.role,
            roleSpecificId: decoded.roleSpecificId,
            exp: decoded.exp
        };
    } catch (error) {
        localStorage.removeItem('token');
        return null;
    }
};

