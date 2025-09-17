import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/UseAuth';
import axiosInstance from '../../api/axiosInstance';

function SettingProfile() {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [isEditLoader, setIsEditLoader] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob || '',
                gender: user.gender || '',
                address: user.address || ''
            }));
        }
    }, [user]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        if (profileData.password !== profileData.confirmPassword) {
            showAlert('Passwords do not match!', 'error');
            return;
        }
        showAlert('Password updated successfully!', 'success');

        setProfileData(prev => ({
            ...prev,
            password: '',
            confirmPassword: ''
        }));
        setIsEditLoader(true);
        axiosInstance.post('/me/updatepassword', { password: profileData.password })
            .then(response => {
                const res = response.data;
                if (res.code == 200) {
                    setIsEditing(false);
                    setProfileData(prev => ({
                        ...prev,
                        password: '',
                        confirmPassword: ''
                    }));
                    showAlert(res.message || 'Password changed successfully', 'success');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                let message = errRes.message || 'Something went wrong. Please try again.';
                showAlert(message, 'error');
            })
            .finally(() => {
                setIsEditLoader(false);
            })
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfileData(prev => ({
            ...prev,
            password: '',
            confirmPassword: ''
        }));
    };

    return (
        <div className="settings-section">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Profile Settings</h3>
                    {!isEditing ? (
                        <button
                            onClick={handleEditToggle}
                            disabled={isEditLoader}
                            className={`bg-[#1A2B4D] text-white px-4 py-2 cursor-pointer rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center ${isEditLoader ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isEditLoader ? (
                                <span className="loader w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : null}
                            Change Password
                        </button>
                    ) : (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleCancel}
                                disabled={isEditLoader}
                                className={`bg-gray-100 text-gray-700 px-4 py-2 cursor-pointer rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center ${isEditLoader ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isEditLoader}
                                className={`bg-[#20C997] text-white px-4 py-2 cursor-pointer rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center ${isEditLoader ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isEditLoader ? (
                                    <span className="loader w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <Save className="w-4 h-4 mr-1" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    )}

                </div>

                {/* Personal Information Form */}
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={profileData.firstName}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={profileData.lastName}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={profileData.phone}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={profileData.dob}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                        </label>
                        <input
                            type="text"
                            id="gender"
                            name="gender"
                            value={profileData.gender}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={profileData.address}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {isEditing && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={profileData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A2B4D] focus:border-[#1A2B4D] transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={profileData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A2B4D] focus:border-[#1A2B4D] transition-colors"
                                />
                            </div>
                        </div>
                    )}
                </form>

            </div>
        </div>
    );
}

export default SettingProfile;