import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../../src/lib/api-errors';
const mocks=vi.hoisted(()=>({requireAdmin:vi.fn(),noticeFindFirst:vi.fn()}));
vi.mock('@/lib/auth/guards.server',()=>({requireAdmin:mocks.requireAdmin}));
vi.mock('@/lib/db',()=>({db:{announcement:{findFirst:mocks.noticeFindFirst}}}));
import { PATCH } from '../../src/app/api/v1/admin/discussions/[id]/route';
import { getAnnouncement } from '../../src/features/announcements/service.server';
describe('endpoint and publication boundaries',()=>{
  it('denies a student before an admin mutation is parsed',async()=>{
    mocks.requireAdmin.mockRejectedValueOnce(new AppError(403,'FORBIDDEN','You do not have permission to perform this action.'));
    const response=await PATCH(new Request('http://localhost/api/v1/admin/discussions/x',{method:'PATCH'}),{params:Promise.resolve({id:'x'})});
    expect(response.status).toBe(403);
    expect((await response.json()).error.code).toBe('FORBIDDEN');
  });
  it('does not return a draft from a member detail read',async()=>{
    mocks.noticeFindFirst.mockResolvedValueOnce(null);
    await expect(getAnnouncement('draft-1')).rejects.toMatchObject({status:404});
    expect(mocks.noticeFindFirst.mock.calls[0][0].where.status).toBe('PUBLISHED');
  });
});
