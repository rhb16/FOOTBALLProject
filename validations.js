const validPositions = ['defender', 'midfielder', 'attacker'];
const validNationalAssociations = ['england', 'northern ireland', 'scotland', 'wales'];

const validatePlayer = (req, res, next) => {
  const { firstName, lastName, APT, setScore, position, nationalAssociation } = req.body;
  if (!firstName || !lastName || isNaN(APT) || isNaN(setScore) || !position || !nationalAssociation) {
    return res.status(400).json({ message: 'All fields are required and APT/SET must be numbers.' });
  }
  if (!validPositions.includes(position.toLowerCase())) {
    return res.status(400).json({ message: 'Position must be one of the following: defender, midfielder, attacker.' });
  }
  const normalizedNationalAssociation = nationalAssociation.trim().toLowerCase();
  if (!validNationalAssociations.includes(normalizedNationalAssociation)) {
    return res.status(400).json({ message: 'National Association must be one of the following: England, Northern Ireland, Scotland, Wales.' });
  }
  next();
};

const validateselectplayers = (req, res, next) => {
    const { defendersCount, midfieldersCount, attackersCount } = req.query;
    if (!defendersCount || !midfieldersCount || !attackersCount) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }
    next(); 
  };
  const validateSearchPlayers = (req, res, next) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required.' });
    }
    next(); // Proceed to the next middleware or route handler
  };
  

module.exports = {
    validatePlayer,
    validateselectplayers,
    validateSearchPlayers
};