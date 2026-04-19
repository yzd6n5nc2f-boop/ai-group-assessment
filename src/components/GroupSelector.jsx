import React, { useState, useEffect } from 'react';

const GroupSelector = ({ groups, subgroups, formData, onGroupChange, onSubgroupChange, onNext }) => {
  const [selectedGroup, setSelectedGroup] = useState(formData.group || '');
  const [selectedSubgroup, setSelectedSubgroup] = useState(formData.subgroup || '');
  
  useEffect(() => {
    setSelectedGroup(formData.group || '');
    setSelectedSubgroup(formData.subgroup || '');
  }, [formData]);
  
  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
    onGroupChange(groupId);
    
    // Reset subgroup when group changes
    setSelectedSubgroup('');
    onSubgroupChange('');
  };
  
  const handleSubgroupSelect = (subgroupId) => {
    setSelectedSubgroup(subgroupId);
    onSubgroupChange(subgroupId);
  };
  
  // Find the selected group to check if it has subgroups
  const selectedGroupObj = groups.find(group => group.id === selectedGroup);
  const hasSubgroups = selectedGroupObj && selectedGroupObj.hasSubgroups;
  
  return (
    <div className="card bg-base-100 shadow-xl border border-[#434343]">
      <div className="card-body">
        <h2 className="card-title text-2xl primary-color">Group Selection</h2>
        <p className="mb-4">Please select which group you belong to:</p>
        
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Which group are you part of?</span>
          </label>
          <select 
            className="select select-bordered w-full border-color"
            value={selectedGroup}
            onChange={(e) => handleGroupSelect(e.target.value)}
          >
            <option value="" disabled>Select your group</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        
        {hasSubgroups && (
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Which division or subgroup are you part of?</span>
            </label>
            <select 
              className="select select-bordered w-full border-color"
              value={selectedSubgroup}
              onChange={(e) => handleSubgroupSelect(e.target.value)}
            >
              <option value="" disabled>Select your subgroup</option>
              {subgroups.map(subgroup => (
                <option key={subgroup.id} value={subgroup.id}>{subgroup.name}</option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <button className="btn btn-primary" onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default GroupSelector;