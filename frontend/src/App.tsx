import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Layout } from './components/common/Layout';
import { HomePage } from './pages/home/HomePage';
import { InterviewPage } from './pages/interview/InterviewPage';
import { ResultsPage } from './pages/results/ResultsPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { NotFoundPage } from './components/common/NotFoundPage';
import './App.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              {/* Home/Landing Page */}
              <Route path="/" element={<HomePage />} />
              
              {/* Dashboard - Overview of user's progress */}
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Interview Flow */}
              <Route path="/interview" element={<InterviewPage />} />
              <Route path="/interview/:sessionId" element={<InterviewPage />} />
              
              {/* Results and Analytics */}
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/results/:submissionId" element={<ResultsPage />} />
              
              {/* 404 Page */}
              <Route path="/404" element={<NotFoundPage />} />
              
              {/* Redirect unknown routes to 404 */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;