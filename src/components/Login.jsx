import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        axios.post("http://localhost:8080/api/login", { username, password })
            .then(response => {
                if (response.data.success) {
                    onLoginSuccess(response.data);
                } else {
                    setError("Invalid credentials");
                }
            })
            .catch(() => setError("Login failed. Please try again."));
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
                {error && <p className="error-msg">{error}</p>}
            </div>
        </div>
    );
}

export default Login;