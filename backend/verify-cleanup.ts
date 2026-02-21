import "reflect-metadata";
import { AppDataSource } from "./src/data-source";
import { KnowledgeArticle } from "./src/entities/KnowledgeArticle";
import { Test } from "./src/entities/Test";

async function verify() {
    try {
        await AppDataSource.initialize();
        const articleCount = await AppDataSource.getRepository(KnowledgeArticle).count();
        const testCount = await AppDataSource.getRepository(Test).count();
        console.log(`ARTICLES: ${articleCount}`);
        console.log(`TESTS: ${testCount}`);
        await AppDataSource.destroy();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
verify();
