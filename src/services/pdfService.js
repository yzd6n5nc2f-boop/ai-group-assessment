import jsPDF from 'jspdf';
import 'jspdf-autotable';

// In a real implementation, this would connect to a backend service
// that securely handles PDF generation and email sending

export const generateAndSendPDF = async (responseData) => {
  try {
    // In a production environment, this would make an API call to a backend service
    // that generates the PDF and sends it via email
    
    // For demonstration purposes, we're simulating the process
    console.log('Generating PDF for:', responseData.email);
    
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Set the font
    doc.setFont('helvetica');
    
    // Add title
    doc.setFontSize(22);
    doc.setTextColor(204, 0, 0); // #CC0000
    doc.text('Your AI Fluency Profile', 105, 20, null, null, 'center');
    
    // Add participant info
    doc.setFontSize(12);
    doc.setTextColor(67, 67, 67); // #434343
    
    const name = responseData.firstName || responseData.lastName ? 
      `${responseData.firstName} ${responseData.lastName}`.trim() : 
      'Participant';
      
    doc.text(`Name: ${name}`, 20, 40);
    doc.text(`Group: ${responseData.groupName || 'Not specified'}`, 20, 50);
    doc.text(`Subgroup: ${responseData.subgroupName || 'Not specified'}`, 20, 60);
    doc.text(`Identity Mode: ${responseData.identityMode}`, 20, 70);
    doc.text(`Date Completed: ${new Date(responseData.submissionDatetime).toLocaleDateString()}`, 20, 80);
    
    // Add section profiles
    doc.setFontSize(16);
    doc.setTextColor(204, 0, 0); // #CC0000
    doc.text('Section Profiles', 20, 100);
    
    // Create a table for section profiles
    doc.setFontSize(12);
    doc.setTextColor(67, 67, 67); // #434343
    
    const sectionData = [
      ['Mindset Fluency Profile', responseData.mindset_profile_value || 'N/A'],
      ['Usage Fluency Profile', responseData.usage_profile_value || 'N/A'],
      ['Prompting Fluency Profile', responseData.prompting_profile_value || 'N/A'],
      ['Research Fluency Profile', responseData.research_profile_value || 'N/A'],
      ['Workflow Fluency Profile', responseData.workflow_profile_value || 'N/A']
    ];
    
    doc.autoTable({
      startY: 110,
      head: [['Section', 'Value']],
      body: sectionData,
      theme: 'striped',
      styles: { 
        fillColor: [244, 204, 205], // #F4CCCD
        textColor: [67, 67, 67] // #434343
      },
      headStyles: { 
        fillColor: [204, 0, 0], // #CC0000
        textColor: [255, 255, 255]
      }
    });
    
    // Add band information
    const bandData = [
      ['Mindset Band', responseData.mindset_band || 'N/A'],
      ['Usage Band', responseData.usage_band || 'N/A'],
      ['Prompting Band', responseData.prompting_band || 'N/A'],
      ['Research Band', responseData.research_band || 'N/A'],
      ['Workflow Band', responseData.workflow_band || 'N/A']
    ];
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Section', 'Band']],
      body: bandData,
      theme: 'striped',
      styles: { 
        fillColor: [244, 204, 205], // #F4CCCD
        textColor: [67, 67, 67] // #434343
      },
      headStyles: { 
        fillColor: [204, 0, 0], // #CC0000
        textColor: [255, 255, 255]
      }
    });
    
    // Add summary
    doc.setFontSize(16);
    doc.setTextColor(204, 0, 0); // #CC0000
    doc.text('Summary', 20, doc.lastAutoTable.finalY + 20);
    
    doc.setFontSize(12);
    doc.setTextColor(67, 67, 67); // #434343
    doc.text('This profile helps shape your AI training.', 20, doc.lastAutoTable.finalY + 30);
    
    // In a real implementation, we would send this PDF via email
    // For now, we'll just log that we would send it
    console.log('PDF would be sent to:', responseData.email);
    
    // Convert PDF to blob and simulate sending
    const pdfBlob = doc.output('blob');
    
    // In a real implementation, this would be an API call to a backend service
    // that handles email sending securely
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log('PDF generated and sent successfully');
        resolve({ success: true });
      }, 1000);
    });
    
    return {
      success: true,
      message: 'PDF generated and sent successfully'
    };
  } catch (error) {
    console.error('Error generating and sending PDF:', error);
    throw error;
  }
};