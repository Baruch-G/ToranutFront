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
    _id: string;
    ShiftType: ShiftType;
    Executor: Soldier;
    FirstSubstitute: Soldier;
    SecondSubstitute: Soldier;
    PointMultiplier: number;
    startdate: string;
    enddate: string;
}

export interface Potential {
    shifts: Shift[]
    startdate: string,
    createdAt: string
    updatedAt: string,
}

export interface Constraints {
    _id: string,
    name: string,
    soldierId: number,
    constraintList: Constraint[]
}

export interface Constraint {
    _id: string,
    constraint: string,
    startdate: string,
    enddate: string
}

export interface Swaps {
    _id: string,
    shift1: Shift,
    shift2: Shift,
    status: string,
}
