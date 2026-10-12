import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks=vi.hoisted(()=>({auth:vi.fn(),findUnique:vi.fn(),transaction:vi.fn()}));
vi.mock('@/auth',()=>({auth:mocks.auth}));
vi.mock('@/lib/db',()=>({db:{user:{findUnique:mocks.findUnique},$transaction:mocks.transaction}}));
import { requireUser, requireAdmin } from '../../src/lib/auth/guards.server';
import { replaceTimetable } from '../../src/features/timetable/service.server';

beforeEach(()=>{vi.resetAllMocks();mocks.auth.mockResolvedValue({user:{id:'student-1',role:'STUDENT',status:'ACTIVE'}})});
describe('session-backed access',()=>{
  it('rejects missing and suspended sessions',async()=>{
    mocks.auth.mockResolvedValueOnce(null);
    await expect(requireUser()).rejects.toMatchObject({status:401});
    mocks.auth.mockResolvedValueOnce({user:{id:'student-1',role:'STUDENT',status:'SUSPENDED'}});
    await expect(requireUser()).rejects.toMatchObject({status:401});
  });
  it('denies a student at the admin guard',async()=>{
    await expect(requireAdmin()).rejects.toMatchObject({status:403});
  });
  it('returns a conflict for stale timetable replacement',async()=>{
    mocks.findUnique.mockResolvedValue({role:'ADMIN',status:'ACTIVE'});
    mocks.transaction.mockImplementation(async(callback:(tx:unknown)=>Promise<unknown>)=>callback({timetable:{updateMany:vi.fn().mockResolvedValue({count:0})}}));
    await expect(replaceTimetable('admin-1','table-1',{expectedVersion:1,entries:[]})).rejects.toMatchObject({status:409,code:'STALE_VERSION'});
  });
});
