import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface Step {
    number: number;
    label: string;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
    loading?: boolean;
    className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
    steps,
    currentStep,
    loading = false,
    className = ''
}) => {
    return (
        <div className={`mb-6 ${className}`}>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex flex-col items-center relative flex-1">
                            {/* Step Circle */}
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 mb-2 z-10 ${step.number < currentStep
                                ? 'bg-emerald-500 text-white'
                                : step.number === currentStep
                                    ? 'bg-[#0051FF] text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                {step.number < currentStep ? (
                                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : step.number === steps.length && loading ? (
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                                ) : (
                                    step.number
                                )}
                            </div>

                            {/* Step Label */}
                            <span className={`text-xs font-medium text-center px-1 transition-colors duration-200 ${step.number <= currentStep ? 'text-slate-900' : 'text-slate-500'
                                }`}>
                                {step.label}
                            </span>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-slate-200">
                                    <div className={`h-full transition-all duration-200 ${step.number < currentStep ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 