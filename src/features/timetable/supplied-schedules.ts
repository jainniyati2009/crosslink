const term = { id: 'jul-dec-2026', name: 'July–December 2026', startsOn: '2026-07-01T00:00:00.000Z', endsOn: '2026-12-31T23:59:59.999Z' };
type ScheduleKey = 'CSE1' | 'CSE2' | 'CSAI1' | 'CSAI2' | 'CSDS' | 'MAC';
type Course = [string, string, string, string | null];
const map: Record<ScheduleKey, Record<string, Course>> = {
  CSE1: {
    E1: ['FCMT0101', 'Mathematics-I', 'APJ-1', null], E2: ['FCCS0102', 'Computer Programming', 'APJ-1', 'Ms Shikha'],
    E3: ['FCPH0114', 'Quantum Physics', 'APJ-1', null], E4: ['FCEE0106', 'Fundamentals of Electrical Engineering', 'APJ-1', null],
    E6: ['FCEC0106', 'Basics of Electronics & Communication Engineering', 'APJ-1', null],
    P2: ['FCCS0102', 'Computer Programming Lab', 'CC-SW', 'Dr Rashmi'], P3: ['FCPH0114', 'Quantum Physics Lab', 'APJ-1', null],
    P4: ['FCEE0106', 'Electrical Engineering Lab', 'APJ-1', null], P6: ['FCEC0106', 'Electronics Lab', 'APJ-1', null],
    T11: ['FCMT0101', 'Mathematics Tutorial', 'APJ-1', null], T12: ['FCMT0101', 'Mathematics Tutorial', 'APJ-1', null],
  },
  CSE2: {
    E5: ['FCMT0101', 'Mathematics-I', 'APJ-1', null], E11: ['FCCS0102', 'Computer Programming', 'APJ-1', 'Ms Shilpa Dinesh'],
    E12: ['FCPH0114', 'Quantum Physics', 'APJ-1', null], E13: ['FCEE0106', 'Fundamentals of Electrical Engineering', 'APJ-1', null],
    E14: ['FCEC0106', 'Basics of Electronics & Communication Engineering', 'APJ-1', null],
    P11: ['FCCS0102', 'Computer Programming Lab', 'CC-SW', 'Dr Vandana'], P12: ['FCPH0114', 'Quantum Physics Lab', 'APJ-1', null],
    P13: ['FCEE0106', 'Electrical Engineering Lab', 'APJ-1', null], P14: ['FCEC0106', 'Electronics Lab', 'APJ-1', null],
    T5: ['FCMT0101', 'Mathematics Tutorial', 'APJ-1', null], T51: ['FCMT0101', 'Mathematics Tutorial', 'APJ-1', null], T52: ['FCMT0101', 'Mathematics Tutorial', 'APJ-1', null],
  },
  CSAI1: {
    E1: ['FCEC0106', 'Basics of Electronics & Communication Engineering', 'APJ-2', null], E2: ['FCMT0101', 'Mathematics-I', 'APJ-2', null],
    E3: ['FCCS0102', 'Computer Programming', 'APJ-2', 'Ms Shikha'], E4: ['FCPH0114', 'Quantum Physics', 'APJ-2', null],
    E6: ['FCEE0106', 'Fundamentals of Electrical Engineering', 'APJ-2', null],
    P1: ['FCEC0106', 'Electronics Lab', 'APJ-2', null], P3: ['FCCS0102', 'Computer Programming Lab', 'CC-SW', 'Dr Rashmi'],
    P4: ['FCPH0114', 'Quantum Physics Lab', 'APJ-2', null], P6: ['FCEE0106', 'Electrical Engineering Lab', 'APJ-2', null],
    T2: ['FCMT0101', 'Mathematics Tutorial', 'APJ-2', null], T21: ['FCMT0101', 'Mathematics Tutorial', 'APJ-2', null], T22: ['FCMT0101', 'Mathematics Tutorial', 'APJ-2', null],
  },
  CSAI2: {
    E5: ['FCEC0106', 'Basics of Electronics & Communication Engineering', 'APJ-2', null], E11: ['FCMT0101', 'Mathematics-I', 'APJ-2', null],
    E12: ['FCCS0102', 'Computer Programming', 'APJ-2', 'Ms Shilpa Dinesh'], E13: ['FCPH0114', 'Quantum Physics', 'APJ-2', null],
    E14: ['FCEE0106', 'Fundamentals of Electrical Engineering', 'APJ-2', null],
    P5: ['FCEC0106', 'Electronics Lab', 'APJ-2', null], P12: ['FCCS0102', 'Computer Programming Lab', 'CC-SW', 'Dr Vivek'],
    P13: ['FCPH0114', 'Quantum Physics Lab', 'APJ-2', null], P14: ['FCEE0106', 'Electrical Engineering Lab', 'APJ-2', null],
    P11: ['FCMT0101', 'Mathematics Tutorial', 'APJ-2', null], T11: ['FCMT0101', 'Mathematics Tutorial', 'APJ-2', null], T11_1: ['FCMT0101', 'Mathematics Tutorial', 'APJ-2', null], T11_2: ['FCMT0101', 'Mathematics Tutorial', 'APJ-2', null],
  },
  CSDS: {
    E1: ['FCPH0114', 'Quantum Physics', 'APJ-4', null], E2: ['FCEE0106', 'Fundamentals of Electrical Engineering', 'APJ-4', null],
    E3: ['FCEC0106', 'Basics of Electronics & Communication Engineering', 'APJ-4', null], E4: ['FCMT0101', 'Mathematics-I', 'APJ-4', null],
    E6: ['FCCS0102', 'Computer Programming', 'APJ-4', 'Ms Shikha'], P1: ['FCPH0114', 'Quantum Physics Lab', 'APJ-4', null],
    P2: ['FCEE0106', 'Electrical Engineering Lab', 'APJ-4', null], P3: ['FCEC0106', 'Electronics Lab', 'APJ-4', null], P6: ['FCCS0102', 'Computer Programming Lab', 'CC-SW', 'Dr Vandana'],
    T4: ['FCMT0101', 'Mathematics Tutorial', 'APJ-4', null], T41: ['FCMT0101', 'Mathematics Tutorial', 'APJ-4', null], T42: ['FCMT0101', 'Mathematics Tutorial', 'APJ-4', null],
  },
  MAC: {
    E1: ['FCMT0101', 'Mathematics-I', 'APJ-10', null], E2: ['FCCS0102', 'Computer Programming', 'APJ-10', 'Ms Shilpa Dinesh'],
    E3: ['FCPH0114', 'Quantum Physics', 'APJ-10', null], E4: ['FCEC0106', 'Basics of Electronics & Communication Engineering', 'APJ-10', null],
    E6: ['FCEE0106', 'Fundamentals of Electrical Engineering', 'APJ-10', null], P2: ['FCCS0102', 'Computer Programming Lab', 'CC-SW', 'Dr Vivek'],
    P3: ['FCPH0114', 'Quantum Physics Lab', 'APJ-10', null], P4: ['FCEC0106', 'Electronics Lab', 'APJ-10', null], P6: ['FCEE0106', 'Electrical Engineering Lab', 'APJ-10', null],
    T1: ['FCMT0101', 'Mathematics Tutorial', 'APJ-10', null], T11: ['FCMT0101', 'Mathematics Tutorial', 'APJ-10', null], T12: ['FCMT0101', 'Mathematics Tutorial', 'APJ-10', null],
  },
};
// Each tuple is [hour slot from 08:00, slot code, duration in minutes].
const tables: Record<ScheduleKey, Array<Array<[number, string, number]>>> = {
  CSE1: [ [[0,'VA · Batch 1',120],[3,'E6',60],[4,'E1',60],[5,'E2',60],[8,'P4',120]], [[2,'VA · Batch 1',120],[4,'E3',60],[5,'E4',60],[8,'P2',120]], [[0,'E2',60],[1,'E1',60],[2,'E6',60],[4,'E4',60],[5,'E3',60]], [[0,'P6',120],[2,'E1',60],[3,'E2',60],[4,'P3',120]], [[0,'E6',60],[2,'E3',60],[3,'E4',60],[4,'T11',60],[5,'T12',60]] ],
  CSE2: [ [[2,'E5',60],[3,'P13',120],[6,'E12',60],[7,'E11',60]], [[0,'VA · Batch 3',120],[2,'E11',60],[3,'E12',60],[4,'P14',120],[7,'E13',60],[8,'E14',60]], [[2,'VA · Batch 3',120],[5,'E5',60],[6,'P12',120],[8,'T51',60],[9,'T52',60]], [[2,'E13',60],[3,'E14',60],[4,'E11',60],[5,'E12',60]], [[2,'E14',60],[3,'E13',60],[5,'E5',60],[6,'P11',120]] ],
  CSAI1: [ [[0,'VA · Batch 1',120],[3,'E6',60],[4,'E1',60],[5,'E2',60],[8,'P4',120]], [[2,'VA · Batch 1',120],[4,'E3',60],[5,'E4',60],[8,'P2',120]], [[0,'E2',60],[1,'E1',60],[2,'E6',60],[4,'E4',60],[5,'E3',60],[8,'T21',60],[9,'T22',60]], [[0,'P6',120],[2,'E1',60],[3,'E2',60],[4,'P3',120]], [[0,'E6',60],[2,'E3',60],[3,'E4',60],[8,'P1',120]] ],
  CSAI2: [ [[2,'E5',60],[3,'P13',120],[6,'E12',60],[7,'E11',60]], [[0,'VA · Batch 3',120],[2,'E11',60],[3,'E12',60],[4,'P14',120],[7,'E13',60],[8,'E14',60]], [[0,'VA · Batch 3',120],[5,'E5',60],[6,'P12',120],[8,'P5',120]], [[2,'E13',60],[3,'E14',60],[4,'E11',60],[5,'E12',60],[8,'T11_1',60],[9,'T11_2',60]], [[2,'E14',60],[3,'E13',60],[5,'E5',60],[6,'P11',120]] ],
  CSDS: [ [[0,'VA · Batch 1',120],[3,'E6',60],[4,'E1',60],[5,'E2',60],[8,'T41',60],[9,'T42',60]], [[2,'VA · Batch 1',120],[4,'E3',60],[5,'E4',60],[8,'P2',120]], [[0,'E2',60],[1,'E1',60],[2,'E6',60],[4,'E4',60],[5,'E3',60]], [[0,'P6',120],[2,'E1',60],[3,'E2',60],[4,'P3',120]], [[0,'E6',60],[2,'E3',60],[3,'E4',60],[8,'P1',120]] ],
  MAC: [ [[0,'E6',60],[1,'E1',60],[2,'E2',60],[4,'P4',120]], [[0,'P6',120],[2,'E3',60],[4,'P3',120]], [[1,'VA · Batch 2',120],[3,'E2',60],[4,'E1',60],[5,'E6',60],[7,'E4',60],[8,'E3',60]], [[0,'VA · Batch 2',120],[2,'E4',60],[4,'E1',60],[5,'E2',60]], [[0,'P2',120],[1,'E6',60],[3,'E3',60],[4,'E4',60],[8,'T11',60],[9,'T12',60]] ],
};
const branches: Array<[ScheduleKey, string, string, string]> = [
  ['CSE1','CSE','1','1'], ['CSE2','CSE','1','2'], ['CSAI1','CSAI','1','1'], ['CSAI2','CSAI','1','2'], ['CSDS','CSDS','1','1'], ['MAC','MAC','1','1'],
];
function schedule(key: ScheduleKey, programme: string, section: string) {
  const entries = tables[key].flatMap((classes, day) => classes.map(([slot, code, duration], index) => {
    const subject = map[key][code];
    const isActivity = code.startsWith('VA');
    return { id: `${key}-${day + 1}-${index}`, weekday: day + 1, startMinute: 480 + slot * 60, endMinute: 480 + slot * 60 + duration, courseCode: isActivity ? 'VA' : subject?.[0] ?? code, courseTitle: isActivity ? code : subject?.[1] ?? code, slot: code, room: isActivity ? 'See department notice' : subject?.[2] ?? 'As listed in timetable', instructor: isActivity ? null : subject?.[3] ?? null };
  }));
  return { id: `pdf-${key}`, isDemo: false, version: 1, cohort: { term, programme, semester: 1, section }, entries };
}
export const suppliedTimetableTerms = [term];
export const suppliedTimetableCohorts = branches.map(([key, programme, semester, section]) => ({ id: `pdf-${key}`, termId: term.id, programme, semester: Number(semester), section }));
export const suppliedTimetableSchedules: Record<string, ReturnType<typeof schedule>> = Object.fromEntries(branches.map(([key, programme, , section]) => [`pdf-${key}`, schedule(key, programme, section)]));
