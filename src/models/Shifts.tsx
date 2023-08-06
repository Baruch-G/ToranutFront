export interface ShiftType {
    name: string;
    pointValue: number;
    population: string;
}

export interface Soldier {
    _id: string
    name: string;
    soldierId: number;
    population: string;
}

export interface Shift {
    ShiftType: ShiftType;
    Executor: Soldier;
    Substitute: Soldier;
    PointMultiplier: number;
    startdate: string;
    enddate: string;
    id: string;
}

export interface Potential {
    shifts: Shift[]
    startdate: string,
    createdAt: string
    updatedAt: string,
}
