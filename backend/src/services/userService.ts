import * as userRepo from "../repository/userRepo";
import { ApiError } from "../utils/apiError";
import { UserDocument } from "../repository/userRepo";
import { RegisterInput, LoginInput } from "../db/schema/user.schema.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from "../utils/jwt";
import crypto from "crypto";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const mapToDTO = (user: UserDocument): UserDto => {
  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const register = async (data: RegisterInput): Promise<UserDto> => {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) {
    throw new ApiError(409, "User already exists");
  }

  const newUser = await userRepo.createUser(data);
  return mapToDTO(newUser);
};

export const login = async (data: LoginInput): Promise<UserDto> => {
  const user = await userRepo.findByEmail(data.email);
  if (!user) {
    throw new ApiError(409, "User does not exist");
  }

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) {
    throw new ApiError(401, "Invalid credentials");
  }

  return mapToDTO(user);
};

export const createTokensAndSave = async (user: UserDto) => {
  const tokenPayload: TokenPayload = {
    id: user.id,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await userRepo.updateUser(user.id, {
    refreshToken: hashedRefreshToken,
  });

  return { accessToken, refreshToken };
};

export const rotateRefreshToken = async (oldToken: string) => {
  let decoded: TokenPayload;
  try {
    decoded = verifyRefreshToken(oldToken);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await userRepo.findById(decoded.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(oldToken)
    .digest("hex");

  const isMatch = user.refreshToken === hashedRefreshToken;

  if (!isMatch) {
    throw new ApiError(401, "Refresh token mismatch");
  }

  const safeUser = mapToDTO(user);
  const { accessToken, refreshToken } = await createTokensAndSave(safeUser);

  return { accessToken, refreshToken, user: safeUser };
};

export const logout = async (userId: string) => {
  if (userId) return;
  await userRepo.updateUser(userId, { refreshToken: "" });
};
