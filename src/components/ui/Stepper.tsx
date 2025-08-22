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
                        <div key={step.number} className="flex flex-col items-center flex-1 relative">
                            {/* Step Circle */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 mb-2 ${step.number < currentStep
                                    ? 'bg-emerald-500 text-white'
                                    : step.number === currentStep
                                        ? 'bg-[#0051FF] text-white'
                                        : 'bg-slate-200 text-slate-500'
                                }`}>
                                {step.number < currentStep ? (
                                    <CheckCircleIcon className="h-5 w-5" />
                                ) : step.number === steps.length && loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                ) : (
                                    step.number
                                )}
                            </div>

                            {/* Step Label */}
                            <span className={`text-xs font-medium transition-colors duration-200 ${step.number <= currentStep ? 'text-slate-900' : 'text-slate-500'
                                }`}>
                                {step.label}
                            </span>

                            {/* Simple Connector Line */}
                            {index < steps.length - 1 && (
                                <div className={`absolute top-5 left-full w-full h-0.5 transition-all duration-200 ${step.number < currentStep
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 