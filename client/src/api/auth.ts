import bcrypt from "bcryptjs";

export async function runBcryptExample(plainTextPassword: string) {
    // Example password
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
      console.log("Hashed Password:", hashedPassword);
  
      // Compare the hashed password with the plain text password
      const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
      console.log("Password Match:", isMatch);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  runBcryptExample("TestPassword");