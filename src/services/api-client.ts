// API Client for MDSE Paystub Generator
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7154/api';

export interface ApiDriverInfo {
    name: string;
    address: string;
    ssn: string;
    payPeriodStart?: string;
    payPeriodEnd?: string;
}

export interface ApiRoutes {
    fourHourRoutes: number;
    sixHourRoutes: number;
}

export interface ApiRouteRates {
    fourHourRate: number;
    sixHourRate: number;
}

export interface ApiCustomItem {
    id: string;
    name: string;
    quantity: number;
    rate: number;
}

export interface ApiIncentives {
    pickUp: number;
    gas: number;
    rushHourDelivery: number;
    lateNightDelivery: number;
    highQuantityDelivery: number;
}

export interface ApiIncentiveRates {
    pickUpRate: number;
    gasRate: number;
    rushHourRate: number;
    lateNightRate: number;
    highQuantityRate: number;
}

export interface ApiStatDelivery {
    miles: number;
}

export interface ApiStatRate {
    mileRate: number;
}

export interface ApiPaystubData {
    driverInfo: ApiDriverInfo;
    routes: ApiRoutes;
    routeRates: ApiRouteRates;
    customRoutes: ApiCustomItem[];
    incentives: ApiIncentives;
    incentiveRates: ApiIncentiveRates;
    customIncentives: ApiCustomItem[];
    statDelivery: ApiStatDelivery;
    statRate: ApiStatRate;
    customStatDeliveries: ApiCustomItem[];
    notes: string;
}

export interface ApiPaystubCalculation {
    routesTotal: number;
    incentivesTotal: number;
    statDeliveryTotal: number;
    grandTotal: number;
}

export interface ApiPaystubResponse {
    data: ApiPaystubData;
    calculations: ApiPaystubCalculation;
    generatedAt: string;
}

export interface ApiPaystubTemplate {
    id: string;
    name: string;
    createdAt: string;
    data: ApiPaystubData;
}

export interface ApiCreateTemplateRequest {
    name: string;
    data: ApiPaystubData;
}

class PaystubApiClient {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Generate paystub with calculations
    async generatePaystub(data: ApiPaystubData): Promise<ApiPaystubResponse> {
        return this.request<ApiPaystubResponse>('/Paystub/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Generate and download PDF
    async generatePaystubPdf(data: ApiPaystubData): Promise<Blob> {
        const url = `${API_BASE_URL}/Paystub/generate-pdf`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.blob();
    }

    // Calculate totals only
    async calculateTotals(data: ApiPaystubData): Promise<ApiPaystubCalculation> {
        return this.request<ApiPaystubCalculation>('/Paystub/calculate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Template management
    async getTemplates(): Promise<ApiPaystubTemplate[]> {
        return this.request<ApiPaystubTemplate[]>('/Paystub/templates');
    }

    async getTemplate(id: string): Promise<ApiPaystubTemplate> {
        return this.request<ApiPaystubTemplate>(`/Paystub/templates/${id}`);
    }

    async saveTemplate(request: ApiCreateTemplateRequest): Promise<ApiPaystubTemplate> {
        return this.request<ApiPaystubTemplate>('/Paystub/templates', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async deleteTemplate(id: string): Promise<void> {
        return this.request<void>(`/Paystub/templates/${id}`, {
            method: 'DELETE',
        });
    }

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
        return this.request<{ status: string; timestamp: string; service: string }>('/Paystub/health');
    }
}

export const paystubApi = new PaystubApiClient();

// Helper function to download PDF
export const downloadPdf = async (data: ApiPaystubData, filename?: string) => {
    try {
        const blob = await paystubApi.generatePaystubPdf(data);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `paystub_${data.driverInfo.name?.replace(/\s+/g, '_') || 'driver'}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw error;
    }
};