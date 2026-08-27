export const isValidEmail = (email) => {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email)
  );
};

export const isValidPassword = (password) => {
  return (
    typeof password === "string" &&
    password.length >= 6 &&
    Buffer.byteLength(password, "utf8") <= 72
  );
};
