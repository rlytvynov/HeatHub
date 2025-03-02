import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthProvider';
import SocketProvider from './contexts/SocketProvider';

const root = ReactDOM.createRoot( document.getElementById('root') as HTMLElement);

root.render(
    <AuthProvider>
        <SocketProvider>
            <App />
        </SocketProvider>
    </AuthProvider>
);

