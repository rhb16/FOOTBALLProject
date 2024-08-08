const yup = require('yup');

const validPositions = ['defender', 'midfielder', 'attacker'];
const validNationalAssociations = ['england', 'northern ireland', 'scotland', 'wales'];

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

const searchPlayersSchema = yup.object({
  q: yup.string().required('Query parameter "q" is required.')
});

const validatePlayer = async (req, res, next) => {
  try {
    await playerSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const validateSelectPlayers = async (req, res, next) => {
  try {
    await selectPlayersSchema.validate(req.query);
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  validatePlayer,
  validateSelectPlayers
};