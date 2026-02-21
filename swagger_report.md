# Swagger API Report

## admin-activity-controller
- GET /api/v1/admin/activities

## admin-analytics-controller
- GET /api/v1/admin/analytics/departments
- GET /api/v1/admin/analytics/onboarding-status

## admin-dashboard-controller
- GET /api/v1/admin/dashboard
- GET /api/v1/admin/dashboard/extended-stats
- GET /api/v1/admin/dashboard/summary

## admin-employee-controller
- DELETE /api/v1/admin/employees/{employeeId}
- GET /api/v1/admin/employees
- GET /api/v1/admin/employees/export
- GET /api/v1/admin/employees/template
- GET /api/v1/admin/employees/{employeeId}
- GET /api/v1/admin/employees/{employeeId}/assignments
- POST /api/v1/admin/employees
- POST /api/v1/admin/employees/cleanup-ghosts
- POST /api/v1/admin/employees/import
- POST /api/v1/admin/employees/{employeeId}/assignments
- PUT /api/v1/admin/employees/{employeeId}

## admin-test-controller
- GET /api/v1/admin/tests/{testId}
- POST /api/v1/admin/tests

## analytics-controller
- GET /api/v1/analytics/employees/{employeeId}/summary
- GET /api/v1/employees/{employeeId}/summary

## analytics-overview-controller
- GET /api/v1/analytics/extended
- GET /api/v1/analytics/overview

## auth-controller
- POST /auth/forgot-password
- POST /auth/login
- POST /auth/register

## auth-v-1-controller
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/login
- POST /api/v1/auth/register

## content-controller
- GET /api/v1/content
- POST /api/v1/content

## employee-controller
- GET /api/v1/employees/export
- GET /api/v1/employees/{employeeId}/assignments
- GET /api/v1/employees/{employeeId}/status
- POST /api/v1/employees
- POST /api/v1/employees/import
- POST /api/v1/employees/{employeeId}/assignments

## employee-me-controller
- GET /api/v1/employees/me/activities
- GET /api/v1/employees/me/feedback
- GET /api/v1/employees/me/growth
- GET /api/v1/employees/me/summary
- GET /api/v1/employees/me/test-results
- GET /api/v1/employees/me/test-results/export

## event-controller
- DELETE /api/v1/events/{id}
- GET /api/v1/events
- POST /api/v1/events

## feedback-controller
- POST /api/v1/feedback

## knowledge-base-controller
- GET /api/v1/knowledge/articles
- GET /api/v1/knowledge/articles/{articleId}/versions
- GET /api/v1/knowledge/categories
- POST /api/v1/knowledge/articles
- POST /api/v1/knowledge/categories
- POST /api/v1/knowledge/permissions
- PUT /api/v1/knowledge/articles/{articleId}

## mvp-controller
- GET /api/employees/{employeeId}/status
- GET /api/nda
- GET /api/onboarding/materials
- POST /api/employees/register
- POST /api/employees/{employeeId}/nda
- POST /api/onboarding/{employeeId}/progress
- POST /api/v1/employees/register

## nda-controller
- GET /api/v1/nda/current
- POST /api/v1/employees/{employeeId}/nda/accept

## notification-controller
- GET /api/v1/notifications
- PUT /api/v1/notifications/{id}/read

## onboarding-controller
- GET /api/v1/employees/{employeeId}/onboarding/materials
- POST /api/v1/employees/{employeeId}/onboarding/complete
- POST /api/v1/employees/{employeeId}/onboarding/progress

## onboarding-material-controller
- DELETE /api/v1/onboarding/materials/{materialId}
- GET /api/v1/onboarding/materials
- GET /api/v1/onboarding/materials/{materialId}
- POST /api/v1/onboarding/materials
- PUT /api/v1/onboarding/materials/{materialId}

## profile-controller
- GET /api/v1/employees/{employeeId}/profile

## profile-settings-controller
- GET /api/v1/employees/me
- GET /api/v1/employees/me/settings/notifications
- POST /api/v1/employees/me/avatar
- POST /api/v1/employees/me/password
- PUT /api/v1/employees/me
- PUT /api/v1/employees/me/settings/notifications

## reminder-controller
- GET /api/v1/reminders
- POST /api/v1/reminders
- POST /api/v1/reminders/{reminderId}/sent

## report-controller
- GET /api/v1/admin/reports
- GET /api/v1/reports
- GET /api/v1/reports/employees
- GET /api/v1/reports/tests
- GET /api/v1/reports/{reportId}/download
- POST /api/v1/admin/reports/generate

## role-permission-controller
- GET /api/v1/admin/permissions
- PUT /api/v1/admin/permissions/{role}

## survey-controller
- GET /api/v1/surveys
- GET /api/v1/surveys/{surveyId}/questions
- GET /api/v1/surveys/{surveyId}/responses
- POST /api/v1/surveys
- POST /api/v1/surveys/{surveyId}/questions
- POST /api/v1/surveys/{surveyId}/responses
- POST /api/v1/surveys/{surveyId}/submit

## test-controller
- DELETE /api/v1/tests/{testId}
- GET /api/v1/tests
- GET /api/v1/tests/available
- GET /api/v1/tests/video-info
- GET /api/v1/tests/{testId}/analytics
- GET /api/v1/tests/{testId}/results
- GET /api/v1/tests/{testId}/take
- POST /api/v1/tests
- POST /api/v1/tests/{sessionId}/answer
- POST /api/v1/tests/{sessionId}/finish
- POST /api/v1/tests/{testId}/start
- POST /api/v1/tests/{testId}/submit
- PUT /api/v1/tests/{testId}

## upload-controller
- POST /api/v1/upload/api/v1/upload

