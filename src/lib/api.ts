/**
 * API client for Ordain.Church backend
 */

const API_URL = import.meta.env.VITE_API_URL || '';

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
    ordination_date?: string;
  };
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, full_name: string): Promise<AuthResponse> {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  // Marriage laws endpoints
  async getAllMarriageLaws() {
    return this.request('/api/marriage-laws/all');
  }

  async getMarriageLawByState(stateCode: string) {
    return this.request(`/api/marriage-laws/${stateCode}`);
  }

  async searchMarriageLaws(params: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/marriage-laws/search/query?${query}`);
  }

  // Ceremony builder endpoints
  async generateCeremony(data: {
    partner1_name: string;
    partner2_name: string;
    partner1_pronouns?: string;
    partner2_pronouns?: string;
    ceremony_type?: string;
    traditions?: string[];
    tone?: string;
    length?: string;
    include_vows?: boolean;
    include_readings?: boolean;
    include_rituals?: boolean;
    special_requests?: string;
  }) {
    return this.request('/api/ceremony-builder/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyCeremonies() {
    return this.request('/api/ceremony-builder/my-ceremonies');
  }

  async getCeremonyDetail(ceremonyId: number) {
    return this.request(`/api/ceremony-builder/${ceremonyId}`);
  }

  async getCeremonyTemplates() {
    return this.request('/api/ceremony-builder/templates');
  }

  async getTraditions() {
    return this.request('/api/ceremony-builder/traditions');
  }

  async getRituals() {
    return this.request('/api/ceremony-builder/rituals');
  }

  // Certificate endpoints
  async generateOrdinationCertificate(data: {
    minister_name: string;
    denomination?: string;
    specializations?: string[];
  }) {
    return this.request('/api/certificates/ordination/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateMarriageCertificate(data: {
    partner1_name: string;
    partner2_name: string;
    officiant_name: string;
    ceremony_date: string;
    ceremony_location: string;
  }) {
    return this.request('/api/certificates/marriage/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyCertificate(certificateId: string) {
    return this.request(`/api/certificates/verify/${certificateId}`);
  }

  async getMyCertificates() {
    return this.request('/api/certificates/my-certificates');
  }

  // Billing endpoints
  async getStripeMode() {
    return this.request('/api/billing/stripe-mode');
  }

  async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
    return this.request('/api/billing/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ price_id: priceId, success_url: successUrl, cancel_url: cancelUrl }),
    });
  }

  async getSubscription() {
    return this.request('/api/billing/subscription');
  }
}

export const api = new ApiClient();
