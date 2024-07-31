const bcrypt = require("bcrypt");

const newPassword = "admin12345"; // Replace with your desired new password
const saltRounds = 10;

bcrypt.hash(newPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error generating hash:", err);
  } else {
    console.log("New password hash:", hash);
  }
});
