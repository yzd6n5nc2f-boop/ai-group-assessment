import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

type Stats = {
  total_responses: number;
  avg_mindset: number;
  avg_usage: number;
  avg_prompting: number;
  avg_research: number;
  avg_workflow: number;
  avg_overall: number;
};

export function ResultsDashboard() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  // Fetch results data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responsesRes, statsRes] = await Promise.all([
          axios.get<Response[]>('/api/ai/results/responses'),
          axios.get<Stats>('/api/ai/results/stats')
        ]);
        
        setResponses(responsesRes.data);
        setStats(statsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load results data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
      <h2 className="text-2xl font-bold mb-6">AI Fluency Assessment Dashboard</h2>
      
      {/* Stats Overview */}
      {stats && (
        <div className="stats shadow mb-8 w-full">
          <div className="stat">
            <div className="stat-title">Total Responses</div>
            <div className="stat-value">{stats.total_responses || 0}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Avg. Overall Score</div>
            <div className="stat-value">{stats.avg_overall ? stats.avg_overall.toFixed(1) : '0.0'}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Avg. Mindset Score</div>
            <div className="stat-value">{stats.avg_mindset ? stats.avg_mindset.toFixed(1) : '0.0'}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Avg. Usage Score</div>
            <div className="stat-value">{stats.avg_usage ? stats.avg_usage.toFixed(1) : '0.0'}</div>
          </div>
        </div>
      )}
      
      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title">Profile Distribution</h3>
            <div className="h-64 flex items-center justify-center bg-base-200 rounded-lg">
              <p className="text-muted-foreground">Chart visualization would appear here</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title">Scores by Category</h3>
            <div className="h-64 flex items-center justify-center bg-base-200 rounded-lg">
              <p className="text-muted-foreground">Category comparison chart would appear here</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Responses */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">Recent Responses</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Submitted</th>
                  <th>Group</th>
                  <th>Name</th>
                  <th>Overall Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {responses.slice(0, 5).map(response => (
                  <tr key={response.id}>
                    <td>{new Date(response.submission_datetime).toLocaleDateString()}</td>
                    <td>{response.group_name}{response.subgroup_name ? ` (${response.subgroup_name})` : ''}</td>
                    <td>{response.first_name || response.last_name ? `${response.first_name} ${response.last_name}` : 'Anonymous'}</td>
                    <td>{response.overall_profile_value ? response.overall_profile_value.toFixed(1) : 'N/A'}</td>
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
          <div className="card-actions justify-end mt-4">
            <Link to="/responses" className="btn btn-primary">View All Responses</Link>
          </div>
        </div>
      </div>
    </div>
  );
}