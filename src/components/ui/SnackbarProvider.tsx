import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar, { SnackbarType } from './Snackbar';

export interface SnackbarMessage {
    id: string;
    type: SnackbarType;
    title: string;
    message?: string;
    duration?: number;
}

interface SnackbarContextType {
    showSnackbar: (message: Omit<SnackbarMessage, 'id'>) => void;
    hideSnackbar: (id: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

interface SnackbarProviderProps {
    children: React.ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
    const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

    const showSnackbar = useCallback((message: Omit<SnackbarMessage, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newSnackbar: SnackbarMessage = { ...message, id };

        setSnackbars(prev => [...prev, newSnackbar]);
    }, []);

    const hideSnackbar = useCallback((id: string) => {
        setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
    }, []);

    const value = {
        showSnackbar,
        hideSnackbar
    };

    return (
        <SnackbarContext.Provider value={value}>
            {children}

            {/* Snackbar Container */}
            <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
                {snackbars.map((snackbar) => (
                    <Snackbar
                        key={snackbar.id}
                        {...snackbar}
                        onClose={hideSnackbar}
                    />
                ))}
            </div>
        </SnackbarContext.Provider>
    );
}; 