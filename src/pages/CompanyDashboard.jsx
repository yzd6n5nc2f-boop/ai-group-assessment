import React, { useState, useEffect } from 'react';

const CompanyDashboard = () => {
  const [companyData, setCompanyData] = useState({
    companyName: '',
    targetParticipants: 0,
    completedCount: 0,
    subgroups: []
  });
  
  const [loading, setLoading] = useState(true);
  const [newSubgroup, setNewSubgroup] = useState('');
  
  // Simulate fetching data from Airtable
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = {
          companyName: 'Acme Corporation',
          targetParticipants: 50,
          completedCount: 32,
          subgroups: [
            { id: 1, name: 'Marketing', target: 15, completed: 12 },
            { id: 2, name: 'Engineering', target: 20, completed: 15 },
            { id: 3, name: 'Sales', target: 10, completed: 5 },
            { id: 4, name: 'HR', target: 5, completed: 0 }
          ]
        };
        
        setCompanyData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const completionPercentage = companyData.targetParticipants > 0 
    ? Math.round((companyData.completedCount / companyData.targetParticipants) * 100)
    : 0;
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };
  
  const updateTargetParticipants = (newTarget) => {
    setCompanyData(prev => ({
      ...prev,
      targetParticipants: newTarget
    }));
  };
  
  const addSubgroup = () => {
    if (newSubgroup.trim() !== '') {
      const newSubgroupObj = {
        id: Date.now(),
        name: newSubgroup,
        target: 0,
        completed: 0
      };
      
      setCompanyData(prev => ({
        ...prev,
        subgroups: [...prev.subgroups, newSubgroupObj]
      }));
      
      setNewSubgroup('');
    }
  };
  
  const updateSubgroupTarget = (id, newTarget) => {
    setCompanyData(prev => ({
      ...prev,
      subgroups: prev.subgroups.map(subgroup => 
        subgroup.id === id ? {...subgroup, target: newTarget} : subgroup
      )
    }));
  };
  
  if (loading) {
    return <div className="max-w-6xl mx-auto p-6 text-center py-8">Loading dashboard data...</div>;
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#434343] mb-6">{companyData.companyName} AI Assessment Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl border border-[#434343]">
          <div className="card-body">
            <h2 className="card-title text-2xl text-[#434343]">Participation Details</h2>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Target Number of Participants</span>
              </label>
              <input 
                type="number" 
                className="input input-bordered w-full" 
                value={companyData.targetParticipants}
                onChange={(e) => updateTargetParticipants(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#434343]">Overall Progress</span>
                  <span className="text-[#434343] font-bold">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-[#CC0000] h-4 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="stats shadow w-full">
                <div className="stat">
                  <div className="stat-title">Target Participants</div>
                  <div className="stat-value text-2xl">{companyData.targetParticipants}</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Completed</div>
                  <div className="stat-value text-2xl">{companyData.completedCount}</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Remaining</div>
                  <div className="stat-value text-2xl">{Math.max(0, companyData.targetParticipants - companyData.completedCount)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl border border-[#434343]">
          <div className="card-body">
            <h2 className="card-title text-2xl text-[#434343]">Share Assessment</h2>
            <p className="mb-4">Copy and share this link with your team members:</p>
            
            <div className="form-control">
              <div className="input-group">
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  value={`https://assessment.example.com/${companyData.companyName.toLowerCase().replace(/\s+/g, '-')}`}
                  readOnly
                />
                <button 
                  className="btn btn-primary"
                  onClick={() => copyToClipboard(`https://assessment.example.com/${companyData.companyName.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-[#434343] mb-2">Invite Message</h3>
              <div className="p-4 bg-[#F4CCCD] rounded-lg">
                <p className="text-[#434343]">
                  Hi team,<br/><br/>
                  We're conducting an AI fluency assessment to better understand our team's current AI capabilities and tailor our training accordingly.<br/><br/>
                  Please take a few minutes to complete the assessment at the link above.<br/><br/>
                  Thank you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl border border-[#434343] mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl text-[#434343]">Subgroup Management</h2>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Add New Subgroup</span>
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="input input-bordered flex-1" 
                placeholder="Subgroup name"
                value={newSubgroup}
                onChange={(e) => setNewSubgroup(e.target.value)}
              />
              <button 
                className="btn btn-primary"
                onClick={addSubgroup}
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Subgroup</th>
                  <th>Target Participants</th>
                  <th>Completed</th>
                  <th>Completion %</th>
                </tr>
              </thead>
              <tbody>
                {companyData.subgroups.map((subgroup) => {
                  const subCompletion = subgroup.target > 0 
                    ? Math.round((subgroup.completed / subgroup.target) * 100)
                    : 0;
                  return (
                    <tr key={subgroup.id}>
                      <td>{subgroup.name}</td>
                      <td>
                        <input 
                          type="number" 
                          className="input input-bordered input-sm w-20" 
                          value={subgroup.target}
                          onChange={(e) => updateSubgroupTarget(subgroup.id, parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td>{subgroup.completed}</td>
                      <td>
                        <div className="flex items-center">
                          <span className="mr-2">{subCompletion}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#CC0000] h-2 rounded-full" 
                              style={{ width: `${subCompletion}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;