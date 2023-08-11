import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized">
      <div className="unauthorized-box">
        <h2>Unauthorized Access</h2>
        <p>
          You do not have permission to access this page. Please contact the
          administrator for assistance.
        </p>
        <a onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Back to Homepage
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
