export const ATTENDANCE_GOAL_PERCENT = 75;

export function attendancePercent(attended: number, held: number) {
  return held > 0 ? (attended / held) * 100 : 0;
}

export function classesNeededToReachGoal(attended: number, held: number, goal = ATTENDANCE_GOAL_PERCENT) {
  if (attendancePercent(attended, held) >= goal) return 0;
  return Math.ceil((goal * held / 100 - attended) / (1 - goal / 100));
}

export function classesCanMiss(attended: number, held: number, goal = ATTENDANCE_GOAL_PERCENT) {
  if (attendancePercent(attended, held) < goal) return null;
  return Math.max(0, Math.floor(attended / (goal / 100) - held));
}
