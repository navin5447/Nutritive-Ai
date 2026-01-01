import React, { useState } from 'react';

const UserProfile = ({ onSave }) => {
  const [profile, setProfile] = useState({
    age: '', gender: '', height: '', weight: '', goal: 'maintenance'
  });

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  return (
    <form className="flex flex-col max-w-md mx-auto p-6 bg-white shadow rounded mt-8"
          onSubmit={e => { e.preventDefault(); onSave(profile); }}>
      <h2 className="mb-4 text-lg font-semibold">Your Profile</h2>
      <input required name="age" type="number" placeholder="Age" className="mb-2 p-2 rounded border" value={profile.age} onChange={handleChange}/>
      <select required name="gender" className="mb-2 p-2 rounded border" value={profile.gender} onChange={handleChange}>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input required name="height" type="number" placeholder="Height (cm)" className="mb-2 p-2 rounded border" value={profile.height} onChange={handleChange}/>
      <input required name="weight" type="number" placeholder="Weight (kg)" className="mb-2 p-2 rounded border" value={profile.weight} onChange={handleChange}/>
      <select name="goal" className="mb-2 p-2 rounded border" value={profile.goal} onChange={handleChange}>
        <option value="maintenance">Maintenance</option>
        <option value="weight_loss">Weight Loss</option>
        <option value="muscle_gain">Muscle Gain</option>
      </select>
      <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Save Profile</button>
    </form>
  );
};
export default UserProfile;


