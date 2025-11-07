import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listUsers } from './graphql/queries';
import { createUser, deleteUser } from './graphql/mutations';

const client = generateClient();

function ProfilesApp({ user }) {
  const [profile, setProfile] = useState({ 
    name: user?.username || '', 
    bio: '', 
    location: '', 
    skills: '' 
  });
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
    loadAllProfiles();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.attributes?.email) return;
    setError(null);
    try {
      const userData = await client.graphql({ query: listUsers });
      const userProfile = userData.data.listUsers.items?.find(u => u.email === user.attributes.email);
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile.');
    }
  };

  const loadAllProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await client.graphql({ query: listUsers });
      setProfiles(userData.data.listUsers.items || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      setError('Failed to load profiles.');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user?.attributes?.email || !profile.name) return;
    
    try {
      const userProfile = {
        email: user.attributes.email,
        username: user.username,
        ...profile
      };
      
      await client.graphql({ query: createUser, variables: { input: userProfile } });
      loadAllProfiles();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const deleteProfile = async (userId) => {
    try {
      await client.graphql({ query: deleteUser, variables: { input: { id: userId } } });
      loadAllProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const styles = {
    container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
    formSection: { background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' },
    input: { display: 'block', width: '100%', margin: '10px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
    textarea: { display: 'block', width: '100%', margin: '10px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '80px', resize: 'vertical', boxSizing: 'border-box' },
    button: { background: '#007bff', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    deleteButton: { background: '#dc3545', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
    profileCard: { border: '1px solid #ddd', padding: '20px', margin: '15px 0', borderRadius: '8px', background: 'white' }
  };

  return (
    <div style={styles.container}>
      <h2>Profiles App</h2>
      {error && <div style={{color: 'red', margin: '10px 0'}}>{error}</div>}
      {loading && <div>Loading...</div>}
      
      <div style={styles.formSection}>
        <h3>My Profile</h3>
        <input 
          placeholder="Name" 
          value={profile.name} 
          onChange={(e) => setProfile({...profile, name: e.target.value})}
          style={styles.input}
        />
        <textarea 
          placeholder="Bio" 
          value={profile.bio} 
          onChange={(e) => setProfile({...profile, bio: e.target.value})}
          style={styles.textarea}
        />
        <input 
          placeholder="Location" 
          value={profile.location} 
          onChange={(e) => setProfile({...profile, location: e.target.value})}
          style={styles.input}
        />
        <input 
          placeholder="Skills" 
          value={profile.skills} 
          onChange={(e) => setProfile({...profile, skills: e.target.value})}
          style={styles.input}
        />
        <button onClick={saveProfile} style={styles.button}>
          Save Profile
        </button>
      </div>

      <div>
        <h3>All Profiles ({profiles.length})</h3>
        {profiles.map((p) => (
          <div key={p.id} style={styles.profileCard}>
            <h4>{p.name} ({p.email})</h4>
            <p><strong>Bio:</strong> {p.bio}</p>
            <p><strong>Location:</strong> {p.location}</p>
            <p><strong>Skills:</strong> {p.skills}</p>
            <small>Updated: {new Date(p.updatedAt).toLocaleString()}</small>
            <button onClick={() => deleteProfile(p.email)} style={styles.deleteButton}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilesApp;