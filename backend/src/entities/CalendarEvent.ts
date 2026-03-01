import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class CalendarEvent {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column()
    date!: string; // ISO string or simple date

    @Column({ default: "EVENT" })
    type!: string; // MEETING, BIRTHDAY, etc.

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    createdBy!: User;

    @CreateDateColumn()
    createdAt!: Date;
}
