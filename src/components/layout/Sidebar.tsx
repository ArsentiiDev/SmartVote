import React, { useEffect } from 'react'
import Button from '../common/Button';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { clearData, switchActiveVote } from '@/store/uiSlice';
import { TEXT_CONSTANTS } from '@/Constants/constants';
import { toggleAddVotingModal } from '@/store/uiSlice';

export interface SidebarProps {
  data: any,
  success: boolean
}

export default function Sidebar() {
  const activeVoting = useSelector((state: RootState) => state.ui.activeVotingIndex);
  const votings = useSelector((state: RootState) => state.data.votings)

  const dispatch = useDispatch();

  const selectVoting = (id: any) => {
    dispatch(switchActiveVote(id));
    dispatch(clearData())
  }
  return (
    <>
      <div className="">
        <h3 className="uppercase tracking-[.2em] text-neutral-tertiary mb-4">{TEXT_CONSTANTS.PREVIOUS_VOTINGS}</h3>
        {votings && votings.map((element, index) => (
          <Button onClick={() => selectVoting(element._id)} key={index} className={`my-2 ${activeVoting === element._id ? 'bg-main-secondary' : 'hover:bg-main-secondary'} w-full text-left py-3 rounded-r-lg px-4`}>
            <div className='flex justify-between items-center'>
              <h3 className="font-medium tracking-[.075em]">{element.title}</h3>
              {/* <div className="w-fit"><h3 className="tracking-wider lg:text-sm bg-status-voted-bg text-status-voted px-3 py-0.5 rounded-lg">Completed</h3></div> */}
            </div>
          </Button>
        ))}
        {votings[0] && <Button onClick={() => dispatch(toggleAddVotingModal())} className="w-full mt-8 bg-main-primary py-4 rounded-lg uppercase tracking-wider"><p>{TEXT_CONSTANTS.ADD_VOTING}</p></Button>}
      </div>
    </>
  );
}