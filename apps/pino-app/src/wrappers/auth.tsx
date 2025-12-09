import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel, useNavigate } from 'umi';

export default function AuthWrapper(props: any) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setInitialState } = useModel('@@initialState');

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = localStorage.getItem('token');

  //     if (!token) {
  //       navigate('/login');
  //       return;
  //     }

  //     try {
  //       const response = await fetch('/api/auth/me', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (response.ok) {
  //         const userData = await response.json();
  //         setIsAuthenticated(true);

  //         // Set current user in initial state
  //         setInitialState((s: any) => ({ ...s, currentUser: userData.data }));

  //         // Also store user data in localStorage for consistency
  //         localStorage.setItem('user', JSON.stringify(userData.data));
  //       } else {
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('user');
  //         navigate('/login');
  //       }
  //     } catch (error) {
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('user');
  //       navigate('/login');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, [navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return isAuthenticated ? props.children : null;
}
