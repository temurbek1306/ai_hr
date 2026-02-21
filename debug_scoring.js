
const { DataSource } = require("typeorm");
const path = require("path");

async function checkDb() {
    const AppDataSource = new DataSource({
        type: "sqlite",
        database: "backend/database.sqlite",
        entities: [
            path.join(__dirname, "backend/src/entities/*.ts")
        ],
        synchronize: false,
    });

    try {
        await AppDataSource.initialize();
        console.log("Database initialized");

        const testId = "266352b0-d24a-46a9-9cfd-e1d2b581af58";

        // 1. Check Test and Questions
        const testRepo = AppDataSource.getRepository("Test");
        const test = await testRepo.findOne({
            where: { id: testId },
            relations: ["questions", "questions.options"]
        });

        if (!test) {
            console.log("Test not found");
            return;
        }

        console.log(`Test: ${test.title}`);
        console.log("Questions:");
        test.questions.forEach((q, i) => {
            console.log(`Q${i + 1} [${q.id}]: ${q.text}`);
            q.options.forEach((o, j) => {
                console.log(`  Opt${j + 1} [${o.id}] (Correct: ${o.isCorrect}): ${o.text}`);
            });
        });

        // 2. Check TestResults
        const trRepo = AppDataSource.getRepository("TestResult");
        const results = await trRepo.find({
            where: { test: { id: testId } },
            order: { createdAt: "DESC" },
            take: 5
        });

        console.log("\nRecent Results:");
        results.forEach((r, i) => {
            console.log(`Result ${i + 1} [${r.id}]: Score ${r.score}, Correct ${r.correctAnswers}/${r.totalQuestions}`);
            console.log(`  Answers: ${r.answersJson}`);
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await AppDataSource.destroy();
    }
}

checkDb();
