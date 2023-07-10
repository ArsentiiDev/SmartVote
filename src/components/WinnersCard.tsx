import { TEXT_CONSTANTS } from "@/Constants/constants"
import { RootState } from "@/store/store"
import React from "react"
import { useSelector } from "react-redux"

const WinnersCard: React.FC = () => {
    const activeVoting = useSelector((state: RootState) => state.ui.activeVotingIndex);

    const results = useSelector((state:RootState) => state.data.votings.find(voting => voting._id === activeVoting)?.results);
    return (
        <div className="my-12">
            {/* <p>{JSON.stringify(results)}</p> */}
            <h2>{TEXT_CONSTANTS.WINNERS_SET}</h2>
            <div className="flex w-full gap-x-8">
            <div>
                <h4 className="text-neutral-secondary font-light">{TEXT_CONSTANTS.MINIMUM_SUM}</h4>
                <h4 className='text-neutral-primary'>{results ? results[0].minSum: ''}</h4>
            </div>
            <div>
                <h4 className="text-neutral-secondary font-light">{TEXT_CONSTANTS.CRITERIA_VALUE}</h4>
                <h4 className='text-neutral-primary'>{results ? results[0].criteria: ''}</h4>
            </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 pr-1" style={{ gridTemplateColumns: '0.2fr 3fr 1fr 1fr' }}>
            <div className="font-normal text-neutral-secondary">{TEXT_CONSTANTS.PLACE}</div>
            <div className="font-normal text-neutral-secondary">{TEXT_CONSTANTS.SET}</div>
            <div className="font-normal text-neutral-secondary">{TEXT_CONSTANTS.CRITERIA}</div>
            <div className="font-normal text-neutral-secondary">{TEXT_CONSTANTS.MINSUM}</div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 max-h-52 overflow-auto" style={{ gridTemplateColumns: '0.2fr 3fr 1fr 1fr' }}>
            {results &&  results.map((winner, index) => (
                <React.Fragment key={index}>
                <div>{index+1}</div>
                <div>{winner.set.join(' , ')}</div>
                <div>{winner.criteria}</div>
                <div>{winner.minSum}</div>
                </React.Fragment>
            ))}
            </div>
            <div className="flex items-baseline gap-x-2 mt-4">
                    <h4 className="text-neutral-secondary uppercase text-lg lg:text-xs font-light tracking-[.25em]">{TEXT_CONSTANTS.AMOUNT}</h4><h2>{results? results.length: '0'}</h2>
            </div>
      </div>
    )
}

export default WinnersCard