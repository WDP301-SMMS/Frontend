import React, { useState, Suspense } from 'react';


import Sidebar from './Sidebar';
const UserInfo = React.lazy(() => import('./UserInfo'));
const Chat = React.lazy(() => import('./Chat'));
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[600px]">
        <p className="text-gray-500">Loading component...</p>
    </div>
  );
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('userInfo'); 

  const [formData, setFormData] = useState({
    fullName: "Alexa Rawles",
    nickName: "Alexa",
    gender: "Female",
    country: "USA",
    language: "English (US)",
    timeZone: "(GMT-7:00) Mountain Time (US & Canada)",
    email: "alexarawles@gmail.com",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'userInfo':
        return <UserInfo formData={formData} handleInputChange={handleInputChange} />;
      case 'chat':
        return <Chat />;
      default:
        return <UserInfo formData={formData} handleInputChange={handleInputChange} />;
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">
        <Suspense fallback={<LoadingFallback />}>
          {renderContent()}
        </Suspense>
      </main>
    </div>
  );
}