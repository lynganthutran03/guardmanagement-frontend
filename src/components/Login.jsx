import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        axios.post("http://localhost:8080/api/login", params, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(() => {
                return axios.get("http://localhost:8080/api/userinfo", {
                    withCredentials: true
                });
            })
            .then(response => {
                const userData = response.data;
                onLoginSuccess(userData);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setError("Tên đăng nhập hoặc mật khẩu không đúng.");
                } else {
                    setError("Đăng nhập thất bại. Vui lòng thử lại.");
                }
            });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng Nhập</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Tên tài khoản" value={username} onChange={e => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Đăng Nhập</button>
                </form>
                {error && <p className="error-msg">{error}</p>}
            </div>
        </div>
    );
}

export default Login;