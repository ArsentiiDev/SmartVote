import React from 'react'
import Card from './common/Card'
import { TEXT_CONSTANTS } from '@/Constants/constants'
import { useDispatch, useSelector } from 'react-redux'
import AddObjectModal from './Modals/AddObjectModal';
import { toggleAddObjectModal } from '@/store/uiSlice';

import { RootState } from '@/store/store';
import { ColumnType, convertObjectToCardData, IObject } from '@/Types/Interfaces';



const Objects: React.FC = () => {

    const activeVoting = useSelector((state: RootState) => state.ui.activeVotingIndex);

    const objects = useSelector((state:RootState) => state.data.votings.find(voting => voting._id === activeVoting)?.objects);

    const columns:ColumnType[] = [
        { type: 'normal', title: '№', width: '0.2fr' },
        { type: 'normal', title: 'Name', width: '4fr' },
        { type: 'normal', title: '', width: '0.5fr' },
    ]

    const dispatch = useDispatch();

    const convertToData = (): convertObjectToCardData[] | undefined => {
            return objects && objects.map((el, index) => {
                return {
                    id: el._id,
                    columns: [index + 1, el.title],
                    object: el
                }
            })
        }

    return (
        <Card
            title={TEXT_CONSTANTS.OBJECTS}
            buttonText={TEXT_CONSTANTS.ADD_OBJECT}
            columns={columns}
            items={convertToData()}
            onClick={() => dispatch(toggleAddObjectModal())}
            type="objects"
        />
    );
}

export default Objects