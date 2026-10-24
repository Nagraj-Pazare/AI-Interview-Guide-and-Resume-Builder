import '../auth.form.scss';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const res = await handleLogin({ email, password });
        if (res?.success) {
            navigate("/");
        } else {
            setError(res?.message || "Invalid email or password");
        }
    };

    if (loading) {
        return (<main><h1>Loading.....</h1></main>);
    }

    return (
        <main>
            <div className='top'>
                <h1>Access Your Resume Builder</h1>
                <p>Sign in to generate reports & PDFs</p>
            </div>
            <div className="form-container">
                <h1>Login</h1>
                {error && <div style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor="email">Email</label>
                        <input
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" 
                            required
                            onChange={(e) => { setEmail(e.target.value); }}
                            type="email" name="email" id="email" placeholder='Enter Email Address' />
                    </div>
                    <div className='input-group'>
                        <label htmlFor="password">Password</label>
                        <input
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" 
                            required
                            onChange={(e) => { setPassword(e.target.value); }}
                            type="password" name="password" id="password" placeholder='Enter Password' />
                    </div>
                    <button className='button primary-button'>Login</button>
                </form>
                <p>Don't have an account? <Link to='/register'>Register</Link></p>
            </div>
        </main>
    );
};

export default Login;
