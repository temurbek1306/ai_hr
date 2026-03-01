import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Employee } from "./entities/Employee";
import { Test } from "./entities/Test";
import { Question } from "./entities/Question";
import { Option } from "./entities/Option";
import { TestResult } from "./entities/TestResult";
import { OnboardingMaterial } from "./entities/OnboardingMaterial";
import { Notification } from "./entities/Notification";
import { CalendarEvent } from "./entities/CalendarEvent";
import { Reminder } from "./entities/Reminder";
import { KnowledgeArticle } from "./entities/KnowledgeArticle";
import { Assignment } from "./entities/Assignment";
import { SurveyTrigger } from "./entities/SurveyTrigger";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [
        User, Employee, Test, Question, Option,
        TestResult, OnboardingMaterial, Notification,
        CalendarEvent, Reminder, KnowledgeArticle, Assignment,
        SurveyTrigger
    ],
    migrations: [],
    subscribers: [],
});
