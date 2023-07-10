import React from 'react'
import Card from './common/Card'
import { TEXT_CONSTANTS } from '@/Constants/constants'
import { useDispatch, useSelector } from 'react-redux'
import AddHeuristicModal from './Modals/AddHeuristicModal'
import { toggleAddHeuristicModal } from '@/store/uiSlice'
import { ColumnType, IHeuristic, convertObjectToCardData } from '@/Types/Interfaces'
import { RootState } from '@/store/store'


const Heuristics: React.FC = () => {
    const activeVoting = useSelector((state: RootState) => state.ui.activeVotingIndex);
    const heuristics = useSelector((state:RootState) => state.data.votings.find(voting => voting._id === activeVoting)?.heuristics);

    const convertToData = (): convertObjectToCardData[] | undefined => {
        return heuristics && heuristics.map((el, index) => {
            return {
                id: el._id,
                columns: [index + 1, el.sum, el.placing],
                object: el
            }
        })
    }

    const columns: ColumnType[] = [
        { type: 'normal', title: '№', width: '0.2fr' },
        { type: 'normal', title: 'Votes', width: '1fr' },
        { type: 'normal', title: 'Placement', width: '1fr' },
        { type: 'normal', title: '', width: '0.3fr' },
    ]
    const dispatch = useDispatch();
    return (
        <Card
            title={TEXT_CONSTANTS.HEURISTICS}
            buttonText={TEXT_CONSTANTS.ADD_HEURISTICS}
            columns={columns}
            items={convertToData()}
            onClick={() => dispatch(toggleAddHeuristicModal())}
            type="heuristics"
        />
    );
}

export default Heuristics