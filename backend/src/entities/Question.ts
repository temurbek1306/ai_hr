import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Test } from "./Test";
import { Option } from "./Option";

@Entity()
export class Question {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    text!: string;

    @Column({ default: "SINGLE" })
    type!: string; // SINGLE, MULTIPLE

    @ManyToOne(() => Test, (test) => test.questions)
    test!: Test;

    @OneToMany(() => Option, (option) => option.question)
    options!: Option[];

}
