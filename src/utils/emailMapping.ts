// Email to FullName mapping for employee login
// Since backend only accepts fullName, we map emails to fullNames on frontend

export const emailToFullNameMap: Record<string, string> = {
    // Test accounts
    'employee@gmail.com': 'Test Employee',
    'test@company.uz': 'Test User',

    // Company employees
    'aziz.rahimov@company.uz': 'Aziz Rahimov',
    'madina.aliyeva@company.uz': 'Madina Aliyeva',
    'jamshid.tursunov@company.uz': 'Jamshid Tursunov',
    'laylo.karimova@company.uz': 'Laylo Karimova',
    'bobur.sobirov@company.uz': 'Bobur Sobirov',
    'dilnoza.yusupova@company.uz': 'Dilnoza Yusupova',
    'sardor.mahmudov@company.uz': 'Sardor Mahmudov',
    'nilufar.ergasheva@company.uz': 'Nilufar Ergasheva',
    'otabek.karimov@company.uz': 'Otabek Karimov',
    'gulnora.sharipova@company.uz': 'Gulnora Sharipova',
};

/**
 * Convert email to username for backend login
 * Backend accepts email format directly as username
 */
export const getFullNameFromEmail = (email: string): string => {
    // Backend expects username field, but accepts email format
    // Just return the email as-is
    return email.trim();
};

/**
 * Check if input looks like an email
 */
export function isEmail(input: string): boolean {
    return input.includes('@');
}
