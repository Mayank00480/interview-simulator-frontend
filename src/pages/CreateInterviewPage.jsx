import React from 'react';
import CreateInterviewForm from '../components/CreateInterviewForm';

export default function CreateInterviewPage() {
  const handleInterviewSubmit = (interviewData) => {
    console.log('Submitted Interview Setup:', interviewData);
    alert('Interview setup created successfully in draft mode!');
  };

  return (
    <div className="create-interview-page-wrapper">
      <CreateInterviewForm onSubmit={handleInterviewSubmit} />
    </div>
  );
}
