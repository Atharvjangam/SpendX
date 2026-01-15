const Bank = require("../models/Bank");

// Add Bank
exports.addBank = async (req, res) => {
  const userId = req.user.id;

  try {
    const { bankName, accountHolderName, accountNumber, ifscCode, accountType, openingBalance } = req.body;

    // Validation
    if (!bankName || !accountHolderName || !accountNumber || !ifscCode || !accountType || openingBalance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBank = new Bank({
      userId,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      accountType,
      openingBalance,
    });

    await newBank.save();
    res.status(200).json(newBank);

  } catch (error) {
    console.error(error); // 👈 IMPORTANT for debugging
    res.status(500).json({ message: "Server Error.." });
  }
};

// Get All Banks
exports.getAllBanks = async (req, res) => {
  const userId = req.user.id;

  try {
    const banks = await Bank.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(banks);

  } catch (error) {
    console.error(error); // 👈 IMPORTANT for debugging
    res.status(500).json({ message: "Server Error.." });
  }
};

// Update Bank
exports.updateBank = async (req, res) => {
  try {
    const { bankName, accountHolderName, accountNumber, ifscCode, accountType, openingBalance } = req.body;

    const updatedBank = await Bank.findByIdAndUpdate(
      req.params.id,
      { bankName, accountHolderName, accountNumber, ifscCode, accountType, openingBalance },
      { new: true }
    );

    if (!updatedBank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json(updatedBank);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Bank
exports.deleteBank = async (req, res) => {
  try {
    await Bank.findByIdAndDelete(req.params.id);
    res.json({ message: "Bank deleted successfully.." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
