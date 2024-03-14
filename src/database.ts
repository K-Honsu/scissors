// import mongoose, {ConnectOptions} from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";

// mongoose.Promise = global.Promise;

// export class DatabaseConnection {
//   private mongoServer: MongoMemoryServer;
//   public connection: mongoose.Connection | null;

//   constructor() {
//     this.mongoServer = new MongoMemoryServer();
//     this.connection = null;
//   }

//   async connect(): Promise<void> {
//     this.mongoServer = await MongoMemoryServer.create();
//     const mongoUri = this.mongoServer.getUri();

//     this.connection = await mongoose.connect(mongoUri, {} as ConnectOptions);
//   }

//   async disconnect(): Promise<void> {
//     if (this.connection) {
//       await this.connection.close();
//     }
//     await this.mongoServer.stop();
//   }

//   // async cleanup(): Promise<void> {
//   //   if (!this.connection) {
//   //     throw new Error("Connection has not been established.");
//   //   }

//   //   const models = Object.keys(this.connection.models);
//   //   const promises: Promise<any>[] = [];

//   //   models.forEach((model) => {
//   //     promises.push(this.connection!.models[model].deleteMany({}));
//   //   });

//   //   await Promise.all(promises);
//   // }
//   async cleanup(): Promise<void> {
//     if (!this.connection) {
//       throw new Error("Connection has not been established.");
//     }

//     const models = Object.keys(this.connection.models);
//     await Promise.all(models.map(model => this.connection!.models[model].deleteMany({})));
// }

// }

// export const connect = async (): Promise<DatabaseConnection> => {
//   const conn = new DatabaseConnection();
//   await conn.connect();
//   return conn;
// };

// import mongoose, { ConnectOptions, Mongoose } from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";

// mongoose.Promise = global.Promise;

// export class DatabaseConnection {
//   private mongoServer: MongoMemoryServer;
//   public mongooseInstance: Mongoose | null;
//   public connection: mongoose.Connection | null;

//   constructor() {
//     this.mongoServer = new MongoMemoryServer();
//     this.mongooseInstance = null;
//     this.connection = null;
//   }

//   async connect(): Promise<void> {
//     this.mongoServer = await MongoMemoryServer.create();
//     const mongoUri = this.mongoServer.getUri();
//     console.log(mongoUri);


//     this.mongooseInstance = mongoose;
//     // @ts-ignore
//     this.connection = await this.mongooseInstance.connect(mongoUri, {} as ConnectOptions);
//   }

//   async disconnect(): Promise<void> {
//     if (this.connection) {
//       await this.connection.close();
//     }
//     await this.mongoServer.stop();
//   }

//   async cleanup(): Promise<void> {
//     if (!this.connection) {
//       throw new Error("Connection has not been established.");
//     }

//     const models = Object.keys(this.connection.models);
//     await Promise.all(models.map(model => this.connection!.models[model].deleteMany({})));
//   }
// }

// export const connect = async (): Promise<DatabaseConnection> => {
//   const conn = new DatabaseConnection();
//   await conn.connect();
//   return conn;
// };


import mongoose, { ConnectOptions, Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

mongoose.Promise = global.Promise;

export class DatabaseConnection {
  private mongoServer: MongoMemoryServer;
  private mongooseInstance: Mongoose | null;
  public connection: mongoose.Connection | null;

  constructor() {
    this.mongoServer = new MongoMemoryServer();
    this.mongooseInstance = null;
    this.connection = null;
  }

  async connect(): Promise<void> {
    this.mongoServer = await MongoMemoryServer.create();
    const mongoUri = this.mongoServer.getUri();

    this.mongooseInstance = mongoose;
    await this.mongooseInstance.connect(mongoUri, {} as ConnectOptions);
    this.connection = this.mongooseInstance.connection;
  }


  async disconnect(): Promise<void> {
    if (this.mongooseInstance) {
      await this.mongooseInstance.disconnect();
    }
    if (this.mongoServer) {
      await this.mongoServer.stop();
    }
  }


  async cleanup(): Promise<void> {
    if (!this.connection) {
      throw new Error("Connection has not been established.");
    }

    const models = Object.keys(this.connection.models);
    await Promise.all(models.map(model => this.connection!.models[model].deleteMany({})));
  }
}

export const connect = async (): Promise<DatabaseConnection> => {
  const conn = new DatabaseConnection();
  await conn.connect();
  return conn;
};
