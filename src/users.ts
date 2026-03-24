import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './app.module';

async function users() {
  const PORT = process.env.PORT;
  const port = PORT ? +PORT : 5002;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port,
      },
    },
  );

  await app.listen();
  console.log(`🚀 users microservice is listening on port ${port}`);
}
users();