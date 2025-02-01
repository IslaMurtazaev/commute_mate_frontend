import { useMutation } from '@tanstack/react-query';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch('http://localhost:8000/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: credentials.email,
            password: credentials.password
        }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json() as Promise<LoginResponse>;
    },
  });
} 