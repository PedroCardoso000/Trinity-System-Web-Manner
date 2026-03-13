import type { AttendanceStatus } from "./AttendanceStatus"

type Attendance = {
    id: number
    studentId: number
    classRoomId: number
    status: AttendanceStatus
}

export type { Attendance }
