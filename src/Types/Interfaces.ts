export interface IObject  {
    _id: string,
    title: string,
    description: string,
}

export interface ISuccessResponse<T> {
    success: true;
    object?: T;
    objects?: T[];
    message?: string;
  }
  
export interface IErrorResponse {
    success: false;
    message: string;
  }


export interface IExpert {
    _id: string,
    name: string,
    email:string,
    status: string
}

export interface IHeuristic {
    _id: string,
    sum: number,
    placing: number | null
}

export interface IResult  {
    set: string[];
    criteria: number;
    minSum: number;
}

export interface IVote {
    _id: string,
    name: string,
    scores: number[]
}

export interface IVoting {
    _id: string,
    title:string,
    status?: string,
    objects: IObject[],
    experts: IExpert[],
    heuristics: IHeuristic[],
    criteria: string,
    method: string,
    results: IResult[],
    assessments: Record<string, string[]> | null,
    votes: IVote[]
}

export interface ColumnType {
    type: 'normal' | 'status';
    title: string;
    width: string;
}

export interface convertObjectToCardData {
    id: string,
    columns: (number | string)[],
    object?: IObject | IExpert | IHeuristic,
    status?: string
}