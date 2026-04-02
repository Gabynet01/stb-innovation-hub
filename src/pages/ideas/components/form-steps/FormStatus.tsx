import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface FormStatusProps {
    error?: string | null;
    loading?: boolean;
}

export const FormStatus: React.FC<FormStatusProps> = ({ error, loading }) => {
    if (!error && !loading) return null;

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-xl border border-red-200/90 bg-gradient-to-br from-red-50 to-white p-5 shadow-md shadow-red-900/[0.04]">
                    <div className="flex gap-3">
                        <ExclamationTriangleIcon className="h-6 w-6 shrink-0 text-red-600" />
                        <div>
                            <h3 className="text-base font-semibold text-red-900">
                                Something went wrong
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-red-800">{error}</p>
                            <p className="mt-2 text-xs text-red-700/90">
                                Check your connection and fields, then try again.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="rounded-xl border border-[#0051FF]/20 bg-gradient-to-br from-[#F0F7FF] to-white p-5 shadow-md shadow-[#0051FF]/10">
                    <div className="flex items-center gap-3">
                        <span
                            className="inline-block h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-[#0051FF] border-t-transparent"
                            aria-hidden
                        />
                        <div>
                            <h3 className="text-base font-semibold text-[#0033A1]">
                                Sending your idea…
                            </h3>
                            <p className="text-sm text-[#0033A1]/85">
                                Please keep this page open for a moment.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
