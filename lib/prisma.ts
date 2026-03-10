import { PrismaClient } from "@prisma/client";
import defineConfig from "../prisma.config";

 const prisma= new PrismaClient(defineConfig);

 export default prisma;
