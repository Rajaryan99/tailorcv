import { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'tailorcv-current-report';

const readStoredReport = () => {
    if (typeof window === 'undefined') return null;

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error reading stored interview report:', error);
        return null;
    }
};

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const initialReport = {
        matchScore: 0,
        technicalQuestion: [],
        behaviouralQuestion: [],
        skillGaps: [],
        preparationPlan: []
    };

    const storedReport = readStoredReport();

    const [loading, setLoading] = useState(false);
    const [report, setReportState] = useState(storedReport?.report || initialReport);
    const [reports, setReports] = useState([]);

    const setReport = (nextReport) => {
        setReportState(nextReport || initialReport);

        if (typeof window !== 'undefined') {
            if (!nextReport) {
                window.localStorage.removeItem(STORAGE_KEY);
                return;
            }

            const payload = {
                id: nextReport._id || storedReport?.id || null,
                report: nextReport
            };

            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        }
    };

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    );
};