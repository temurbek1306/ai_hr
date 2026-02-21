import { DataSource } from "typeorm";
import { User } from "../../entities/User";
import { Test } from "../../entities/Test";
import { Question } from "../../entities/Question";
import { Option } from "../../entities/Option";
import { KnowledgeArticle } from "../../entities/KnowledgeArticle";
import bcrypt from "bcryptjs";

export const seedDatabase = async (dataSource: DataSource) => {
    const userRepository = dataSource.getRepository(User);
    const testRepository = dataSource.getRepository(Test);
    const articleRepository = dataSource.getRepository(KnowledgeArticle);
    const qRepository = dataSource.getRepository(Question);
    const oRepository = dataSource.getRepository(Option);

    // 1. Seed Admin
    const adminExists = await userRepository.findOne({ where: { username: "admin" } });
    if (!adminExists) {
        const adminPassword = await bcrypt.hash("admin123", 10);
        await userRepository.save(userRepository.create({
            username: "admin",
            email: "admin@ai-hr.com",
            password: adminPassword,
            role: "ROLE_ADMIN"
        }));
        console.log("✅ Admin seeded: admin / admin123");
    }

    // 2. Seed Default Test if none exist (CLEARED)

    // 3. Seed Articles if none exist (CLEARED)
};
