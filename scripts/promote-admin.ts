import { PrismaClient } from '@prisma/client';
import { normalizeEmail } from '../src/lib/auth/university-policy';
const db=new PrismaClient();
async function main(){const value=process.argv[2];if(!value)throw new Error('Usage: pnpm admin:promote user@nsut.ac.in');const email=normalizeEmail(value);if(!email.endsWith('@nsut.ac.in'))throw new Error('Only eligible university accounts can be promoted.');const user=await db.user.findUnique({where:{email},include:{accounts:{where:{provider:'google'},select:{providerAccountId:true}}}});if(!user||!user.accounts.length||user.status!=='ACTIVE')throw new Error('User must first register through eligible Google sign-in.');await db.user.update({where:{id:user.id},data:{role:'ADMIN'}});console.log(`Promoted ${email} to ADMIN.`)}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.$disconnect());
