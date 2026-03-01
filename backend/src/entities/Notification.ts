import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column()
    message!: string;

    @Column({ default: "INFO" })
    type!: string;

    @Column({ default: false })
    read!: boolean;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    user!: User;


    @CreateDateColumn()
    createdAt!: Date;
}

