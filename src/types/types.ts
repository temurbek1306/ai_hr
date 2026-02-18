export interface Employee {
    id: string
    firstName: string
    lastName: string
    position: string
    department: Department
    email: string
    phone: string
    status: EmployeeStatus
    avatar?: string
    startDate: string
    salary: number
}

export type Department =
    | 'IT'
    | 'HR'
    | 'Marketing'
    | 'Sales'
    | 'Finance'
    | 'Operations'

export type EmployeeStatus =
    | 'active'
    | 'inactive'
    | 'on-leave'

export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'manager' | 'employee'
    avatar?: string
    department: Department
    position: string
}

export interface Activity {
    id: string
    type: 'employee-added' | 'employee-updated' | 'employee-deleted' | 'login'
    title: string
    description: string
    timestamp: string
    user: string
}

export interface DashboardStats {
    totalEmployees: number
    activeEmployees: number
    onLeave: number
    newThisMonth: number
}
