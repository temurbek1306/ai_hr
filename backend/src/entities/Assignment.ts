import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Employee } from "./Employee";

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Employee, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn()
    employee!: Employee;

    @Column()
    employeeId!: string;

    @Column({ default: "TEST" })
    assignmentType!: string; // TEST, MATERIAL, SURVEY etc.

    @Column({ nullable: true })
    referenceId!: string; // test id, material id etc.

    @Column({ nullable: true })
    title!: string;

    @Column({ default: "ASSIGNED" })
    status!: string; // ASSIGNED, COMPLETED

    @Column({ nullable: true })
    dueDate!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
