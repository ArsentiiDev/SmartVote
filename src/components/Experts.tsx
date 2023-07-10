import React, { useState } from 'react';
import Card from './common/Card';
import { useDispatch, useSelector } from 'react-redux';
import AddObjectModal from './Modals/AddObjectModal';
import AddExpertModal from './Modals/AddExpertModal';
import { toggleAddExpertModal } from '@/store/uiSlice';
import { RootState } from '@/store/store';
import { ColumnType, IExpert, convertObjectToCardData } from '@/Types/Interfaces';
import { TEXT_CONSTANTS } from '@/Constants/constants';

const VOTED = 'Voted'
const REJECTED = 'Rejected'
const SENT = 'Sent'

function Experts() {
    const activeVoting = useSelector((state: RootState) => state.ui.activeVotingIndex);

    const experts = useSelector((state:RootState) => state.data.votings.find(voting => voting._id === activeVoting)?.experts);

    const columns: ColumnType[] = [
        { type: 'normal', title: '№', width: '0.2fr' },
        { type: 'normal', title: 'Name', width: '2fr' },
        { type: 'status', title: 'Status', width: '1.2fr' },
        { type: 'status', title: '', width: '0.4fr' },
    ]

    const printStatus = (item: convertObjectToCardData):React.ReactElement | undefined => {
        if (item.status === TEXT_CONSTANTS.VOTED) {
            return (<div className="w-fit"><p className="tracking-[.1em] lg:text-sm bg-status-voted-bg text-status-voted px-3 py-0.5 rounded-lg font-light">{item.status}</p></div>)
        } else if (item.status === REJECTED) {
            return (<div className="w-fit"><h3 className="tracking-[.1em] lg:text-sm bg-status-rejected-bg text-status-rejected px-3 py-0.5 rounded-lg font-light">{item.status}</h3></div>)
        } else if (item.status === TEXT_CONSTANTS.INVITED || SENT) {
            return (<div className="w-fit"><h3 className="tracking-[.1em] lg:text-sm bg-status-sent-bg text-status-sent px-3 py-0.5 rounded-lg font-light">{TEXT_CONSTANTS.INVITED}</h3></div>)
        }
        return undefined
    }

    const convertToData = ():convertObjectToCardData[] | undefined => {
            return experts && experts.map((el, index) => {
                return {
                    id: el._id,
                    columns: [index + 1, el.name, el.status],
                    status: el.status,
                    object: el
                }
            })
    }

    const dispatch = useDispatch()

    return (
        <Card
            title="Experts"
            buttonText="Add +"
            columns={columns}
            items={convertToData()}
            statusRenderer={printStatus}
            onClick={() => dispatch(toggleAddExpertModal())}
            type="experts"
        />
    );
}

export default Experts;
