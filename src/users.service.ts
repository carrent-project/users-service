import { Injectable, HttpException } from "@nestjs/common";
import {
  ICreateRoleDto,
  ICreateRoleResponse,
  LoginDto,
  PaginatedUsersResponse,
  RegisterDto,
  UpdateRoleByNameDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
  UpdateUserRolesDto,
  User,
  UserLoginResponseDto,
  UserRegisterResponseDto,
} from "@carrent/shared";
import { PrismaService } from "./prisma.service";
import { internalErrorHandler } from "./utils";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
            phone: true,
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
              { phone: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
        this.prisma.user.count({
          where: {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
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
      if (error instanceof HttpException) {
        throw error;
      }

      console.error("Unexpected error during getting users:", error);
      throw internalErrorHandler(500, "Getting users failed");
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
          phone: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            include: { role: true },
          },
        },
      });
      if (!user) {
        throw internalErrorHandler(404, "User not found by id");
      }
      return {
        ...user,
        roles: user.roles.map((usr) => ({
          roleName: usr.role.name,
          roleDescription: usr.role.description,
        })),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error("Unexpected error during getting users by id:", error);
      throw internalErrorHandler(500, "Getting user by id failed");
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
          phone: true,
          createdAt: true,
          updatedAt: true,
          password: withPassword,
          roles: {
            include: { role: true },
          },
        },
      });
      if (!user) {
        throw internalErrorHandler(404, "User not found by email");
      }
      return {
        ...user,
        roles: user.roles.map((usr) => ({
          roleName: usr.role.name,
          roleDescription: usr.role.description,
        })),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during getting by email user:", error);
      throw internalErrorHandler(500, "Getting user by email failed");
    }
  }

  async register(registerDto: RegisterDto): Promise<UserRegisterResponseDto> {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: registerDto.email }, { phone: registerDto.phone }],
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          password: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            include: { role: true },
          },
        },
      });

      if (existingUser?.email === registerDto.email) {
        throw internalErrorHandler(409, `User ${registerDto.email} already exists`);
      }

      if (existingUser?.phone === registerDto.phone) {
        throw internalErrorHandler(409, `User with phone ${registerDto.phone} already exists`);
      }

      const defaultRole = await this.prisma.role.findUnique({
        where: { name: "user" },
      });

      if (!defaultRole) {
        throw internalErrorHandler(409, "Some troubles with roles");
      }

      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: registerDto.password,
          name: registerDto.name,
          phone: registerDto.phone,
        },
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
        phone: user.phone,
        roles: [
          {
            roleName: defaultRole?.name,
            roleDescription: defaultRole?.description,
          },
        ],
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during registration:", error);
      throw internalErrorHandler(500, "Registration failed");
    }
  }

  async login(loginDto: LoginDto): Promise<UserLoginResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            include: { role: true },
          },
        },
      });

      if (!user) {
        throw internalErrorHandler(401, "Invalid credentials");
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        phone: user.phone,
        roles: user.roles.map((usr) => ({
          roleName: usr.role.name,
          roleDescription: usr.role.description,
        })),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during login:", error);
      throw internalErrorHandler(500, "Login failed");
    }
  }

  async removeUserById(userId: string): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw internalErrorHandler(404, `User: ${userId} is not found`);
      }
      await this.prisma.$transaction([
        this.prisma.userRole.deleteMany({ where: { userId } }),
        this.prisma.user.delete({ where: { id: userId } }),
      ]);
      return userId;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during removing user:", error);
      throw internalErrorHandler(500, "Removing user failed");
    }
  }

  async getRoles(): Promise<
    { id: number; name: string; description: string }[]
  > {
    try {
      const roles = await this.prisma.role.findMany();
      return roles;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during getting roles:", error);
      throw internalErrorHandler(500, "Getting roles failed");
    }
  }

  async addRole(rolesDto: ICreateRoleDto): Promise<ICreateRoleResponse> {
    try {
      const existingRole = await this.prisma.role.findUnique({
        where: { name: rolesDto.name },
      });

      if (existingRole) {
        throw internalErrorHandler(409, `Role "${rolesDto.name}" already exists`);
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
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during creating roles:", error);
      throw internalErrorHandler(500, "Creating roles failed");
    }
  }

  async updateRoleByName(
    dto: UpdateRoleByNameDto,
  ): Promise<{ message: string }> {
    try {
      const allRoles = await this.getRoles();
      const isOldRoleExists = allRoles.map((r) => r.name).includes(dto.oldRole);
      if (!isOldRoleExists) {
        throw internalErrorHandler(400, `Role "${dto.oldRole} does not exists`);
      }

      if (dto.oldRole === dto.newRole) {
        return { message: `Role name unchanged` };
      }

      if (dto.oldRole === "user") {
        throw internalErrorHandler(400, `Cannot rename default role "user"`);
      }

      await this.prisma.role.update({
        where: { name: dto.oldRole },
        data: { name: dto.newRole },
      });

      return {
        message: `Role ${dto.oldRole} has been successfully updated to ${dto.newRole}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during updating role by name:", error);
      throw internalErrorHandler(500, "Updating role by name failed");
    }
  }

  async updateUser(dto: UpdateUserDto): Promise<string> {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!foundUser) {
        throw internalErrorHandler(404, `User ${dto.email} is not exists`);
      }
      const updatedUser = await this.prisma.user.update({
        where: { email: dto.email },
        data: { name: dto.name, phone: dto.phone },
      });

      return updatedUser.id;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during updating user:", error);
      throw internalErrorHandler(500, "Updating user failed");
    }
  }

  async removeRoleByName(roleName: string): Promise<string> {
    try {
      if (roleName === "user") {
        throw internalErrorHandler(409, `Role "${roleName}" is default and cant be removed`);
      }
      const foundRole = await this.prisma.role.findUnique({
        where: { name: roleName },
      });
      if (!foundRole) {
        throw internalErrorHandler(404, `Role "${roleName}" is not found`);
      }
      await this.prisma.$transaction([
        this.prisma.userRole.deleteMany({ where: { roleId: foundRole.id } }),
        this.prisma.role.delete({ where: { name: roleName } }),
      ]);
      return foundRole.name;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during removing role by name:", error);
      throw internalErrorHandler(500, "Removing role by name failed");
    }
  }

  async updateUserPassword(dto: UpdateUserPasswordDto): Promise<string> {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { email: dto.email, phone: dto.phone },
      });

      if (!foundUser) {
        throw internalErrorHandler(404, `User "${dto.email}" is not found`);
      }

      const updatedUser = await this.prisma.user.update({
        where: { email: dto.email },
        data: { password: dto.newPassword },
      });

      return `Password for "${updatedUser.email}" changed successfully!`;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during updating user password:", error);
      throw internalErrorHandler(500, "Updating user password failed");
    }
  }

  async updateUserRoles(
    dto: UpdateUserRolesDto,
    userId: string,
  ): Promise<{ message: string }> {
    try {
      const allRoles = await this.getRoles();
      const allRoleNames = allRoles.map((r) => r.name);
      const missingRoles = dto.roles.filter(
        (role) => !allRoleNames.includes(role),
      );

      if (missingRoles.length) {
        throw internalErrorHandler(400, `Roles not found: ${missingRoles.join(", ")}`);
      }

      const roleIds = allRoles
        .filter((role) => dto.roles.includes(role.name))
        .map((role) => role.id);

      await this.prisma.$transaction([
        this.prisma.userRole.deleteMany({ where: { userId } }),
        this.prisma.userRole.createMany({
          data: roleIds.map((roleId) => ({ userId, roleId })),
        }),
      ]);

      return { message: "Roles updated successfully" };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during updating users roles:", error);
      throw internalErrorHandler(500, "Updating users roles failed");
    }
  }
}
