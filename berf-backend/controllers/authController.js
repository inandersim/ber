const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword, email });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ userId: user._id }, 'secretkey');
  res.json({ token });
};

const ethers = require('ethers');
const abi = [
  // BerfToken ABI kısmını buraya ekleyin
];

const provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
const contract = new ethers.Contract(contractAddress, abi, wallet);

exports.rewardTokens = async (req, res) => {
  const { userAddress, amount } = req.body;

  try {
    const tx = await contract.mint(userAddress, ethers.utils.parseUnits(amount.toString(), 18));
    await tx.wait();

    res.status(200).json({ message: 'Tokens rewarded successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to reward tokens', error });
  }
};

