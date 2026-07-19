const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const api = {
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    register: async (name, email, password) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    getMe: async () => {
      const res = await fetch(`${API_URL}/auth/me`, { headers: headers() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
  },
  resumes: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/resumes`, { headers: headers() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    getOne: async (id) => {
      const res = await fetch(`${API_URL}/resumes/${id}`, { headers: headers() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    create: async (title) => {
      const res = await fetch(`${API_URL}/resumes`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    update: async (id, resumeData) => {
      const res = await fetch(`${API_URL}/resumes/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(resumeData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    downloadPDF: async (id) => {
      const res = await fetch(`${API_URL}/resumes/${id}/pdf`, { headers: headers() });
      if (!res.ok) throw new Error('Failed to download PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
  },
};
