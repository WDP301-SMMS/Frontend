

// Main App.jsx (phần còn thiếu)
import React, { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { TabNavigation } from './TabNavigation';
import { SummaryCards } from './SummaryCards';
import { BoosterNotificationsTable } from './BoosterNotificationsTable';
import { RoleSelector } from './common/RoleSelector';
import { SearchAndFilter } from './common/SearchAndFilter';
import { mockData } from '../../libs/utils/common';
import { VaccinationRecordCard } from './VaccinationRecordCard';
import  "./vaccinHistoryManagement.css"

const VaccinationManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('vaccination-management');
  const [activeTab, setActiveTab] = useState('auto-check');
  const [selectedRole, setSelectedRole] = useState('nurse');
  const [notifications, setNotifications] = useState(mockData.boosterNotifications);

  const sendNotification = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, notificationSent: true }
          : notification
      )
    );
  };

  const exportReport = () => {
    console.log('Exporting vaccination report...');
    // Implement export functionality here
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 bg-7dc7ff">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header exportReport={exportReport} />

        {/* Tab Navigation */}
        {activeMenuItem === 'vaccination-management' && (
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeMenuItem === 'vaccination-management' && (
            <>
              {activeTab === 'auto-check' && (
                <>
                  <SummaryCards boosterNotifications={notifications} />
                  <BoosterNotificationsTable 
                    notifications={notifications}
                    sendNotification={sendNotification}
                  />
                </>
              )}

              {activeTab === 'view-records' && (
                <>
                  <RoleSelector 
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                  />
                  <SearchAndFilter />
                  {mockData.vaccinationRecords.map(record => (
                    <VaccinationRecordCard key={record.id} record={record} />
                  ))}
                </>
              )}
            </>
          )}

          {/* Placeholder for other menu items */}
          {activeMenuItem !== 'vaccination-management' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {mockData.menuItems.find(item => item.id === activeMenuItem)?.label}
              </h2>
              <p className="text-gray-600">
                This section is under development. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccinationManagement;