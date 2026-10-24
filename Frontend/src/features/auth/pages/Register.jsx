import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { loading, handleRegister } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const res = await handleRegister({ username, email, password });
        if (res?.success) {
            navigate("/");
        } else {
            setError(res?.message || "Registration failed. Please try again.");
        }
    };

    if (loading) {
        return (<main><h1>Loading......</h1></main>);
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                {error && <div style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor="username">Username</label>
                        <input
                            required
                            onChange={(e) => { setUsername(e.target.value); }}
                            type="text" name="username" id="username" placeholder='Enter Username' />
                    </div>
                    <div className='input-group'>
                        <label htmlFor="email">Email</label>
                        <input
                            required
                            onChange={(e) => { setEmail(e.target.value); }}
                            type="email" name="email" id="email" placeholder='Enter Email Address' />
                    </div>
                    <div className='input-group'>
                        <label htmlFor="password">Password</label>
                        <input
                            required
                            onChange={(e) => { setPassword(e.target.value); }}
                            type="password" name="password" id="password" placeholder='Enter Password' />
                    </div>
                    <button className='button primary-button'>Register</button>
                </form>
                <p>Already have an account? <Link to='/login'>Login</Link></p>
            </div>
        </main>
    );
};

export default Register;
