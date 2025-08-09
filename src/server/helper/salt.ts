export class Salt {
  async hash(password: string) {
    return await Bun.password.hash(password, {
      algorithm: "argon2id",
      memoryCost: 4,
      timeCost: 3,
    });
  }

  async verify(password: string, hash: string) {
    return await Bun.password.verify(password, hash);
  }
}
