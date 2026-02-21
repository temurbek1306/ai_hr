import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Employee } from "./Employee";

@Entity()
export class Reminder {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    message!: string;

    @Column()
    scheduledAt!: Date;

    @Column({ default: false })
    sent!: boolean;

    @ManyToOne(() => Employee)
    employee!: Employee;

    @CreateDateColumn()
    createdAt!: Date;
}
