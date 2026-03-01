import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class SurveyTrigger {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    event!: string;

    @Column()
    surveyName!: string;

    @Column({ default: "active" })
    status!: string; // active, paused

    @CreateDateColumn()
    createdAt!: Date;
}
