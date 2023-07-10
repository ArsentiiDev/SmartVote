import React from 'react'
import Modal from './Modal'
import { toggleAddHeuristicModal } from '@/store/uiSlice'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import AddObjectForm from '../Forms/AddObjectForm'
import AddHeuristicForm from '../Forms/AddHeuristicForm'
import { RootState } from '@/store/store'

type Props = {}

const AddHeuristicModal = (props: Props) => {
    const editingObject = useSelector((state: RootState) => state.ui.editingObject)

    const dispatch = useDispatch();
    return (
        <Modal event={() => dispatch(toggleAddHeuristicModal())}>
            <div onClick={(e) => e.stopPropagation()} className="relative w-[320px] py-4 z-20 min-h-fit mx-auto bg-background rounded-lg border border-main-secondary ">
                <div className="flex items-center justify-between pb-2 border-b-[.5px] px-4">
                    <h2 className="text-lg font-light tracking-[.05em] uppercase">{editingObject? 'Edit Heuristic': 'Add Heuristic' }</h2>
                    <Image src={'/close.svg'} width={24} height={24} className="cursor-pointer" alt="close" onClick={() => dispatch(toggleAddHeuristicModal())} />
                </div>
                <AddHeuristicForm />
            </div>
        </Modal>
    )
}

export default AddHeuristicModal