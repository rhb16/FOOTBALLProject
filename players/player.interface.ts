import { RowDataPacket } from 'mysql2';

export type Position = 'defender' | 'midfielder' | 'attacker';
export type NationalAssociation = 'England' | 'Northern Ireland' | 'Scotland' | 'Wales';

export interface Player extends RowDataPacket {
    id: number;
    firstName: string;
    lastName: string;
    APT: number;
    set_score: number;
    position: Position;
    nationalAssociation: NationalAssociation;
    AVG: number;
}