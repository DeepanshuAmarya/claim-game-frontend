import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [lastClaim, setLastClaim] = useState({}); // store points per user

  const apiUrl = import.meta.env.VITE_API_URL;

  const API_BASE = import.meta.env.VITE_API_BASE;

  // const API_BASE = process.env.REACT_APP_API_BASE;

  

 const fetchUsers = async () => {
  const res = await axios.get(`${API_BASE}/users`);
  console.log("Fetched data:", res.data); // check the structure
  setUsers(res.data || []);
 // use res.data.users if available
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async () => {
    if (!newName.trim()) return;
    const res = await axios.post(`${API_BASE}/users`, { name: newName });
    setUsers(res.data);
    
    setNewName('');
  };

  const claimPoints = async (userId) => {
    const res = await axios.post(`${API_BASE}/claim`, { userId });
    setLastClaim({ ...lastClaim, [userId]: res.data.claimedPoints });
    setUsers(res.data.users);
  };

  return (
    <div className="bg-blue-200" style={{ margin: 'auto', padding: '20px' }}>
      <h2 className="font-bold flex items-center justify-center text-3xl mb-5 p-15 bg-slate-600 text-amber-50">User Claim Game</h2>

      <div style={{ marginBottom: '20px' }}>
        <input className="border-1"
          type="text"
          placeholder="Add user name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="bg-cyan-700 text-white hover:bg-cyan-900 p-2 rounded-2xl cursor-pointer" onClick={addUser} style={{ marginLeft: '10px' }}>Add User</button>
      </div>

      <h3 className="font-bold my-6">Leaderboard</h3>
      <table className="border-1" border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Total Points</th>
            <th>Claim Points</th>
          </tr>
        </thead>
        <tbody className="border-1">
          {users.map((u) => (
            <tr className="border" key={u._id}>
              <td className="border">{u.rank}</td>
              <td className="border">{u.name}</td>
              <td className="border">{u.totalPoints}</td>
              <td>
                <button className="bg-orange-600 p-2 rounded-2xl m-1 text-white" onClick={() => claimPoints(u._id)}>Claim</button>
                {lastClaim[u._id] && (
                  <span style={{ marginLeft: '10px', color: 'green' }}>
                    +{lastClaim[u._id]} pts
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
