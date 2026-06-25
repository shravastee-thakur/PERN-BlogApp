import * as userRepo from "../repository/userRepo";
import { ApiError } from "../utils/apiError";
import { UserDocument } from "../repository/userRepo";
import { RegisterInput, LoginInput } from "../db/schema/user.schema.js";

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
