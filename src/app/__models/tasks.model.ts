export interface Tasks {
    _id: string;
    task: string;
    describe: string;
    status: string;
    points: number;
    inBacklog: boolean;
    idProject: string;
    idIteration: string;
}
