import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const Stepper = ({ steps, currentStep, stepUrls }) => {
  const progressWidth = currentStep > 0
    ? ((currentStep) / (steps.length - 1)) * 100
    : 0;

  return (
    <div className="stepper-container">
      <div className="stepper-line"></div>
      <div className="stepper-progress-line" style={{ width: `${progressWidth}%` }}></div>
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        const StepContent = () => (
          <div className={`step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
            <div className="step-circle">
              {isCompleted ? <Check size={24} /> : index + 1}
            </div>
            <span className="step-label">{label}</span>
          </div>
        );

        return isCompleted ? (
          <Link key={index} to={stepUrls[index] || '#'}>
            <StepContent />
          </Link>
        ) : (
          <StepContent key={index} />
        );
      })}
    </div>
  );
};

export default Stepper;