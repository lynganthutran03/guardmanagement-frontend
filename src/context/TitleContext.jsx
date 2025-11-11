import { createContext, useState } from 'react';

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
    const [title, setTitle] = useState('');
    const [notificationCount, setNotificationCount] = useState(0);

    return (
        <TitleContext.Provider value={{
            title,
            setTitle,
            notificationCount,
            setNotificationCount
        }}>
            {children}
        </TitleContext.Provider>
    );
};