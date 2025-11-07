import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listUsers } from './graphql/queries';
import { createUser } from './graphql/mutations';

const client = generateClient();

function UserDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState({ username: '', fullName: '', bio: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
    saveUser();
  }, [user]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [users]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await client.graphql({ query: listUsers });
      const userList = userData.data.listUsers.items || [];
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(u => 
        u.username?.toLowerCase().includes(term.toLowerCase()) ||
        u.email?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const saveUser = async () => {
    if (!user?.attributes?.email) return;
    
    try {
      const existingUsers = await client.graphql({ query: listUsers });
      const userExists = existingUsers.data.listUsers.items?.find(u => u.email === user.attributes.email);
      
      if (!userExists) {
        const newUser = {
          email: user.attributes.email,
          username: user.username,
          joinedAt: new Date().toISOString()
        };
        await client.graphql({ query: createUser, variables: { input: newUser } });
        await loadUsers();
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user data.');
    }
  };

  const updateProfile = async () => {
    try {
      const userProfile = {
        email: user?.attributes?.email,
        ...profile,
        updatedAt: new Date().toISOString()
      };
      await client.graphql({ query: createUser, variables: { input: userProfile } });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <div style={{background: '#0f3460', borderRadius: '15px', padding: '25px', marginBottom: '25px', color: 'white'}}>
        <h2 style={{margin: '0 0 10px 0', fontSize: '24px', color: '#4fc3f7'}}>📊 User Dashboard</h2>
        <p style={{margin: '0', fontSize: '16px', color: '#ccc'}}>📧 Email: {user?.signInDetails?.loginId || user?.attributes?.email || user?.email || 'Not available'}</p>
      </div>
      
      {error && <div style={{color: '#ff6b6b', margin: '15px 0', padding: '15px', backgroundColor: '#2a1f1f', borderRadius: '10px'}}>⚠️ {error}</div>}
      {loading && <div style={{color: '#4fc3f7', margin: '15px 0', fontSize: '16px', textAlign: 'center'}}>🔄 Loading...</div>}
      
      <div style={{background: '#0f3460', borderRadius: '15px', padding: '20px', marginBottom: '25px'}}>
        <h3 style={{margin: '0 0 15px 0', fontSize: '20px', color: '#4fc3f7'}}>👤 Profile Settings</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '15px'}}>
          <input 
            style={{padding: '12px', backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '10px', color: 'white'}}
            placeholder="👤 Username" 
            value={profile.username} 
            onChange={(e) => setProfile({...profile, username: e.target.value})}
          />
          <input 
            style={{padding: '12px', backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '10px', color: 'white'}}
            placeholder="📛 Full Name" 
            value={profile.fullName} 
            onChange={(e) => setProfile({...profile, fullName: e.target.value})}
          />
          <input 
            style={{padding: '12px', backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '10px', color: 'white'}}
            placeholder="📝 Bio" 
            value={profile.bio} 
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
          />
          <input 
            style={{padding: '12px', backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '10px', color: 'white'}}
            placeholder="📍 Location" 
            value={profile.location} 
            onChange={(e) => setProfile({...profile, location: e.target.value})}
          />
        </div>
        <button 
          style={{padding: '12px 25px', backgroundColor: '#4fc3f7', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '14px'}}
          onClick={updateProfile}
        >
          ✨ Update Profile
        </button>
      </div>
      
      <div style={{background: '#0f3460', borderRadius: '15px', padding: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px'}}>
          <h3 style={{margin: '0', fontSize: '20px', color: '#4fc3f7'}}>👥 Community ({filteredUsers.length})</h3>
          <input 
            style={{padding: '10px 15px', backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '20px', color: 'white', width: '200px'}}
            placeholder="🔍 Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {filteredUsers.map((u, index) => (
            <div key={index} style={{padding: '15px', backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '10px'}}>
              <div style={{fontWeight: 'bold', fontSize: '16px', marginBottom: '5px', color: 'white'}}>👤 {u.username}</div>
              <div style={{color: '#ccc', fontSize: '14px', marginBottom: '3px'}}>📧 {u.email}</div>
              <div style={{color: '#999', fontSize: '12px'}}>📅 Joined: {new Date(u.joinedAt || u.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        {filteredUsers.length === 0 && !loading && (
          <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>🔍 No members found</div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;