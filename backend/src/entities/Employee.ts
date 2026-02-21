import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true })
    videoUrl!: string;

    @Column({ nullable: true })
    startDate!: string;

    @Column({ nullable: true, type: "float" })
    salary!: number;

    @Column({ nullable: true })
    phone!: string;

    @Column({ nullable: true })
    location!: string;

    @Column({ nullable: true })
    position!: string;

    @Column({ nullable: true })
    department!: string;

    @Column({ nullable: true })
    avatar!: string;

    @Column({ nullable: true })
    telegramId!: string;

    @Column({ default: "CREATED" })
    status!: string;

    @Column({ default: false })
    ndaAccepted!: boolean;

    @Column({ nullable: true })
    mentorId!: string;

    @Column({ nullable: true })
    mentorName!: string;

    @Column({ nullable: true })
    mentorContact!: string;

    @OneToOne(() => User)
    @JoinColumn()
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
