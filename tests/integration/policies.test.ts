import { describe,it,expect } from 'vitest';
import { isEligibleGoogleProfile, normalizeEmail } from '../../src/lib/auth/university-policy';
import { profileInput } from '../../src/features/profile/schemas';
import { assertOwner, assertDiscussionOpen } from '../../src/lib/auth/access-policy';
import { entryInput, validateEntries, classState } from '../../src/features/timetable/schemas';
import { publishedWhere } from '../../src/features/announcements/policy';
import { attendancePercent, classesCanMiss, classesNeededToReachGoal } from '../../src/features/attendance/policy';
describe('university policy',()=>{
  const base={sub:'google-sub',email:'student@nsut.ac.in',email_verified:true,hd:'nsut.ac.in'};
  it('matches the exact normalized domain',()=>{expect(normalizeEmail(' A@NSUT.AC.IN ')).toBe('a@nsut.ac.in');expect(isEligibleGoogleProfile(base)).toBe(true);expect(isEligibleGoogleProfile({...base,email:'student@evilnsut.ac.in'})).toBe(false);});
  it('rejects unverified and wrong hosted domain claims',()=>{expect(isEligibleGoogleProfile({...base,email_verified:false})).toBe(false);expect(isEligibleGoogleProfile({...base,hd:'other.edu'})).toBe(false);expect(isEligibleGoogleProfile({...base,sub:''})).toBe(false);});
});
describe('permission and content rules',()=>{
  it('prevents profile role escalation',()=>expect(profileInput.safeParse({name:'Student',role:'ADMIN'}).success).toBe(false));
  it('enforces authorship and locked discussions',()=>{expect(()=>assertOwner('a','b')).toThrow();expect(()=>assertDiscussionOpen({visibility:'VISIBLE',isLocked:true})).toThrow();});
  it('requires published and unexpired notices',()=>{const where=publishedWhere(new Date('2026-10-11'));expect(where.status).toBe('PUBLISHED');expect(where.publishedAt.lte).toEqual(new Date('2026-10-11'));});
});
describe('timetable rules',()=>{
  const one={weekday:1,startMinute:540,endMinute:600,courseCode:'C1',courseTitle:'Class',room:'R1'};
  it('validates times and rejects overlaps',()=>{expect(entryInput.safeParse({...one,startMinute:600,endMinute:540}).success).toBe(false);expect(validateEntries([one,{...one,startMinute:590,endMinute:650}])).toBe(false);expect(validateEntries([one,{...one,startMinute:600,endMinute:650}])).toBe(true);});
  it('does not show expired term as current',()=>{expect(classState([one],{startsOn:new Date('2020-01-01'),endsOn:new Date('2020-12-31')},new Date('2026-10-11')).kind).toBe('OUT_OF_TERM');});
});
describe('attendance planner calculations',()=>{
  it('shows the percentage and number of classes a student can miss',()=>{
    expect(attendancePercent(32,40)).toBe(80);
    expect(classesCanMiss(32,40)).toBe(2);
    expect(classesCanMiss(30,40)).toBe(0);
  });
  it('calculates recovery classes below the 75 percent goal',()=>{
    expect(classesNeededToReachGoal(20,40)).toBe(40);
    expect(classesCanMiss(20,40)).toBeNull();
    expect(classesNeededToReachGoal(30,40)).toBe(0);
  });
});
