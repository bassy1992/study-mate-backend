import { useState, useEffect } from 'react';
import { apiClient } from '@shared/api';

// Generic API hook for data fetching
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => setLoading(true) };
}

// Auth hooks
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.getProfile()
        .then(profile => {
          setUser(profile);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
}

// Specific hooks for different endpoints
export function useCourses() {
  return useApi(() => apiClient.getCourses());
}

export function useCourse(id: number) {
  return useApi(() => apiClient.getCourse(id), [id]);
}

export function useBECETests() {
  return useApi(() => apiClient.getBECETests());
}

export function useHealthCheck() {
  return useApi(() => apiClient.healthCheck());
}

// Bundle hooks
export function useBundles() {
  return useApi(() => apiClient.getBundles());
}

export function useBundle(slug: string) {
  return useApi(() => apiClient.getBundle(slug), [slug]);
}

// Purchase hooks
export function useUserPurchases(isAuthenticated: boolean = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.getUserPurchases();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  return { data, loading, error };
}

// Teacher hooks
export function useTeachers(featured?: boolean, subject?: string) {
  return useApi(() => apiClient.getTeachers(featured, subject), [featured, subject]);
}

export function useTeacher(id: number) {
  return useApi(() => apiClient.getTeacher(id), [id]);
}

// Dashboard stats hook
export function useDashboardStats(isAuthenticated: boolean = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.getDashboardStats();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  return { data, loading, error };
}

// Upcoming tasks hook
export function useUpcomingTasks(isAuthenticated: boolean = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.getUpcomingTasks();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  return { data, loading, error };
}

// Quiz hooks
export function useUserQuizzes(isAuthenticated: boolean = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.getUserQuizzes();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  return { data, loading, error, refetch: () => setLoading(true) };
}

export function useQuiz(slug: string) {
  return useApi(() => apiClient.getQuiz(slug), [slug]);
}