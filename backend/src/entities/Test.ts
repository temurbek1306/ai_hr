import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Question } from "./Question";

@Entity()
export class Test {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ nullable: true })
    videoUrl!: string;

    @Column({ default: 30 })
    duration!: number; // minutes

    @Column({ default: 70 })
    passingScore!: number;

    @OneToMany(() => Question, (question) => question.test)
    questions!: Question[];

    @CreateDateColumn()
    createdAt!: Date;

}
