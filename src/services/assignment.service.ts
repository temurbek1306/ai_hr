import api from '../api/axios';

export interface AssignmentDto {
    id: string;
    assignmentType: 'TEST' | 'SURVEY' | 'MATERIAL';
    referenceId: string;
    createdAt: string;
}

export interface AssignmentCreateDto {
    assignmentType: 'TEST' | 'SURVEY' | 'MATERIAL';
    referenceId: string;
}

export const assignmentService = {
    // Get assignments for an employee
    getAssignments: async (employeeId: string): Promise<AssignmentDto[]> => {
        const response = await api.get<AssignmentDto[]>(`/employees/${employeeId}/assignments`);
        return (response.data as any).body || response.data;
    },

    // Create new assignment for an employee
    createAssignment: async (employeeId: string, assignmentData: AssignmentCreateDto): Promise<AssignmentDto> => {
        const response = await api.post<AssignmentDto>(`/employees/${employeeId}/assignments`, assignmentData);
        return (response.data as any).body || response.data;
    },

    // Get assignments for bot (Telegram integration)
    getBotAssignments: async (employeeId: string): Promise<AssignmentDto[]> => {
        const response = await api.get<AssignmentDto[]>(`/bot/assignments?employeeId=${employeeId}`);
        return (response.data as any).body || response.data;
    }
};
