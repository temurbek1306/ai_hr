import "reflect-metadata";
import { AppDataSource } from "./src/data-source";
import { KnowledgeArticle } from "./src/entities/KnowledgeArticle";
import { Test } from "./src/entities/Test";
import { Question } from "./src/entities/Question";
import { Option } from "./src/entities/Option";

async function clear() {
    try {
        await AppDataSource.initialize();
        console.log("Connected to DB");

        const articleRepo = AppDataSource.getRepository(KnowledgeArticle);
        const testRepo = AppDataSource.getRepository(Test);
        const qRepo = AppDataSource.getRepository(Question);
        const oRepo = AppDataSource.getRepository(Option);

        await oRepo.delete({});
        await qRepo.delete({});
        await testRepo.delete({});
        await articleRepo.delete({});

        console.log("✅ Successfully cleared mock articles, tests, questions, and options.");
        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to clear DB:", error);
        process.exit(1);
    }
}

clear();
