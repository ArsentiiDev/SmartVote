import { TEXT_CONSTANTS } from '@/Constants/constants'
import { toggleAddVotingModal } from '@/store/uiSlice'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from './common/Button'
import { RootState } from '@/store/store'
import AddVotingModal from './Modals/AddVotingModal'

type Props = {}

const EmptyBoard = (props: Props) => {
    const isAddVotingModalOpen = useSelector((state: RootState) => state.ui.isAddVotingModalOpen);

    const dispatch = useDispatch();
  return (
    <div className="flex justify-center items-center h-1/2 flex-col lg:h-full lg:w-full">
        <h1>There are no votings yet</h1>
        <Button onClick={() => dispatch(toggleAddVotingModal())} className="w-fit mt-8 bg-main-primary rounded-lg uppercase tracking-wider text-center px-6 py-4"><p>{TEXT_CONSTANTS.ADD_VOTING}</p></Button>
        {isAddVotingModalOpen && <AddVotingModal />}
    </div>
  )
}

export default EmptyBoard