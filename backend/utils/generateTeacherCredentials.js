const generateEmployeeId = async (Teacher) => {
  const count = await Teacher.countDocuments();

  return `TCH${1001 + count}`;
};

const generatePassword = () => {
  const random = Math.floor(1000 + Math.random() * 9000);

  return `Teacher@${random}`;
};

module.exports = {
  generateEmployeeId,
  generatePassword,
};