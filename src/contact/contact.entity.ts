import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: false })
    dnd: boolean;

    @Column({ unique: true })
    email: string;

    @Column()
    mobile: string;

    @Column({ default: false })
    isUser: boolean;

    @Column({ default: "" })
    usernames: string;

    @Column()
    address: string;

    @CreateDateColumn({ type: 'timestamptz' })
    create_date: Date;

}