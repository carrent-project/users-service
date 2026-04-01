import { Controller } from "@nestjs/common";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { ICreateRoleDto, LoginDto, RegisterDto, UpdateRoleByNameDto, UpdateUserDto, UpdateUserPasswordDto, UpdateUserRolesDto } from "@carrent/shared";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern("users.login")
  async login(@Payload() data: LoginDto) {
    try {
      console.log("[Users Microservice] login called with:", data);
      return await this.usersService.login(data);
    } catch (error) {
      console.log("[Users Microservice] login error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("users.register")
  async register(@Payload() data: RegisterDto) {
    try {
      return await this.usersService.register(data);
    } catch (error) {
      console.log("[Users Microservice] register error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("users.get-users")
  async getUsers(
    @Payload() data: { search: string; page: number; limit: number },
  ) {
    try {
      return await this.usersService.getUsers(
        data.search,
        data.page,
        data.limit,
      );
    } catch (error) {
      console.log("[Users Microservice] getUsers error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("users.user-by-id")
  async getUserById({ id }: { id: string }) {
    try {
      return await this.usersService.getUserById(id);
    } catch (error) {
      console.log("[Users Microservice] getUserById error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("users.user-by-email")
  async getUserByEmail({ email, withPassword }: { email: string, withPassword?: boolean }) {
    try {
      return await this.usersService.getUserByEmail(email, withPassword);
    } catch (error) {
      console.log("[Users Microservice] getUserByEmail error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("users.remove-user")
  async removeUserById({ id }: { id: string }) {
    try {
      return await this.usersService.removeUserById(id);
    } catch (error) {
      console.log("[Users Microservice] removeUserById error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("users.update-role-name")
  async updateRoleByName(@Payload() data: { dto: UpdateRoleByNameDto }): Promise<{message: string}> {
    try {
      return await this.usersService.updateRoleByName(data.dto);
    } catch (error) {
      console.log("[Users Microservice] updateRoleByName error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("users.update-user")
  async updateUser(dto: UpdateUserDto): Promise<string> {
    try {
      return await this.usersService.updateUser(dto);
    } catch (error) {
      console.log("[Users Microservice] updateUser error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("auth.change-password")
  async updateUserPassword(dto: UpdateUserPasswordDto): Promise<string> {
    try {
      return await this.usersService.updateUserPassword(dto);
    } catch (error) {
      console.log("[Users Microservice] updateUserPassword error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("roles.list")
  async getRoles() {
    try {
      return await this.usersService.getRoles();
    } catch (error) {
      console.log("[Users Microservice] getRoles error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("roles.add")
  async addRole(@Payload() data: ICreateRoleDto) {
    try {
      console.log("[Users Microservice] addRole called with:", data);
      return await this.usersService.addRole(data);
    } catch (error) {
      console.log("[Users Microservice] login error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("roles.remove")
  async removeRoleByName({ roleName }: { roleName: string }) {
    try {
      return await this.usersService.removeRoleByName(roleName);
    } catch (error) {
      console.log("[Users Microservice] removeRoleByName error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("auth.update-roles-list")
  async updateUserRoles(@Payload() data: { dto: UpdateUserRolesDto; userId: string }) {
    try {
      return await this.usersService.updateUserRoles(data.dto, data.userId);
    } catch (error) {
      console.log("[Users Microservice] update user roles error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }
}
