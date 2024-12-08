import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './CertificateGenerator.css';
import certificateImage from './image1.png';
import { getTokenInfo } from '../../../utils/tokenUtils'; // Utility to fetch token info

const CertificateGenerator = ({ achievement, onComplete }) => {
    const navigate = useNavigate();
    const tokenInfo = getTokenInfo(); // Get token info

    const generateCertificate = useCallback(() => {
        try {
            // Check if the college is premium or not
            if (tokenInfo.role === 'college') {
                const collegeIsPremium = achievement.student.college.premium; // Check if the college is premium
                console.log(achievement);
                if (!collegeIsPremium) {
                    // If the college is not premium, redirect to subscription page
                    navigate('/college/dashboard/subscribe');
                    return;
                }
            }

            if (tokenInfo.role === 'student') {
                // If the user is a student, show an alert
                alert('Please contact your college for generating the certificate.');
                return;
            }

            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            // Fill main content area with certificate background image
            doc.addImage(certificateImage, 'PNG', 5, 5, pageWidth - 11, pageHeight - 11, '', 'FAST');

            // Title (optional, if required)
            // doc.setFontSize(26);
            // doc.setFont('roman', 'bold');
            // doc.text('CERTIFICATE OF ACHIEVEMENT', (pageWidth / 2), 65, { align: 'center' });

            // Student Name
            doc.setFontSize(50);
            doc.setTextColor(128, 128, 128);
            doc.setFont('times', 'bold');
            doc.text(achievement.student.name, pageWidth / 2, 115, { align: 'center' });

            // Achievement Type (Participation, First Position, etc.)
            let certificateType = 'Participation';
            if (achievement.firstPosition) certificateType = 'First Position';
            else if (achievement.secondPosition) certificateType = 'Second Position';
            else if (achievement.thirdPosition) certificateType = 'Third Position';

            // Achievement Details
            doc.setFontSize(12);
            doc.setFont('normal', 'normal');
            doc.text(
                `This certificate is awarded for the successful completion of ${achievement.activityName} Activity on ${new Date(achievement.activityDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}.`,
                pageWidth / 2,
                125,
                { align: 'center' }
            );
            doc.text(
                `The accomplishment demonstrated in this activity was ${achievement.activityDescription}.`,
                pageWidth / 2,
                135,
                { align: 'center' }
            );
            doc.text(
                `This certificate, awarded for ${certificateType} recognition, acknowledges the continuous dedication to excellence.`,
                pageWidth / 2,
                130,
                { align: 'center' }
            );
            doc.text(
                `It also acknowledges their significant contributions to ${achievement.activityCategory} Activities at ${achievement.student.college.name}.`,
                pageWidth / 2,
                140,
                { align: 'center' }
            );

            // Save PDF
            const fileName = `${achievement.student.name}_${achievement.activityName.replace(/\s+/g, '_')}_Certificate.pdf`;
            doc.save(fileName);

            if (onComplete) {
                setTimeout(onComplete, 100);
            }
        } catch (error) {
            console.error('Error generating certificate:', error);
            if (onComplete) {
                onComplete();
            }
        }
    }, [achievement, tokenInfo, onComplete, navigate]);

    useEffect(() => {
        if (achievement) {
            const timeoutId = setTimeout(generateCertificate, 100); // Delay the generation to ensure the logo is loaded
            return () => clearTimeout(timeoutId);
        }
    }, [achievement, generateCertificate]);

    return null;
};

export default CertificateGenerator;
