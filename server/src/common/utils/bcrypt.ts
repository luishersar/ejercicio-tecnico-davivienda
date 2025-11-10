import * as bcrypt from 'bcrypt';

const bcryptLib = bcrypt as unknown as {
  hash(password: string, saltRounds: number): Promise<string>;
  compare(password: string, hashed: string): Promise<boolean>;
};

export const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;

  return await bcryptLib.hash(password, saltRounds);
};

export const checkIfPasswordMatches = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcryptLib.compare(password, hashedPassword);
};
