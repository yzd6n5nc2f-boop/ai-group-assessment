import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Types
type Response = {
  id: number;
  response_id: string;
  group_name: string;
  subgroup_name: string;
  identity_mode: string;
  first_name: string;
  last_name: string;
  email: string;
  mindset_profile_value: number | null;
  usage_profile_value: number | null;
  prompting_profile_value: number | null;
  research_profile_value: number | null;
  workflow_profile_value: number | null;
  overall_profile_value: number | null;
  mindset_band: string;
  usage_band: string;
  prompting_band: string;
  research_band: string;
  workflow_band: string;
  overall_fluency_band: string;
  primary_gap: string;
  primary_strength: string;
  submission_datetime: string;
};

export function AllResponses() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  
  // Fetch all responses
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get<Response[]>('/api/ai/results/responses');
        setResponses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError('Failed to load responses. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchResponses();
  }, []);
  
  // Filter responses based on search term
  const filteredResponses = responses.filter(response => 
    response.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (response.subgroup_name && response.subgroup_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (response.first_name && response.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (response.last_name && response.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (response.email && response.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Assessment Responses</h2>
      
      <div className="mb-6">
        <div className="form-control w-full max-w-xs">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Search responses..." 
              className="input input-bordered" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-square">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Submitted</th>
              <th>Group</th>
              <th>Name</th>
              <th>Email</th>
              <th>Overall Score</th>
              <th>Fluency Band</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResponses.map(response => (
              <tr key={response.id}>
                <td>{new Date(response.submission_datetime).toLocaleDateString()}</td>
                <td>{response.group_name}{response.subgroup_name ? ` (${response.subgroup_name})` : ''}</td>
                <td>{response.first_name || response.last_name ? `${response.first_name} ${response.last_name}` : 'Anonymous'}</td>
                <td>{response.email || 'Not provided'}</td>
                <td>{response.overall_profile_value ? response.overall_profile_value.toFixed(1) : 'N/A'}</td>
                <td>
                  <div className="badge badge-ghost gap-1">
                    {response.overall_fluency_band || 'N/A'}
                  </div>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-ghost" 
                    onClick={() => navigate(`/response/${response.response_id}`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredResponses.length === 0 && (
        <div className="text-center py-8">
          <p>No responses found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}