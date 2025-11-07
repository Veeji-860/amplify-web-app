import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import UserDashboard from './UserDashboard';
import ProfilesApp from './ProfilesApp';
import ErrorBoundary from './ErrorBoundary';

Amplify.configure(awsExports);

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = '#1a1a1a';
  }, []);

  return (
    <ErrorBoundary>
      <Authenticator>
        {({ signOut, user }) => (
          <main style={{background: '#1a1a2e', minHeight: '100vh', fontFamily: 'Arial, sans-serif'}}>
            <div style={{background: '#16213e', padding: '20px'}}>
              <h1 style={{margin: '0', fontSize: '28px', color: '#4fc3f7', textAlign: 'center'}}>🎉 Welcome {user.signInDetails?.loginId?.split('@')[0] || user.username}!</h1>
              <nav style={{margin: '20px 0', display: 'flex', justifyContent: 'center', gap: '10px'}}>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  style={{padding: '10px 20px', backgroundColor: currentView === 'dashboard' ? '#4fc3f7' : '#333', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '14px'}}
                >📊 Dashboard</button>
                <button 
                  onClick={() => setCurrentView('profiles')}
                  style={{padding: '10px 20px', backgroundColor: currentView === 'profiles' ? '#4fc3f7' : '#333', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '14px'}}
                >👤 Profiles</button>
                <button 
                  onClick={signOut}
                  style={{padding: '10px 20px', backgroundColor: '#333', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '14px'}}
                >🚪 Sign out</button>
              </nav>
            </div>
            {currentView === 'dashboard' && <UserDashboard user={user} />}
            {currentView === 'profiles' && <ProfilesApp user={user} />}
          </main>
        )}
      </Authenticator>
    </ErrorBoundary>
  );
}

export default App;