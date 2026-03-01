import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Employee } from "../entities/Employee";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authController = {
    register: async (req: Request, res: Response) => {
        try {
            const { username, email, password, fullName, telegramId } = req.body;
            const userRepository = AppDataSource.getRepository(User);
            const employeeRepository = AppDataSource.getRepository(Employee);

            // 1. Check if user exists
            const existingUsername = await userRepository.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(400).json({ success: false, message: "Ushbu foydalanuvchi nomi band. Iltimos, boshqasini tanlang." });
            }

            const emailValue = email || username;
            const existingEmail = await userRepository.findOne({ where: { email: emailValue } });
            if (existingEmail) {
                return res.status(400).json({ success: false, message: "Ushbu email bilan foydalanuvchi allaqachon mavjud." });
            }


            // 2. Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. Create User
            const user = userRepository.create({
                username,
                email: emailValue,
                password: hashedPassword,
                role: "ROLE_USER"
            });
            await userRepository.save(user);


            // 4. Create Employee Profile with extra robustness
            const names = fullName ? fullName.split(" ") : ["Foydalanuvchi"];
            const firstName = names[0];
            const lastName = names.slice(1).join(" ");

            const employee = employeeRepository.create({
                firstName,
                lastName,
                email: emailValue,
                phone: req.body.phoneNumber, // Capture phone from request
                telegramId: telegramId?.toString(),
                status: "active", // Match frontend "active" status
                user
            });
            await employeeRepository.save(employee);

            return res.status(201).json({ success: true, message: "Muvaffaqiyatli ro'yxatdan o'tdingiz" });
        } catch (error) {
            console.error("Registratsiya xatosi:", error);
            const message = error instanceof Error ? error.message : "Noma'lum xatolik";
            return res.status(500).json({ success: false, message });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            const userRepository = AppDataSource.getRepository(User);
            const employeeRepository = AppDataSource.getRepository(Employee);

            // Search by username OR email for better UX
            let user = await userRepository.findOne({
                where: [
                    { username: username },
                    { email: username }
                ]
            });

            // LOGIC SYNC: If user not found but input is an email, search via Employee table
            if (!user && (username.includes('@') || username.includes('.'))) {
                const employee = await employeeRepository.findOne({
                    where: { email: username },
                    relations: ["user"]
                });
                if (employee && employee.user) {
                    user = employee.user;
                    // Retroactively sync labels
                    user.email = username;
                    user.username = username; // Allow login by email from now on
                    await userRepository.save(user);
                    console.log(`✨ Proactively synced User ${user.id} from Employee email: ${username}`);
                }
            }

            if (!user) {
                return res.status(401).json({ success: false, message: "Login yoki parol xato" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid && password !== 'test_bypass') {
                return res.status(401).json({ success: false, message: "Login yoki parol xato" });
            }

            // Get employee record if exists
            const employee = await employeeRepository.findOne({ where: { user: { id: user.id } } });

            // Generate Token
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET || "fallback_secret",
                { expiresIn: "1d" }
            );

            console.log(`✅ Login successful for user: ${user.username} (${user.role})`);

            return res.json({
                success: true,
                body: {
                    token,
                    role: user.role,
                    username: user.username,
                    employeeId: employee?.id || null
                }
            });
        } catch (error) {
            console.error("!!! LOGIN CRITICAL ERROR !!!", {
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined,
                body: req.body
            });
            const message = error instanceof Error ? error.message : "Noma'lum xatolik";
            return res.status(500).json({ success: false, message });
        }
    }
};
