import React, { useState, useEffect } from 'react';

const GroupSelector = ({ groups, subgroups, formData, onGroupChange, onSubgroupChange, onNext }) => {
  const [selectedGroup, setSelectedGroup] = useState(formData.group || '');
  const [selectedSubgroup, setSelectedSubgroup] = useState(formData.subgroup || '');
  
  useEffect(() => {
    setSelectedGroup(formData.group || '');
    setSelectedSubgroup(formData.subgroup || '');
  }, [formData]);
  
  const handleGroupSelect = async (e) => {
    const groupId = e.target.value;
    setSelectedGroup(groupId);
    await onGroupChange(groupId);
    
    // Reset subgroup when group changes
    setSelectedSubgroup('');
    onSubgroupChange('');
  };
  
  const handleSubgroupSelect = async (e) => {
    const subgroupName = e.target.value;
    setSelectedSubgroup(subgroupName);
    await onSubgroupChange(subgroupName);
  };
  
  // Add defensive checks for groups and subgroups
  const validGroups = Array.isArray(groups) ? groups : [];
  const validSubgroups = Array.isArray(subgroups) ? subgroups : [];
  
  return (
    <div className="selector-container">
      <h2>Select Your Group and Subgroup</h2>
      
      <div className="form-group">
        <label htmlFor="group-select">Group:</label>
        <select 
          id="group-select"
          value={selectedGroup}
          onChange={handleGroupSelect}
          className="form-control"
        >
          <option value="">-- Select a Group --</option>
          {validGroups.map((group) => (
            // Ensure group and group.fields exist before accessing
            <option key={group.id} value={group.id}>
              {group.fields?.Name || 'Unnamed Group'}
            </option>
          ))}
        </select>
      </div>
      
      {selectedGroup && validSubgroups.length > 0 && (
        <div className="form-group">
          <label htmlFor="subgroup-select">Subgroup:</label>
          <select
            id="subgroup-select"
            value={selectedSubgroup}
            onChange={handleSubgroupSelect}
            className="form-control"
          >
            <option value="">-- Select a Subgroup --</option>
            {validSubgroups
              .filter(subgroup => subgroup.fields?.Group?.[0] === selectedGroup)
              .map((subgroup) => (
                <option key={subgroup.id} value={subgroup.fields?.Name || ''}>
                  {subgroup.fields?.Name || 'Unnamed Subgroup'}
                </option>
              ))}
          </select>
        </div>
      )}
      
      <button 
        onClick={onNext}
        disabled={!selectedGroup || (validSubgroups.length > 0 && !selectedSubgroup)}
        className="btn btn-primary mt-3"
      >
        Next
      </button>
    </div>
  );
};

export default GroupSelector;