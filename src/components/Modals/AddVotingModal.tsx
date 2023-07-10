import React from 'react'
import Modal from './Modal'
import { useDispatch } from 'react-redux'
import { toggleAddVotingModal } from '@/store/uiSlice'
import Image from 'next/image'
import AddExpertForm from '../Forms/AddExpertForm'
import AddVotingForm from '../Forms/AddVotingForm'

type Props = {}

const AddVotingModal = (props: Props) => {
    const dispatch = useDispatch();
    return (
        <Modal event={() => dispatch(toggleAddVotingModal())}>
            <div onClick={(e) => e.stopPropagation()} className="relative w-[320px] py-4 z-20 min-h-fit mx-auto bg-background rounded-lg border border-main-secondary ">
                <div className="flex items-center justify-between pb-2 border-b-[.5px] px-4">
                    <h2 className="text-lg font-light tracking-[.05em] uppercase">Add a Voting</h2>
                    <Image src={'/close.svg'} width={24} height={24} className="cursor-pointer" alt="close" onClick={() => dispatch(toggleAddVotingModal())} />
                </div>
                <AddVotingForm />
            </div>
        </Modal>
    )
}

export default AddVotingModal