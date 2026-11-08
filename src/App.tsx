/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { AppProvider } from './store/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ActivityForm } from './components/ActivityForm';
import { Reports } from './components/Reports';
import { Approvals } from './components/Approvals';
import { AdminPanel } from './components/AdminPanel';
import { About } from './components/About';

import { ProfilesList } from './components/ProfilesList';
import { PrivateRoom } from './components/PrivateRoom';
import { PublicComments } from './components/PublicComments';
import { DepartmentsList } from './components/DepartmentsList';
import { ArticlesEditor } from './components/ArticlesEditor';
import { BooksList } from './components/BooksList';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');


  useEffect(() => {
    const handleNavigate = (e: any) => {
      if (e.detail?.tab) setActiveTab(e.detail.tab);
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const renderContent = () => {

    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'add-activity': return <ActivityForm />;
      case 'profiles': return <ProfilesList />;
      case 'departments': return <DepartmentsList onNavigate={(tab) => setActiveTab(tab)} />;
      case 'public-comments': return <PublicComments />;
      case 'room': return <PrivateRoom />;
      case 'reports': return <Reports />;
      case 'approvals': return <Approvals />;
      case 'admin': return <AdminPanel />;
      case 'about': return <About />;
      case 'articles': return <ArticlesEditor />;
      case 'books': return <BooksList />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
