import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class OnboardingMaterial {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column("text")
    content!: string;

    @Column({ nullable: true })
    mediaUrl!: string;

    @Column({ nullable: true })
    category!: string;

    @CreateDateColumn()
    createdAt!: Date;

}
