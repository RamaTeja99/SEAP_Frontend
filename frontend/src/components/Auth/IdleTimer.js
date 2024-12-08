import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import IdleWarningModal from './IdleWarningModel';

const IdleTimer = () => {
    const navigate = useNavigate();
    const idleTimeout = useRef(null);
    const warningTimeout = useRef(null);
    const [showWarning, setShowWarning] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    
    const IDLE_TIME = 30 * 60 * 1000; // 30 minutes
    const WARNING_TIME = 1 * 60 * 1000; // 1 minute warning

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('lastActivity');
        navigate('/login');
    }, [navigate]);

    const resetTimer = useCallback(() => {
        if (idleTimeout.current) clearTimeout(idleTimeout.current);
        if (warningTimeout.current) clearTimeout(warningTimeout.current);
        setShowWarning(false);

        localStorage.setItem('lastActivity', new Date().getTime());

        warningTimeout.current = setTimeout(() => {
            setShowWarning(true);
            setRemainingTime(WARNING_TIME);

            const countdownInterval = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 1000) {
                        clearInterval(countdownInterval);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);

            idleTimeout.current = setTimeout(logout, WARNING_TIME);
        }, IDLE_TIME - WARNING_TIME);
    }, [logout,WARNING_TIME,IDLE_TIME]); // Add logout and WARNING_TIME as dependencies

    useEffect(() => {
        const events = [
            'mousemove',
            'keydown',
            'mousedown',
            'touchstart',
            'scroll',
            'click'
        ];

        events.forEach(event => {
            document.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            if (idleTimeout.current) clearTimeout(idleTimeout.current);
            if (warningTimeout.current) clearTimeout(warningTimeout.current);
            events.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [resetTimer]); // Include resetTimer in dependencies

    return (
        <>
            {showWarning && (
                <IdleWarningModal
                    remainingTime={remainingTime}
                    onLogout={logout}
                />
            )}
        </>
    );
};

export default IdleTimer;
