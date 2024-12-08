import React, { useState } from 'react';
import { getTokenInfo } from '../../utils/tokenUtils';
import { updateCollegeUserProfilePhoto } from '../../api';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CollegeEditProfile.css';

const CollegeEditProfile = () => {
  const navigate = useNavigate();
  const tokenInfo = getTokenInfo();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleUploadPhoto = async () => {
    if (profilePhoto) {
      const formData = new FormData();
      formData.append("photo", profilePhoto);
      formData.append("username", tokenInfo.username);
      setIsLoading(true);
      try {
        const response = await updateCollegeUserProfilePhoto(tokenInfo.roleSpecificId, formData);
        if (response.status === 201) {
          setMessage("Profile photo updated successfully.");
        } else {
          setMessage("Error updating profile photo. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
        setMessage("Error updating profile photo. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessage("Please select a photo before uploading.");
    }
  };

  return (
    <div className="photo-upload-container">
      <div className="back">
        <button onClick={() => navigate('/college/dashboard/students')}>
          <FaArrowLeft />
        </button>
      </div>
      <h2>Change Profile Photo</h2>
      <div className="photo-preview">
        {profilePhoto ? (
          <img src={URL.createObjectURL(profilePhoto)} alt="Preview" />
        ) : (
          <div className="placeholder">No image selected</div>
        )}
      </div>
      <div className="button-group">
        <label className="file-input-label">
          Choose Photo
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            hidden
          />
        </label>
        <motion.button
          onClick={handleUploadPhoto}
          className="primary-button"
          disabled={!profilePhoto || isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Photo'}
        </motion.button>
      </div>
      {message && (
        <div className={`message-toast ${message.includes('successfully') ? 'success' : 'info'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CollegeEditProfile;
