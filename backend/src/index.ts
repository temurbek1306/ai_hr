import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { seedDatabase } from "./database/seeds";
import { errorHandler } from "./middleware/errorHandler";

// Route Imports
import authRoutes from "./routes/auth.routes";
import employeeRoutes from "./routes/employee.routes";
import testRoutes from "./routes/test.routes";
import knowledgeRoutes from "./routes/knowledge.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import analyticsRoutes from "./routes/analytics.routes";
import calendarRoutes from "./routes/calendar.routes";
import notificationRoutes from "./routes/notification.routes";
import miscRoutes from "./routes/misc.routes";
import surveyTriggerRoutes from "./routes/survey-trigger.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// 1. GLOBAL MIDDLEWARE
// =====================
app.use((req, res, next) => {
    console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. ROUTES
// =====================
app.get("/ping", (req, res) => res.send("PONG"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/admin/employees", employeeRoutes); // Compatibility mount
app.use("/api/v1", testRoutes);
app.use("/api/v1", knowledgeRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/admin/analytics", analyticsRoutes); // Compatibility mount
app.use("/api/v1", calendarRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1", surveyTriggerRoutes);
app.use("/api/v1", dashboardRoutes);
app.use("/api/v1", miscRoutes);

// 3. ERROR HANDLING
// =====================
app.use(errorHandler as any);

// 4. DATABASE & SERVER START
// =====================
AppDataSource.initialize()
    .then(async () => {
        console.log("✅ Data Source initialized!");

        // Seed database
        await seedDatabase(AppDataSource);

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/ping`);
        });
    })
    .catch((err) => console.error("❌ Error during Data Source initialization", err));
