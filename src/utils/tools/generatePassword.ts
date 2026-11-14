import { init } from "@paralleldrive/cuid2";

export const generatePassword = init({
  random: Math.random,
  length: 16,
  fingerprint: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
});
