import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../services/auth.api';
import { deleteInterviewReport, getAllInterviewReports } from '../../interview/services/interview.api';
import '../../interview/styles/home.scss';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userResponse = await getMe();
        setUser(userResponse?.user ?? null);

        const reportsResponse = await getAllInterviewReports();
        setReports(reportsResponse?.interviewReports ?? []);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleDeleteReport = async (reportId) => {
    const confirmed = window.confirm('Delete this report?');
    if (!confirmed) return;

    try {
      await deleteInterviewReport(reportId);
      setReports((currentReports) => currentReports.filter((report) => report._id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete the report. Please try again.');
    }
  };

  return (
    <main className='interview-page profile-page'>
      <div className='interview-shell profile-shell'>
        <header className='interview-header profile-header'>
          <h1>
            Your <span>Profile</span>
          </h1>
          <p>
            {user ? `Welcome back, ${user.username || 'there'}!` : 'Loading your profile...'}
          </p>
        </header>

        <section className='profile-card'>
          <div className='profile-details'>
            <div className='profile-info-box'>
              <label className='profile-label'>Username</label>
              <h2>{user?.username || 'User'}</h2>
            </div>
          </div>

          <div className='profile-meta'>
            <span className='profile-email'>{user?.email || 'No email available'}</span>
          </div>
        </section>

        <section className='recent-reports profile-reports'>
          <h2>Your reports</h2>

          {loading ? (
            <p className='profile-empty'>Loading your reports...</p>
          ) : reports.length === 0 ? (
            <p className='profile-empty'>You have not generated any reports yet.</p>
          ) : (
            <ul className='report-list profile-report-list'>
              {reports.map((report) => (
                <li key={report._id} className='report-item profile-report-item'>
                  <div className='report-row'>
                    <button
                      type='button'
                      className='report-title-button'
                      onClick={() => navigate(`/interview/${report._id}`, { state: { report } })}
                    >
                      {report.title || 'Untitled Report'}
                    </button>
                    <button
                      type='button'
                      className='report-delete-button'
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteReport(report._id);
                      }}
                      aria-label={`Delete ${report.title || 'report'}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className='profile-actions'>
          <button style={{marginTop:10}} type='button' className='cta-button' onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
