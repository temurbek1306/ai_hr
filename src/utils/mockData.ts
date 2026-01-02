import { Employee, Activity } from '../types/types'

export const mockEmployees: Employee[] = [
    {
        id: '1',
        firstName: 'Aziz',
        lastName: 'Karimov',
        position: 'Senior Frontend Developer',
        department: 'IT',
        email: 'aziz.karimov@aihr.uz',
        phone: '+998 90 123 45 67',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=12',
        startDate: '2023-01-15',
        salary: 8000000
    },
    {
        id: '2',
        firstName: 'Malika',
        lastName: 'Rashidova',
        position: 'HR Manager',
        department: 'HR',
        email: 'malika.rashidova@aihr.uz',
        phone: '+998 91 234 56 78',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=45',
        startDate: '2023-02-20',
        salary: 6500000
    },
    {
        id: '3',
        firstName: 'Bobur',
        lastName: 'Aliyev',
        position: 'Marketing Lead',
        department: 'Marketing',
        email: 'bobur.aliyev@aihr.uz',
        phone: '+998 93 345 67 89',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=33',
        startDate: '2023-03-10',
        salary: 7000000
    },
    {
        id: '4',
        firstName: 'Dilnoza',
        lastName: 'Yusupova',
        position: 'Sales Manager',
        department: 'Sales',
        email: 'dilnoza.yusupova@aihr.uz',
        phone: '+998 94 456 78 90',
        status: 'on-leave',
        avatar: 'https://i.pravatar.cc/150?img=27',
        startDate: '2023-04-01',
        salary: 6000000
    },
    {
        id: '5',
        firstName: 'Jamshid',
        lastName: 'Nazarov',
        position: 'Backend Developer',
        department: 'IT',
        email: 'jamshid.nazarov@aihr.uz',
        phone: '+998 90 567 89 01',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=68',
        startDate: '2023-05-15',
        salary: 7500000
    },
    {
        id: '6',
        firstName: 'Nigora',
        lastName: 'Salimova',
        position: 'Accountant',
        department: 'Finance',
        email: 'nigora.salimova@aihr.uz',
        phone: '+998 91 678 90 12',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=38',
        startDate: '2023-06-01',
        salary: 5500000
    },
    {
        id: '7',
        firstName: 'Otabek',
        lastName: 'Tashmatov',
        position: 'UI/UX Designer',
        department: 'IT',
        email: 'otabek.tashmatov@aihr.uz',
        phone: '+998 93 789 01 23',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=51',
        startDate: '2023-07-10',
        salary: 6500000
    },
    {
        id: '8',
        firstName: 'Sevara',
        lastName: 'Mahmudova',
        position: 'Content Manager',
        department: 'Marketing',
        email: 'sevara.mahmudova@aihr.uz',
        phone: '+998 94 890 12 34',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=44',
        startDate: '2023-08-01',
        salary: 5000000
    },
    {
        id: '9',
        firstName: 'Rustam',
        lastName: 'Abdullayev',
        position: 'DevOps Engineer',
        department: 'IT',
        email: 'rustam.abdullayev@aihr.uz',
        phone: '+998 90 901 23 45',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=14',
        startDate: '2023-09-15',
        salary: 8500000
    },
    {
        id: '10',
        firstName: 'Zilola',
        lastName: 'Raximova',
        position: 'HR Specialist',
        department: 'HR',
        email: 'zilola.raximova@aihr.uz',
        phone: '+998 91 012 34 56',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=29',
        startDate: '2023-10-01',
        salary: 4500000
    },
    {
        id: '11',
        firstName: 'Farrux',
        lastName: 'Ismoilov',
        position: 'Sales Representative',
        department: 'Sales',
        email: 'farrux.ismoilov@aihr.uz',
        phone: '+998 93 123 45 67',
        status: 'inactive',
        avatar: 'https://i.pravatar.cc/150?img=59',
        startDate: '2023-11-10',
        salary: 4000000
    },
    {
        id: '12',
        firstName: 'Madina',
        lastName: 'Sharipova',
        position: 'Financial Analyst',
        department: 'Finance',
        email: 'madina.sharipova@aihr.uz',
        phone: '+998 94 234 56 78',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=32',
        startDate: '2023-12-01',
        salary: 6000000
    },
    {
        id: '13',
        firstName: 'Sardor',
        lastName: 'Ergashev',
        position: 'Operations Manager',
        department: 'Operations',
        email: 'sardor.ergashev@aihr.uz',
        phone: '+998 90 345 67 89',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=70',
        startDate: '2024-01-15',
        salary: 7000000
    },
    {
        id: '14',
        firstName: 'Gulnora',
        lastName: 'Azimova',
        position: 'QA Engineer',
        department: 'IT',
        email: 'gulnora.azimova@aihr.uz',
        phone: '+998 91 456 78 90',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=26',
        startDate: '2024-02-01',
        salary: 6000000
    },
    {
        id: '15',
        firstName: 'Timur',
        lastName: 'Lutfullayev',
        position: 'System Administrator',
        department: 'IT',
        email: 'timur.lutfullayev@aihr.uz',
        phone: '+998 93 567 89 01',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=56',
        startDate: '2024-03-10',
        salary: 7000000
    }
]

export const mockActivities: Activity[] = [
    {
        id: '1',
        type: 'employee-added',
        title: 'Yangi xodim qo\'shildi',
        description: 'Timur Lutfullayev IT bo\'limiga qo\'shildi',
        timestamp: '2024-03-10T09:00:00',
        user: 'Admin'
    },
    {
        id: '2',
        type: 'employee-updated',
        title: 'Xodim ma\'lumotlari yangilandi',
        description: 'Aziz Karimov profili tahrirlandi',
        timestamp: '2024-03-09T14:30:00',
        user: 'HR Manager'
    },
    {
        id: '3',
        type: 'login',
        title: 'Tizimga kirish',
        description: 'Admin tizimga kirdi',
        timestamp: '2024-03-09T08:15:00',
        user: 'Admin'
    }
]

// Helper functions
export const getEmployeesByDepartment = (department: string) => {
    return mockEmployees.filter(emp => emp.department === department)
}

export const getEmployeesByStatus = (status: string) => {
    return mockEmployees.filter(emp => emp.status === status)
}

export const searchEmployees = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return mockEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(lowerQuery) ||
        emp.lastName.toLowerCase().includes(lowerQuery) ||
        emp.email.toLowerCase().includes(lowerQuery) ||
        emp.position.toLowerCase().includes(lowerQuery)
    )
}
