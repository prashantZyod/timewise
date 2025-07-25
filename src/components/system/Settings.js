import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  Settings as SettingsIcon, 
  Save,
  Bell,
  Globe,
  Lock,
  Database,
  UserCog,
  Smartphone,
  MailCheck,
  Shield,
  CheckCircle2,
  Clock,
  Mail
} from "lucide-react";

/**
 * Settings component for the system section.
 * This component handles application settings, user preferences, and system configuration.
 */
const Settings = ({ 
  settings = {}, 
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    companyName: settings.companyName || 'ZyOD StaffLogs',
    companyLogo: settings.companyLogo || '',
    language: settings.language || 'english',
    timezone: settings.timezone || 'UTC+0',
    dateFormat: settings.dateFormat || 'MM/DD/YYYY',
    timeFormat: settings.timeFormat || '12h',
    emailNotifications: settings.emailNotifications || true,
    appNotifications: settings.appNotifications || true,
    workHoursStart: settings.workHoursStart || '09:00',
    workHoursEnd: settings.workHoursEnd || '17:00',
    lateArrivalThreshold: settings.lateArrivalThreshold || '15',
    requirePhotoVerification: settings.requirePhotoVerification || true,
    allowRemoteCheckin: settings.allowRemoteCheckin || false,
    autoLogout: settings.autoLogout || '30',
    dataRetention: settings.dataRetention || '365',
    twoFactorAuth: settings.twoFactorAuth || false,
    smtpServer: settings.smtpServer || '',
    smtpPort: settings.smtpPort || '',
    smtpUser: settings.smtpUser || '',
    smtpPassword: settings.smtpPassword || '',
    smtpSender: settings.smtpSender || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  const tabContent = {
    general: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Company Logo</label>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                Choose File
              </Button>
              <span className="text-sm text-slate-500">No file chosen</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="chinese">Chinese</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Timezone</label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="UTC-12">UTC-12</option>
              <option value="UTC-8">UTC-8 (PST)</option>
              <option value="UTC-5">UTC-5 (EST)</option>
              <option value="UTC+0">UTC+0 (GMT)</option>
              <option value="UTC+1">UTC+1 (CET)</option>
              <option value="UTC+5:30">UTC+5:30 (IST)</option>
              <option value="UTC+8">UTC+8 (CST)</option>
              <option value="UTC+12">UTC+12</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Date Format</label>
            <select
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Time Format</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="timeFormat"
                  value="12h"
                  checked={formData.timeFormat === '12h'}
                  onChange={handleChange}
                  className="mr-2"
                />
                12-hour (1:30 PM)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="timeFormat"
                  value="24h"
                  checked={formData.timeFormat === '24h'}
                  onChange={handleChange}
                  className="mr-2"
                />
                24-hour (13:30)
              </label>
            </div>
          </div>
        </div>
      </div>
    ),
    notifications: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Email Notifications</h3>
          
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={formData.emailNotifications}
              onChange={handleChange}
              className="mt-1"
            />
            <div>
              <label htmlFor="emailNotifications" className="text-sm font-medium text-slate-700">
                Enable Email Notifications
              </label>
              <p className="text-xs text-slate-500">
                Receive email notifications for important events
              </p>
            </div>
          </div>
          
          <div className="ml-7 space-y-3">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="lateArrivalEmail"
                name="lateArrivalEmail"
                checked={formData.lateArrivalEmail}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <label htmlFor="lateArrivalEmail" className="text-sm font-medium text-slate-700">
                  Late Arrival Notifications
                </label>
                <p className="text-xs text-slate-500">
                  Notify managers when staff arrive late
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="missedCheckInEmail"
                name="missedCheckInEmail"
                checked={formData.missedCheckInEmail}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <label htmlFor="missedCheckInEmail" className="text-sm font-medium text-slate-700">
                  Missed Check-in Notifications
                </label>
                <p className="text-xs text-slate-500">
                  Notify managers when staff miss check-ins
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="dailySummaryEmail"
                name="dailySummaryEmail"
                checked={formData.dailySummaryEmail}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <label htmlFor="dailySummaryEmail" className="text-sm font-medium text-slate-700">
                  Daily Summary Reports
                </label>
                <p className="text-xs text-slate-500">
                  Receive daily attendance summary reports
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">In-App Notifications</h3>
          
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="appNotifications"
              name="appNotifications"
              checked={formData.appNotifications}
              onChange={handleChange}
              className="mt-1"
            />
            <div>
              <label htmlFor="appNotifications" className="text-sm font-medium text-slate-700">
                Enable In-App Notifications
              </label>
              <p className="text-xs text-slate-500">
                Receive notifications within the application
              </p>
            </div>
          </div>
          
          <div className="ml-7 space-y-3">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="staffCheckInNotify"
                name="staffCheckInNotify"
                checked={formData.staffCheckInNotify}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <label htmlFor="staffCheckInNotify" className="text-sm font-medium text-slate-700">
                  Staff Check-in Notifications
                </label>
                <p className="text-xs text-slate-500">
                  Notify when staff check in or out
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="deviceOfflineNotify"
                name="deviceOfflineNotify"
                checked={formData.deviceOfflineNotify}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <label htmlFor="deviceOfflineNotify" className="text-sm font-medium text-slate-700">
                  Device Offline Alerts
                </label>
                <p className="text-xs text-slate-500">
                  Alert when a device goes offline
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    attendance: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Work Hours Start</label>
            <input
              type="time"
              name="workHoursStart"
              value={formData.workHoursStart}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Work Hours End</label>
            <input
              type="time"
              name="workHoursEnd"
              value={formData.workHoursEnd}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Late Arrival Threshold (minutes)</label>
            <input
              type="number"
              name="lateArrivalThreshold"
              value={formData.lateArrivalThreshold}
              onChange={handleChange}
              min="0"
              max="60"
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="requirePhotoVerification"
              name="requirePhotoVerification"
              checked={formData.requirePhotoVerification}
              onChange={handleChange}
              className="mt-1"
            />
            <div>
              <label htmlFor="requirePhotoVerification" className="text-sm font-medium text-slate-700">
                Require Photo Verification
              </label>
              <p className="text-xs text-slate-500">
                Staff must submit a photo when checking in
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="allowRemoteCheckin"
              name="allowRemoteCheckin"
              checked={formData.allowRemoteCheckin}
              onChange={handleChange}
              className="mt-1"
            />
            <div>
              <label htmlFor="allowRemoteCheckin" className="text-sm font-medium text-slate-700">
                Allow Remote Check-in
              </label>
              <p className="text-xs text-slate-500">
                Staff can check in from remote locations
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    security: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Auto Logout After Inactivity (minutes)</label>
            <input
              type="number"
              name="autoLogout"
              value={formData.autoLogout}
              onChange={handleChange}
              min="1"
              max="120"
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Data Retention Period (days)</label>
            <input
              type="number"
              name="dataRetention"
              value={formData.dataRetention}
              onChange={handleChange}
              min="30"
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="twoFactorAuth"
              name="twoFactorAuth"
              checked={formData.twoFactorAuth}
              onChange={handleChange}
              className="mt-1"
            />
            <div>
              <label htmlFor="twoFactorAuth" className="text-sm font-medium text-slate-700">
                Enable Two-Factor Authentication
              </label>
              <p className="text-xs text-slate-500">
                Require verification code for login
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    email: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">SMTP Server</label>
            <input
              type="text"
              name="smtpServer"
              value={formData.smtpServer}
              onChange={handleChange}
              placeholder="smtp.example.com"
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">SMTP Port</label>
            <input
              type="text"
              name="smtpPort"
              value={formData.smtpPort}
              onChange={handleChange}
              placeholder="587"
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">SMTP Username</label>
            <input
              type="text"
              name="smtpUser"
              value={formData.smtpUser}
              onChange={handleChange}
              placeholder="user@example.com"
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">SMTP Password</label>
            <input
              type="password"
              name="smtpPassword"
              value={formData.smtpPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Sender Email Address</label>
          <input
            type="email"
            name="smtpSender"
            value={formData.smtpSender}
            onChange={handleChange}
            placeholder="noreply@example.com"
            className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Test Email Settings
          </Button>
        </div>
      </div>
    ),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Configure application settings and preferences</p>
        </div>
        <Button 
          onClick={handleSubmit} 
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Card>
        <div className="sm:flex">
          <div className="sm:w-1/4 border-b sm:border-b-0 sm:border-r border-slate-200">
            <div className="p-0">
              <div className="flex flex-col">
                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium border-l-2 ${
                    activeTab === 'general' 
                      ? 'border-l-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-l-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                  }`}
                  onClick={() => setActiveTab('general')}
                >
                  <Globe className="h-5 w-5 mr-3" />
                  General Settings
                </button>

                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium border-l-2 ${
                    activeTab === 'notifications' 
                      ? 'border-l-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-l-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                  }`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="h-5 w-5 mr-3" />
                  Notifications
                </button>

                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium border-l-2 ${
                    activeTab === 'attendance' 
                      ? 'border-l-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-l-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                  }`}
                  onClick={() => setActiveTab('attendance')}
                >
                  <Clock className="h-5 w-5 mr-3" />
                  Attendance Settings
                </button>

                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium border-l-2 ${
                    activeTab === 'security' 
                      ? 'border-l-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-l-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                  }`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Security
                </button>

                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium border-l-2 ${
                    activeTab === 'email' 
                      ? 'border-l-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-l-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                  }`}
                  onClick={() => setActiveTab('email')}
                >
                  <Mail className="h-5 w-5 mr-3" />
                  Email Configuration
                </button>
              </div>
            </div>
          </div>
          <div className="sm:w-3/4 p-6">
            <form onSubmit={handleSubmit}>
              {tabContent[activeTab]}
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
