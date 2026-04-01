import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import {
  ICreateRoleDto,
  ICreateRoleResponse,
  LoginDto,
  PaginatedUsersResponse,
  RegisterDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
  UpdateUserRolesDto,
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

  async getUsers(
    search: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedUsersResponse> {
    try {
      const skip = (page - 1) * limit;
      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          skip,
          take: limit,
          orderBy: { name: "asc" },
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            roles: {
              include: { role: true },
            },
          },
          where: {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
        this.prisma.user.count({
          where: {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      ]);
      const usersWithRoleNamesAndDescriptions = users.map((user) => ({
        ...user,
        roles: user.roles.map((usr) => ({
          roleName: usr.role.name,
          roleDescription: usr.role.description,
        })),
      }));
      return {
        data: usersWithRoleNamesAndDescriptions,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
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

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            include: { role: true },
          },
        },
      });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return {
        ...user,
        roles: user.roles.map((usr) => ({
          roleName: usr.role.name,
          roleDescription: usr.role.description,
        })),
      };
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

  async getUserByEmail(email: string, withPassword?: boolean): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          password: withPassword,
          roles: {
            include: { role: true },
          },
        },
      });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return {
        ...user,
        roles: user.roles.map((usr) => ({
          roleName: usr.role.name,
          roleDescription: usr.role.description,
        })),
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof UnauthorizedException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      console.error("Unexpected error during getting user:", error);
      throw new InternalServerErrorException("Getting user failed");
    }
  }

  async register(registerDto: RegisterDto): Promise<UserRegisterResponseDto> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException(`User ${registerDto.email} already exists`);
      }

      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: registerDto.password,
          name: registerDto.name,
        },
      });

      const defaultRole = await this.prisma.role.findUnique({
        where: { name: "user" },
      });

      if (defaultRole) {
        await this.prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: defaultRole.id,
          },
        });
      }

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

  async removeUserById(userId: string): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User: ${userId} is not found`);
      }
      await this.prisma.$transaction([
        this.prisma.userRole.deleteMany({ where: { userId } }),
        this.prisma.user.delete({ where: { id: userId } }),
      ]);
      return userId;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error("Unexpected error during removing user:", error);
      throw new InternalServerErrorException("Removing user failed");
    }
  }

  async getRoles(): Promise<
    { id: number; name: string; description: string }[]
  > {
    try {
      const roles = await this.prisma.role.findMany();
      return roles;
    } catch (error) {
      console.error("Unexpected error during getting roles:", error);
      throw new InternalServerErrorException("Getting roles failed");
    }
  }

  async addRole(rolesDto: ICreateRoleDto): Promise<ICreateRoleResponse> {
    try {
      const existingRole = await this.prisma.role.findUnique({
        where: { name: rolesDto.name },
      });

      if (existingRole) {
        throw new ConflictException(`Role "${rolesDto.name}" already exists`);
      }

      const role = await this.prisma.role.create({
        data: {
          name: rolesDto.name,
          description: rolesDto.description,
        },
      });
      return {
        name: role.name,
        description: role.description,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error("Unexpected error during creating roles:", error);
      throw new InternalServerErrorException("Creating roles failed");
    }
  }

  async updateUser(dto: UpdateUserDto): Promise<string> {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!foundUser) {
        throw new NotFoundException(`User ${dto.email} is not exists`);
      }

      const updatedUser = await this.prisma.user.update({
        where: { email: dto.email },
        data: { name: dto.name },
      });

      return updatedUser.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error("Unexpected error during updating user:", error);
      throw new InternalServerErrorException("Updating user failed");
    }
  }

  async removeRoleByName(roleName: string): Promise<string> {
    try {
      if (roleName === "user") {
        throw new ConflictException(
          `Role "${roleName}" is default and cant be removed`,
        );
      }
      const foundRole = await this.prisma.role.findUnique({
        where: { name: roleName },
      });
      if (!foundRole) {
        throw new NotFoundException(`Role "${roleName}" is not found`);
      }
      await this.prisma.$transaction([
        this.prisma.userRole.deleteMany({ where: { roleId: foundRole.id } }),
        this.prisma.role.delete({ where: { name: roleName } }),
      ]);
      return foundRole.name;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error("Unexpected error during removing roles:", error);
      throw new InternalServerErrorException("Removing roles failed");
    }
  }

  async updateUserPassword(dto: UpdateUserPasswordDto): Promise<string> {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!foundUser) {
        throw new NotFoundException(`User "${dto.email}" is not found`);
      }

      const updatedUser = await this.prisma.user.update({
        where: { email: dto.email },
        data: { password: dto.newPassword },
      });

      return `Password for "${updatedUser.email}" changed successfully!`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error("Unexpected error during removing roles:", error);
      throw new InternalServerErrorException("Removing roles failed");
    }
  }

  async updateUserRoles(dto: UpdateUserRolesDto, userId: string): Promise<{message: string}> {
    try {
      const allRoles = await this.getRoles();
      const allRoleNames = allRoles.map(r => r.name);
      const missingRoles = dto.roles.filter(role => !allRoleNames.includes(role));

      if (missingRoles.length) {
        throw new BadRequestException(`Roles not found: ${missingRoles.join(', ')}`);
      }

      const roleIds = allRoles
        .filter(role => dto.roles.includes(role.name))
        .map(role => role.id);

      await this.prisma.$transaction([
        this.prisma.userRole.deleteMany({ where: { userId } }),
        this.prisma.userRole.createMany({
          data: roleIds.map(roleId => ({ userId, roleId })),
        }),
      ]);

      return { message: 'Roles updated successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error("Unexpected error during updating users roles:", error);
      throw new InternalServerErrorException("Updating users roles failed");
    }
  }
}
