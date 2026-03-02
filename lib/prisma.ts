import { PrismaClient } from "@prisma/client";
import config from "./prisma.config";

 const prisma= new PrismaClient(config);

 export default prisma;
