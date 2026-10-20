import React from 'react';
import CreateInterviewForm from '../components/CreateInterviewForm';
import CreateInterviewSidePanel from '../components/CreateInterviewSidePanel';

export default function CreateInterviewPage() {
  const handleInterviewSubmit = (interviewData) => {
    console.log('Submitted Interview Setup:', interviewData);
    alert('Interview setup created successfully in draft mode!');
  };

  return (
    <div className="create-interview-page-wrapper">
      {/* Left Column Form */}
      <CreateInterviewForm onSubmit={handleInterviewSubmit} />

      {/* Right Column Highlights & Graphic */}
      <CreateInterviewSidePanel />
    </div>
  );
}
