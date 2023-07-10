import {  IExpert, IHeuristic, IObject, IResult, IVote, IVoting } from "@/Types/Interfaces";
import { generateCombinations, transformAssessments, calculateMatrix, findMinimaxValue, findAdditiveCriterionValue, findQuadraticCriterionValue } from "./helpers";
import { CRITERIA, TEXT_CONSTANTS } from "@/Constants/constants";

export class Expert implements IExpert {
    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public status: string,
    ) {}

    get id(): string {
        return this._id
    }

    get description(): string {
        return `${this.name} (${this.email}): ${this.status}`;
    }
}

export class VotingObject implements IObject {
    constructor(
        public _id: string,
        public title: string,
        public description: string
    ) {}

    get id(): string {
        return this._id;
    }

    get name(): string {
        return `${this.title} (${this.description})`;
    }
}

export class Heuristic implements IHeuristic {
    constructor(
        public _id: string,
        public sum: number,
        public placing: number
    ) {}

    get name(): string {
        return `Exclude Object with sum votes: ${this.sum} and with placement taken: ${this.placing}`;
    }

    get id(): string {
        return this._id
    }
}

export class Vote {
    private objects: VotingObject[] = [];
    private experts: Expert[] = [];
    private heuristics: Heuristic[] = [];
    private results: IResult[] = []; // Update with the right type
    private assessments: Map<string, string[]> = new Map();
    private votes: IVote[] = []; // Update with the right type

    constructor(private title: string, private criteria: string, private method: string) {}


    get Results(): IResult[] {
        return this.results
    }

    get Objects(): VotingObject[] {
        return this.objects
    }

    get Heuristics(): Heuristic[] {
        return this.heuristics
    }

    get Experts(): Expert[] {
        return this.experts
    }

    get Assessments(): Map<string, string[]> {
        return this.assessments
    }

    get Votes(): IVote[] {
        return this.votes
    }

    addExpert(expert:Expert) {
        this.experts.push(expert);
    }

    addObject(object:VotingObject) {
        this.objects.push(object);
    }

    addHeuristic(heuristic: Heuristic) {
        this.heuristics.push(heuristic);
    }

    setAssessments(assessments: Map<string, string[]>) {
        this.assessments = assessments;
    }
    
    setObjectPlacements(votes: IVote[]) {
        this.votes = votes;
    }
    
    applyHeuristics() {
        console.log('before', this.votes)
        let filteredVotes = [...this.votes];
        for (const heuristic of this.heuristics) {
            filteredVotes = filteredVotes.filter((vote) => {
                const sum = vote.scores.reduce((a,b) => a+b,0);
                if (heuristic.placing !== undefined) {
                    return !(sum === heuristic.sum && vote.scores[heuristic.placing-1] === heuristic.sum)
                } 
                else {
                    return !(sum === heuristic.sum)
                }
            })
        }
        this.votes = filteredVotes;
        console.log('after', this.votes)
    }

    filterObjects() {
        // console.log('before filter', this.objects)
        const filteredIds = this.votes.map(vote => vote.name);
        this.objects = this.objects.filter(object => filteredIds.includes(object.title));
        // console.log('after filter', this.objects)
    }

    vote() {
        try {
            let sum:any
            this.applyHeuristics()
            this.filterObjects()
            const matrixA = generateCombinations(this.objects);
            const matrixB = transformAssessments(this.assessments, this.objects)
            const resultMatrix = calculateMatrix(matrixA, matrixB);
            if (resultMatrix) {
                switch(this.criteria) {
                    case CRITERIA.MINMAX:
                        sum = findMinimaxValue(resultMatrix);
                        break;
                    case CRITERIA.ADDITIVE:
                        sum = findAdditiveCriterionValue(resultMatrix)
                        break;
                    case CRITERIA.QUADRATIC:
                        sum = findQuadraticCriterionValue(resultMatrix)
                        break;
                }
            }
            sum.minRowIndex.sort((a:[number[], number, number],b:[number[], number, number]) => a[2] - b[2]);
            const result:IResult[] = [];
            
            for (let i = 0; i < sum.minRowIndex.length; i++) {
                console.log(resultMatrix![sum.minRowIndex[i][0]])
                console.log('matrixa', matrixA[sum.minRowIndex[i][0]])
                console.log('set', matrixA[sum.minRowIndex[i][0]].map((num:number) => this.objects[num - 1].title))
                result.push({
                    set: matrixA[sum.minRowIndex[i][0]].map((num:number) => this.objects[num - 1].title),
                    criteria: sum.minRowIndex[i][2],
                    minSum: sum.minRowIndex[i][1]
                })
            }
            this.results = result
            return result
        } catch(err) {
            //console.log('Error in vote()', err);
            throw new Error('Couldn`t complete a vote')
        }

    }
}
