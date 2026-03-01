import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Question } from "./Question";

@Entity()
export class Option {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    text!: string;

    @Column({ default: false })
    isCorrect!: boolean;

    @ManyToOne(() => Question, (question) => question.options, { onDelete: "CASCADE" })
    question!: Question;
}

