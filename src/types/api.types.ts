// API Type Definitions - Generated from Swagger API Documentation
// Base URL: http://94.241.141.229:8000

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T = any> {
    message: string;
    success: boolean;
    status: string;
    body?: T;
}

// ====================================// ==================== Authentication ====================

export interface AuthLogin {
    username: string;  // Backend expects "username" not "email"
    password: string;
}

export interface AuthRegister {
    fullName: string;
    phoneNumber?: string;
    username: string;
    age?: number;
    password: string;
}

export interface LoginResponse {
    token: string;
    role: string;
    username: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

// ============================================================================
// Employee Types
// ============================================================================

export interface AdminEmployeeDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    status: string;
    startDate: string;
    avatar?: string;
    salary?: number;
}

export interface AdminEmployeeCreateDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    salary?: number;
    startDate: string;
}

export interface CreateEmployeeDto {
    fullName: string;
    password: string;
}

export interface EmployeeRegisterRequest {
    username: string;
    telegram_id: number;
    full_name: string;
}

export type EmployeeStatus =
    | 'CREATED'
    | 'NDA_PENDING'
    | 'NDA_ACCEPTED'
    | 'ONBOARDING_IN_PROGRESS'
    | 'ONBOARDING_COMPLETED'
    | 'TEST_IN_PROGRESS'
    | 'TEST_COMPLETED';

export interface EmployeeProfileDto {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    avatar?: string;
    username: string;
    telegramId?: number;
    status: EmployeeStatus;
    ndaAccepted: boolean;
    mentorId?: string;
    mentorName?: string;
    mentorContact?: string;
}

export interface EmployeeSummaryDTO {
    employeeId: string;
    employeeName: string;
    totalTests: number;
    testsCompleted: number;
    averageScore: number;
    totalOnboardingMaterials: number;
    completedOnboardingMaterials: number;
    testResults: TestResultDTO[];
}

export interface TestResultDTO {
    testId: string;
    testTitle: string;
    score: number;
}

// ============================================================================
// Test Types
// ============================================================================

export type TestType = 'PRE' | 'POST' | 'QUALIFICATION' | 'GENERAL';

export interface TestDTO {
    id: string;
    title: string;
    questionsCount?: number;
    duration?: number;
    createdAt?: string;
    status?: string;
}

export interface TestQuestionCreateDto {
    questionText: string;
    options: string[];
    correctAnswer: string;
}

export interface TestCreateDto {
    title: string;
    type: TestType;
    passScore: number;
    questions: TestQuestionCreateDto[];
}

export interface TestQuestionCreateDto {
    questionText: string;
    options: string[];
    correctAnswer: string;
}

export interface QuestionDTO {
    id: string;
    questionText: string;
    options: string[];
}

export interface TestDetailDto {
    id: string;
    title: string;
    type: TestType;
    passScore: number;
    questions: QuestionDTO[];
}

export interface TestAnswerDTO {
    questionId: string;
    selectedOptionId: string;
    answer?: string;
}

export interface TestSubmitRequestDto {
    employeeId: string;
    answers: TestAnswerDTO[];
}

export interface TestAnalyticsDto {
    totalAttempts: number;
    completedAttempts: number;
    passedAttempts: number;
    averageScore: number;
}

export interface TestResultItemDto {
    id: string;
    testTitle: string;
    score: number;
    passed: boolean;
    completedAt: string;
    employeeName?: string;
    totalQuestions?: number;
    correctAnswers?: number;
}

export interface TestResultsResponseDto {
    testTitle: string;
    results: TestResultItemDto[];
}

export interface TestReportByTestDto {
    testTitle: string;
    completed: number;
    averageScore: number;
    passRate: number;
}

export interface TestReportResponseDto {
    totalTests: number;
    completedTests: number;
    averageScore: number;
    passRate: number;
    byTest: TestReportByTestDto[];
}

// ============================================================================
// Survey Types
// ============================================================================

export interface SurveyDto {
    id: string;
    title: string;
    description: string;
}

export interface SurveyQuestionDto {
    id: string;
    questionText: string;
    options: string[];
}

export interface SurveyAnswerDto {
    questionId: string;
    answer: string;
}

export interface SurveyResponseDto {
    employeeId: string;
    answers: SurveyAnswerDto[];
}

export interface SurveyAnswerDetailDto {
    employeeId: string;
    questionId: string;
    answer: string;
}

// ============================================================================
// Knowledge Base Types
// ============================================================================

export interface KnowledgeCategoryDto {
    id: string;
    name: string;
}

export interface KnowledgeArticleDto {
    id: string;
    title: string;
    content: string;
    telegramFileId?: string;
    categoryId: string;
    categoryName?: string;
    createdAt: string;
}

export interface KnowledgeArticleVersionDto {
    id: string;
    articleId: string;
    title: string;
    content: string;
    createdAt: string;
}

export interface KnowledgePermissionDto {
    articleId: string;
    employeeIds: string[];
}

// ============================================================================
// Notification Types
// ============================================================================

export interface NotificationDto {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

export interface NotificationPageDto {
    content: NotificationDto[];
    unreadCount: number;
}

// ============================================================================
// Onboarding Types
// ============================================================================

export interface OnboardingMaterialDTO {
    id: string;
    title: string;
    description: string;
    contentType: string;
    contentUrl: string;
    telegramFileId?: string;
    orderIndex: number;
}

export interface OnboardingProgressDTO {
    materialId: string;
    completed: boolean;
}

export interface OnboardingStatusAnalyticsDto {
    successful: number;
    inProgress: number;
    pending: number;
}

// ============================================================================
// Analytics & Dashboard Types
// ============================================================================

export interface AnalyticsOverviewDto {
    totalEmployees: number;
    activeEmployees: number;
    completedTests: number;
    completedSurveys: number;
    averageTestScore: number;
    knowledgeArticles: number;
    articleViews: number;
}

export interface AdminDashboardDto {
    totalEmployees: number;
    ndaAcceptedEmployees: number;
    onboardingCompletedEmployees: number;
    testsCompleted: number;
    surveyResponses: number;
}

export interface AdminDashboardChartPointDto {
    date: string;
    count: number;
}

export interface AdminDashboardSummaryDto {
    totalEmployees: number;
    activeEmployees: number;
    onLeave: number;
    newThisMonth: number;
    chartData: AdminDashboardChartPointDto[];
}

export interface AdminDashboardExtendedDto {
    successfulPreTests: number;
    successfulPostTests: number;
    completedOnboardings: number;
    qualificationImprovements: number;
    completedSurveys: number;
}

export interface AdminDepartmentAnalyticsDto {
    name: string;
    score: number;
    color: string;
}

export interface AdminActivityDto {
    id: string;
    user: string;
    avatar?: string;
    action: string;
    time: string;
}

// ============================================================================
// Report Types
// ============================================================================

export interface ReportDto {
    id: string;
    title: string;
    type: string;
    date: string;
    size: string;
    status: string;
    downloadUrl: string;
}

export interface ReportGenerateDto {
    type: string;
    period: string;
}

export interface DepartmentCountDto {
    department: string;
    count: number;
}

export interface EmployeeReportResponseDto {
    start: string;
    end: string;
    totalEmployees: number;
    newHires: number;
    terminations: number;
    byDepartment: DepartmentCountDto[];
}

// ============================================================================
// Event/Calendar Types
// ============================================================================

export interface EventDto {
    id: string;
    title: string;
    date: string;
    type: string;
    description: string;
    createdBy: string;
}

// ============================================================================
// Profile & Settings Types
// ============================================================================

export interface ProfileUpdateDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    language?: string;
}

export interface PasswordChangeDto {
    currentPassword: string;
    newPassword: string;
}

export interface NotificationSettingsDto {
    newEmployee: boolean;
    application: boolean;
    news: boolean;
}

// ============================================================================
// Assignment Types
// ============================================================================

export type AssignmentType = 'TEST' | 'SURVEY' | 'MATERIAL';

export interface AssignmentDto {
    id: string;
    assignmentType: AssignmentType;
    referenceId: string;
    createdAt: string;
}

export interface AssignmentCreateDto {
    assignmentType: AssignmentType;
    referenceId: string;
}

// ============================================================================
// Feedback Types
// ============================================================================

export interface FeedbackDTO {
    id: string;
    employeeId: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

// ============================================================================
// Reminder Types
// ============================================================================

export interface ReminderDto {
    id: string;
    employeeId: string;
    message: string;
    scheduledAt: string;
    sent: boolean;
}

// ============================================================================
// Content Types
// ============================================================================

export interface ContentDto {
    id: string;
    title: string;
    category: string;
    type: string;
    content: string;
    mediaUrl?: string;
    createdAt: string;
}

export interface ContentCreateDto {
    title: string;
    category: string;
    type: string;
    content: string;
    mediaUrl?: string;
}

// ============================================================================
// Upload Types
// ============================================================================

export interface UploadResponseDto {
    url: string;
    type: string;
    size: number;
    filename: string;
}

// ============================================================================
// Role & Permission Types
// ============================================================================

export interface RolePermissionDto {
    role: string;
    permissions: Record<string, any>;
}
