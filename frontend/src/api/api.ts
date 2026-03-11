import axios from 'axios';

const API_BASE_URL = ''; // Use proxy in dev, same origin in prod

export interface JobStatusResponse {
    status: string;
    page_count: number;
    created_at: string;
    filename: string;
    error?: string;
    pages?: {
        page_number: number;
        ocr_text: string;
        translated_text: string | null;
        grammar_analysis?: string | null;
        notes?: string | null;
    }[];
}

export const uploadPDF = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data as { job_id: string };
};

export const getJobStatus = async (jobId: string) => {
    const response = await axios.get(`${API_BASE_URL}/job/${jobId}`);
    return response.data as JobStatusResponse;
};

export const downloadResultPdf = (jobId: string) => {
    window.open(`${API_BASE_URL}/result/${jobId}`, '_blank');
};
