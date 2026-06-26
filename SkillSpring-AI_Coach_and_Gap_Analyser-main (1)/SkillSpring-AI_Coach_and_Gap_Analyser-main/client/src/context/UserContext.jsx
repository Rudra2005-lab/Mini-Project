import { createContext, useContext, useState } from 'react';

const mockUser = {
  id: 'local-dev',
  name: 'Ronit Mexson',
  role: 'student',
  email: 'ronit@local.dev',
  targetRole: 'Frontend Developer',
};

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skillspring_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const loginUser = () => {
    setUser(mockUser);
    localStorage.setItem('skillspring_user', JSON.stringify(mockUser));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('skillspring_user');
  };

  return (
    <UserContext.Provider value={{ user, isLoading: false, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
