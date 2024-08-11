import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

const validPositions = ['defender', 'midfielder', 'attacker'] as const;
const validNationalAssociations = ['england', 'northern ireland', 'scotland', 'wales'] as const;

const playerSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    APT: yup.number().required().positive().integer(),
    set_score: yup.number().required().positive().integer(),
    position: yup.string()
        .transform(value => value.toLowerCase())
        .oneOf(validPositions, 'Position must be one of the following: defender, midfielder, attacker')
        .required(),
    nationalAssociation: yup.string()
        .transform(value => value.toLowerCase())
        .oneOf(validNationalAssociations, 'National Association must be one of the following: England, Northern Ireland, Scotland, Wales')
        .required()
});

const selectPlayersSchema = yup.object({
    defendersCount: yup.number().required().positive().integer(),
    midfieldersCount: yup.number().required().positive().integer(),
    attackersCount: yup.number().required().positive().integer()
});

const validatePlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await playerSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: (error as yup.ValidationError).message });
    }
};

const validateSelectPlayers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await selectPlayersSchema.validate(req.query);
        next();
    } catch (error) {
        res.status(400).json({ error: (error as yup.ValidationError).message });
    }
};

export {
    validatePlayer,
    validateSelectPlayers
};
