import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Employee } from "./Employee";

@Entity()
export class KnowledgeArticle {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column({ type: "text" })
    content!: string;

    @Column({ default: "ARTICLE" })
    type!: string; // ARTICLE, VIDEO, etc.

    @Column({ nullable: true })
    mediaUrl!: string;

    @Column({ default: "PUBLISHED" })
    status!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
