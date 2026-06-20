const crypto =
require("crypto");



// ======================
// SECRET CONFIG
// ======================

const ALGORITHM =
"aes-256-cbc";

const SECRET_KEY =
crypto
.createHash("sha256")
.update(

  process.env
    .PAYMENT_SECRET_KEY
)
.digest("hex")
.substring(0, 32);

const IV_LENGTH = 16;



// ======================
// ENCRYPT
// ======================

const encrypt = (
  text = ""
) => {

  try {

    const iv =
      crypto.randomBytes(
        IV_LENGTH
      );

    const cipher =
      crypto.createCipheriv(

        ALGORITHM,

        SECRET_KEY,

        iv
      );

    let encrypted =
      cipher.update(

        text,

        "utf8",

        "hex"
      );

    encrypted +=
      cipher.final(
        "hex"
      );

    return (
      iv.toString("hex") +
      ":" +
      encrypted
    );

  } catch (error) {

    console.error(
      "ENCRYPT ERROR:",
      error
    );

    throw new Error(
      "Encryption failed"
    );
  }
};



// ======================
// DECRYPT
// ======================

const decrypt = (
  encryptedText = ""
) => {

  try {

    const parts =
      encryptedText.split(
        ":"
      );

    const iv =
      Buffer.from(
        parts[0],
        "hex"
      );

    const encryptedData =
      parts[1];

    const decipher =
      crypto.createDecipheriv(

        ALGORITHM,

        SECRET_KEY,

        iv
      );

    let decrypted =
      decipher.update(

        encryptedData,

        "hex",

        "utf8"
      );

    decrypted +=
      decipher.final(
        "utf8"
      );

    return decrypted;

  } catch (error) {

    console.error(
      "DECRYPT ERROR:",
      error
    );

    throw new Error(
      "Decryption failed"
    );
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  encrypt,

  decrypt
};