// transcription.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Note } from './note.entitty';

@Entity()
export class Transcription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    filepath: string;

    @Column({ type: 'text' })
    transcription: string;

    @CreateDateColumn()
      created: Date;
    
    @UpdateDateColumn()
    updated: Date;

    @ManyToOne(() => Note, (note) => note.transcriptions, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'noteId' })
    note: Note;

    @Column({ nullable: true })
    noteId: number;
}
