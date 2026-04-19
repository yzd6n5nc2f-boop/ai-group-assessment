import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeamReportGenerator = ({ group, subgroup }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch report data from Airtable
    fetchReportData();
  }, [group, subgroup]);
  
  const fetchReportData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch data from Airtable API
      // For demonstration, we're using mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on group/subgroup
      const mockReportData = {
        groupName: group?.name || 'All Groups',
        subgroupName: subgroup?.name || 'All Subgroups',
        participantCount: Math.floor(Math.random() * 50) + 20,
        sectionAverages: {
          mindset: (Math.random() * 4).toFixed(1),
          usage: (Math.random() * 4).toFixed(1),
          prompting: (Math.random() * 4).toFixed(1),
          research: (Math.random() * 4).toFixed(1),
          workflow: (Math.random() * 4).toFixed(1)
        },
        freeTextResponses: [
          "Need more training on prompt engineering",
          "Want to learn about AI ethics",
          "Interested in automation tools",
          "Would like more hands-on workshops",
          "Need guidance on AI implementation in our workflows"
        ]
      };
      
      setReportData(mockReportData);
    } catch (err) {
      setError('Failed to load report data');
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading report data...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  if (!reportData) {
    return <div className="text-center py-8">No data available</div>;
  }
  
  // Chart configuration
  const chartData = {
    labels: ['Mindset', 'Usage', 'Prompting', 'Research', 'Workflow'],
    datasets: [
      {
        label: 'Average Score',
        data: [
          reportData.sectionAverages.mindset,
          reportData.sectionAverages.usage,
          reportData.sectionAverages.prompting,
          reportData.sectionAverages.research,
          reportData.sectionAverages.workflow
        ],
        backgroundColor: [
          '#CC0000',
          '#E06667',
          '#EB9A99',
          '#F4CCCD',
          '#999999'
        ],
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Team AI Profile Distribution for ${reportData.groupName}${reportData.subgroupName ? ` - ${reportData.subgroupName}` : ''}`,
      },
    },
  };
  
  // Distribution data for each section
  const distributionData = [
    {
      section: 'Mindset',
      data: [10, 25, 30, 20, 15], // Distribution percentages for Novice to Expert
      labels: ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      section: 'Usage',
      data: [5, 20, 35, 25, 15],
      labels: ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      section: 'Prompting',
      data: [15, 30, 25, 20, 10],
      labels: ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      section: 'Research',
      data: [20, 25, 20, 20, 15],
      labels: ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      section: 'Workflow',
      data: [25, 20, 15, 20, 20],
      labels: ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  ];
  
  // Create distribution charts
  const distributionCharts = distributionData.map((sectionData, index) => {
    const data = {
      labels: sectionData.labels,
      datasets: [
        {
          label: 'Distribution (%)',
          data: sectionData.data,
          backgroundColor: [
            '#999999',
            '#F4CCCD',
            '#EB9A99',
            '#E06667',
            '#CC0000'
          ],
        }
      ]
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${sectionData.section} Distribution`,
        },
      },
    };
    
    return (
      <div key={index} className="card bg-base-100 shadow-xl border border-[#434343] mb-8">
        <div className="card-body">
          <Bar data={data} options={options} />
        </div>
      </div>
    );
  });
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#434343] mb-6">Team AI Profile Report</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl border border-[#434343]">
          <div className="card-body text-center">
            <h2 className="text-4xl font-bold text-[#CC0000]">{reportData.participantCount}</h2>
            <p className="text-[#434343]">Participants</p>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl border border-[#434343]">
          <div className="card-body text-center">
            <h2 className="text-4xl font-bold text-[#CC0000]">
              {Math.max(
                reportData.sectionAverages.mindset,
                reportData.sectionAverages.usage,
                reportData.sectionAverages.prompting,
                reportData.sectionAverages.research,
                reportData.sectionAverages.workflow
              ).toFixed(1)}
            </h2>
            <p className="text-[#434343]">Highest Section Average</p>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl border border-[#434343]">
          <div className="card-body text-center">
            <h2 className="text-4xl font-bold text-[#CC0000]">
              {Math.min(
                reportData.sectionAverages.mindset,
                reportData.sectionAverages.usage,
                reportData.sectionAverages.prompting,
                reportData.sectionAverages.research,
                reportData.sectionAverages.workflow
              ).toFixed(1)}
            </h2>
            <p className="text-[#434343]">Lowest Section Average</p>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl border border-[#434343] mb-8">
        <div className="card-body">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-[#434343] mb-6">Section Distribution Charts</h2>
      {distributionCharts}
      
      <div className="card bg-base-100 shadow-xl border border-[#434343]">
        <div className="card-body">
          <h2 className="card-title text-2xl text-[#434343]">Free-text Responses</h2>
          <div className="space-y-4">
            {reportData.freeTextResponses.map((response, index) => (
              <div key={index} className="p-4 bg-[#F4CCCD] rounded-lg">
                <p className="text-[#434343]">{response}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <button 
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          Print Report
        </button>
      </div>
    </div>
  );
};

export default TeamReportGenerator;