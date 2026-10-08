import {createContext, useContext, useState} from "react";

export const InterviewContext = createContext();


export const InterviewProvider = ({children}) => {
    const initialReport = {
        matchScore: 0,
        technicalQuestion: [],
        behaviouralQuestion: [],
        skillGaps: [],
        preparationPlan: []
    };

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(initialReport);
    const [reports, setReports] = useState([]);

    return (
        <InterviewContext.Provider value={{loading, setLoading, report, setReport, reports, setReports}}>
            {children}
        </InterviewContext.Provider>
    );
};