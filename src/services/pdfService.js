import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { sendEmailWithPDF } from './emailService';

export const generateAndSendPDF = async (responseData) => {
  try {
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
    doc.text(`Date Completed: ${new Date().toLocaleDateString()}`, 20, 80);
    
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
    
    // Add insights
    doc.setFontSize(16);
    doc.setTextColor(204, 0, 0); // #CC0000
    doc.text('Key Insights', 20, doc.lastAutoTable.finalY + 20);
    
    doc.setFontSize(12);
    doc.setTextColor(67, 67, 67); // #434343
    doc.text(`Primary Gap: ${responseData.primary_gap || 'Not identified'}`, 20, doc.lastAutoTable.finalY + 30);
    doc.text(`Primary Strength: ${responseData.primary_strength || 'Not identified'}`, 20, doc.lastAutoTable.finalY + 40);
    
    // Add summary
    doc.setFontSize(16);
    doc.setTextColor(204, 0, 0); // #CC0000
    doc.text('Summary', 20, doc.lastAutoTable.finalY + 60);
    
    doc.setFontSize(12);
    doc.setTextColor(67, 67, 67); // #434343
    doc.text('This profile helps shape your AI training.', 20, doc.lastAutoTable.finalY + 70);
    
    // Convert PDF to blob
    const pdfBlob = doc.output('blob');
    
    // Send email with PDF attachment
    const emailResult = await sendEmailWithPDF(
      responseData.email,
      pdfBlob,
      'Your AI Fluency Profile',
      `Dear ${name},\n\nThank you for completing the AI Fluency Assessment. Please find your personalized AI Fluency Profile attached.\n\nThis profile will help us tailor the upcoming AI training to better meet your needs.\n\nBest regards,\nThe Training Team`
    );
    
    return {
      success: true,
      message: 'PDF generated and email sent successfully',
      emailResult: emailResult
    };
  } catch (error) {
    console.error('Error generating and sending PDF:', error);
    throw error;
  }
};