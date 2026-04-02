import React from "react";

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  loading?: boolean;
  className?: string;
  /** Light text and connectors for use on Stanbic blue hero bands */
  variant?: "default" | "onDark";
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  loading = false,
  className = "",
  variant = "default",
}) => {
  const dark = variant === "onDark";

  return (
    <div className={className}>
      <div className="flex w-full items-start justify-between gap-0.5 sm:gap-1">
        {steps.map((step, index) => {
          const done = step.number < currentStep;
          const active = step.number === currentStep;

          const circle = dark
            ? done
              ? "bg-white/95 text-[#0033A1] shadow-sm"
              : active
                ? "bg-white text-[#0051FF] shadow-md ring-2 ring-white/40"
                : "border border-white/35 bg-white/5 text-white/55"
            : done
              ? "bg-[#0033A1] text-white shadow-sm"
              : active
                ? "bg-[#0051FF] text-white shadow-md ring-2 ring-[#0051FF]/25"
                : "border-2 border-slate-200 bg-white text-slate-400";

          const labelCls = dark
            ? active || done
              ? "text-white"
              : "text-white/55"
            : active || done
              ? "text-slate-900"
              : "text-slate-400";

          return (
            <React.Fragment key={step.number}>
              <div className="flex min-w-0 max-w-[24%] flex-1 flex-col items-center">
                <div
                  className={`mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 sm:mb-1.5 sm:h-9 sm:w-9 sm:text-sm ${circle}`}
                >
                  {active && loading ? (
                    <span
                      className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0051FF] border-t-transparent sm:h-4 sm:w-4"
                      aria-hidden
                    />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`text-center text-[9px] font-semibold leading-tight sm:text-[11px] ${labelCls}`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className="mx-0.5 mt-4 hidden min-w-[8px] flex-1 sm:mx-1 sm:mt-[18px] sm:block"
                  aria-hidden
                >
                  <div
                    className={`h-0.5 overflow-hidden rounded-full sm:h-1 ${
                      dark ? "bg-white/20" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        dark
                          ? "bg-white/90"
                          : "bg-gradient-to-r from-[#0051FF] to-[#0033A1]"
                      }`}
                      style={{
                        width: currentStep > step.number ? "100%" : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {dark && (
        <p className="mt-2 text-center text-[10px] text-white/55 sm:hidden">
          Step {currentStep} of {steps.length}
        </p>
      )}
    </div>
  );
};
