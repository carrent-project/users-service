import { Controller } from "@nestjs/common";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { LoginDto, RegisterDto } from "@carrent/shared";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @MessagePattern("users.list")
  async sayHi() {
    return await this.usersService.sayHi();
  }

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
  async getUsers(@Payload() data: { page: number; limit: number }) {
    try {
      return await this.usersService.getUsers(data.page, data.limit);
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
}
