import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Test } from "./Test";
import { Employee } from "./Employee";

@Entity()
export class TestResult {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ default: 0 })
    score!: number;

    @Column({ default: 0 })
    correctAnswers!: number;

    @Column({ default: 0 })
    totalQuestions!: number;

    // Store answers as plain text JSON string to avoid parse errors
    @Column({ type: "text", nullable: true, default: "{}" })
    answersJson!: string;

    @Column({ default: "PENDING" })
    status!: string; // PENDING, COMPLETED

    @ManyToOne(() => Employee, { nullable: true, onDelete: "SET NULL" })
    employee!: Employee;

    @ManyToOne(() => Test, { nullable: true, onDelete: "SET NULL" })
    test!: Test;

    @Column({ type: "datetime", nullable: true })
    completedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    // Helper: get answers as object
    get answers(): Record<string, string> {
        try {
            return JSON.parse(this.answersJson || "{}");
        } catch {
            return {};
        }
    }

    // Helper: set answers object
    set answers(val: Record<string, string> | null | any) {
        if (val === null || val === undefined) {
            this.answersJson = "{}";
        } else if (typeof val === "string") {
            this.answersJson = val;
        } else {
            this.answersJson = JSON.stringify(val);
        }
    }
}
