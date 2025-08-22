import React from 'react';
import { Card } from '@/components/ui';

interface StatCardProps {
    value: number;
    label: string;
    color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, color }) => (
    <Card className="p-4 text-center border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200">
        <div className={`text-2xl font-bold bg-gradient-to-br ${color} bg-clip-text text-transparent mb-1`}>
            {value}
        </div>
        <div className="text-sm text-slate-600 font-medium">{label}</div>
    </Card>
); 