import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  LoginDto,
  RegisterDto,
  User,
  UserLoginResponseDto,
  UserRegisterResponseDto,
} from "@carrent/shared";
import { PrismaService } from "./prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async sayHi() {
    return "Hi, i am USERS from users MS";
  }

  async getUsers(): Promise<User[]> {
    try {
      const allUsers = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return allUsers;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof UnauthorizedException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      console.error("Unexpected error during getting users:", error);
      throw new InternalServerErrorException("Getting users failed");
    }
  }

  async register(registerDto: RegisterDto): Promise<UserRegisterResponseDto> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException("User with this email already exists");
      }

      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: registerDto.password,
          name: registerDto.name,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof UnauthorizedException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      console.error("Unexpected error during registration:", error);
      throw new InternalServerErrorException("Registration failed");
    }
  }

  async login(loginDto: LoginDto): Promise<UserLoginResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error("Unexpected error during login:", error);
      throw new InternalServerErrorException("Login failed");
    }
  }
}
