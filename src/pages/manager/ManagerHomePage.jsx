import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';

const GuardHomePage = ({ user }) => {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => {
        setTitle('Trang Chủ Quản Lý');
    }, [setTitle]);

    return (
        <div className="guard-home-page">
            <h3>Xin chào, {user.fullName}!</h3>
            <p><strong>Mã nhân viên:</strong> {user.identityNumber}</p>
        </div>
    );
};

export default GuardHomePage;