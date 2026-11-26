import axios from 'axios';
import {
  ApiResponse,
  PageResponse,
  LostItem,
  FoundItem,
  Claim,
  Category,
  NotificationItem,
  UserProfile,
  DashboardStats,
  AdminDashboardData,
  User,
  ClaimStatus,
  ItemStatus
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401s gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthUrl = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthUrl) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/user/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  loginStudent: async (data: any) => {
    const res = await api.post<ApiResponse<any>>('/auth/login', data);
    return res.data;
  },
  loginAdmin: async (data: any) => {
    const res = await api.post<ApiResponse<any>>('/auth/admin/login', data);
    return res.data;
  },
  registerStudent: async (data: any) => {
    const res = await api.post<ApiResponse<any>>('/auth/register', data);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<ApiResponse<UserProfile>>('/auth/me');
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const categoryService = {
  getAll: async () => {
    const res = await api.get<ApiResponse<Category[]>>('/categories');
    return res.data;
  },
  create: async (data: Partial<Category>) => {
    const res = await api.post<ApiResponse<Category>>('/categories', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Category>) => {
    const res = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<void>>(`/categories/${id}`);
    return res.data;
  },
};

export const lostItemService = {
  search: async (params?: any) => {
    const res = await api.get<ApiResponse<PageResponse<LostItem>>>('/lost-items', { params });
    return res.data;
  },
  getRecent: async () => {
    const res = await api.get<ApiResponse<LostItem[]>>('/lost-items/recent');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<LostItem>>(`/lost-items/${id}`);
    return res.data;
  },
  getMyItems: async (params?: any) => {
    const res = await api.get<ApiResponse<PageResponse<LostItem>>>('/lost-items/my-items', { params });
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post<ApiResponse<LostItem>>('/lost-items', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await api.put<ApiResponse<LostItem>>(`/lost-items/${id}`, data);
    return res.data;
  },
  updateStatus: async (id: number, status: ItemStatus, remarks?: string) => {
    const res = await api.patch<ApiResponse<LostItem>>(`/lost-items/${id}/status`, { status, remarks });
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<void>>(`/lost-items/${id}`);
    return res.data;
  },
};

export const foundItemService = {
  search: async (params?: any) => {
    const res = await api.get<ApiResponse<PageResponse<FoundItem>>>('/found-items', { params });
    return res.data;
  },
  getRecent: async () => {
    const res = await api.get<ApiResponse<FoundItem[]>>('/found-items/recent');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<FoundItem>>(`/found-items/${id}`);
    return res.data;
  },
  getMyItems: async (params?: any) => {
    const res = await api.get<ApiResponse<PageResponse<FoundItem>>>('/found-items/my-items', { params });
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post<ApiResponse<FoundItem>>('/found-items', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await api.put<ApiResponse<FoundItem>>(`/found-items/${id}`, data);
    return res.data;
  },
  updateStatus: async (id: number, status: ItemStatus, remarks?: string) => {
    const res = await api.patch<ApiResponse<FoundItem>>(`/found-items/${id}/status`, { status, remarks });
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<void>>(`/found-items/${id}`);
    return res.data;
  },
};

export const claimService = {
  submit: async (data: { foundItemId: number; claimDescription: string; identifyingDetails: string }) => {
    const res = await api.post<ApiResponse<Claim>>('/claims', data);
    return res.data;
  },
  getMyClaims: async (params?: any) => {
    const res = await api.get<ApiResponse<PageResponse<Claim>>>('/claims/my-claims', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<Claim>>(`/claims/${id}`);
    return res.data;
  },
  cancel: async (id: number) => {
    const res = await api.delete<ApiResponse<void>>(`/claims/${id}`);
    return res.data;
  },
  getClaimsForItem: async (foundItemId: number) => {
    const res = await api.get<ApiResponse<Claim[]>>(`/claims/item/${foundItemId}`);
    return res.data;
  },
};

export const adminService = {
  getDashboard: async () => {
    const res = await api.get<ApiResponse<AdminDashboardData>>('/admin/dashboard');
    return res.data;
  },
  getClaims: async (params?: { status?: ClaimStatus; search?: string; page?: number; size?: number }) => {
    const res = await api.get<ApiResponse<PageResponse<Claim>>>('/admin/claims', { params });
    return res.data;
  },
  reviewClaim: async (id: number, status: ClaimStatus, adminRemarks?: string) => {
    const res = await api.put<ApiResponse<Claim>>(`/admin/claims/${id}/review`, { status, adminRemarks });
    return res.data;
  },
  approveClaim: async (id: number, remarks?: string) => {
    const res = await api.put<ApiResponse<Claim>>(`/admin/claims/${id}/approve`, { remarks });
    return res.data;
  },
  rejectClaim: async (id: number, remarks?: string) => {
    const res = await api.put<ApiResponse<Claim>>(`/admin/claims/${id}/reject`, { remarks });
    return res.data;
  },
  completeClaim: async (id: number, remarks?: string) => {
    const res = await api.put<ApiResponse<Claim>>(`/admin/claims/${id}/complete`, { remarks });
    return res.data;
  },
  getStudents: async (params?: { search?: string; page?: number; size?: number }) => {
    const res = await api.get<ApiResponse<PageResponse<User>>>('/admin/students', { params });
    return res.data;
  },
  updateStudentStatus: async (id: number, status: string) => {
    const res = await api.patch<ApiResponse<User>>(`/admin/students/${id}/status`, { status });
    return res.data;
  },
  getAuditLogs: async () => {
    const res = await api.get<ApiResponse<any[]>>('/admin/audit-logs');
    return res.data;
  },
};

export const notificationService = {
  getRecent: async () => {
    const res = await api.get<ApiResponse<NotificationItem[]>>('/notifications');
    return res.data;
  },
  getAll: async (params?: any) => {
    const res = await api.get<ApiResponse<PageResponse<NotificationItem>>>('/notifications/all', { params });
    return res.data;
  },
  getUnreadCount: async () => {
    const res = await api.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return res.data;
  },
  markAsRead: async (id: number) => {
    const res = await api.put<ApiResponse<void>>(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async () => {
    const res = await api.put<ApiResponse<void>>('/notifications/read-all');
    return res.data;
  },
};

export const userService = {
  getStudentDashboard: async () => {
    const res = await api.get<ApiResponse<DashboardStats>>('/users/dashboard');
    return res.data;
  },
};

export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<{ imageUrl: string; fileName: string }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export default api;

