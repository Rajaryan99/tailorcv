import { useContext } from 'react';
import { InterviewContext } from '../interview.context.jsx';

export function useInterviewContext() {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error('useInterviewContext must be used within an InterviewProvider');
  }

  return context;
}

export default useInterviewContext;
