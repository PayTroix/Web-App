/**
 * SettingsContent Component
 * Organization settings management
 */

'use client';

import { useState } from 'react';
import { useOrganizationSettings } from '../_hooks';

export function SettingsContent() {
  const [isEditing, setIsEditing] = useState(false);
  const { isLoading, formData, updateFormField, resetForm, submitUpdate } =
    useOrganizationSettings();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormField(name, value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitUpdate();
      setIsEditing(false);
    } catch (error) {
      // Error already handled in hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-black rounded-lg border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Organization Settings</h1>
            <button
              onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organization Name */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Organization Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Organization Address */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Organization Address</label>
              <input
                type="text"
                name="organization_address"
                value={formData.organization_address || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Phone Number</label>
              <input
                type="tel"
                name="organization_phone"
                value={formData.organization_phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                  transition-colors flex items-center gap-2"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
