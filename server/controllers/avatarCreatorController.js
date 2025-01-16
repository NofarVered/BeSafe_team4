
// Endpoint to get a random avatar
const createAvatar = (req, res) => {
  try {
    console.log("fdvsfd");
    const randomSeed = Math.random().toString(36).substring(7); // Generate random seed
    const avatarStyle = 'adventurer'; // Choose style
    const avatarUrl = `https://api.dicebear.com/6.x/${avatarStyle}/svg?seed=${randomSeed}`;
    
    // Send the avatar URL back to the client
    res.json({ avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating avatar');
  }
};

export {
    createAvatar
};

