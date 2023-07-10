import React, { useState } from 'react'
import Modal from './Modal'
import { useDispatch, useSelector } from 'react-redux'
import { clearEditingObject, toggleAddObjectModal } from '@/store/uiSlice'
import Image from 'next/image'
import AddObjectForm from '../Forms/AddObjectForm'
import { RootState } from '@/store/store'
import ImportFileForm from '../Forms/ImportFileForm'
import ToggleSwitch from '../common/ToggleSwitch'


const AddObjectModal: React.FC = () => {
    const [isImport, setImport] = useState<boolean>(false)
    const editingObject = useSelector((state: RootState) => state.ui.editingObject)

    const dispatch = useDispatch();

    const toggleFormType = () => {
        setImport(!isImport);
    };

    return (
        <Modal event={() => { dispatch(toggleAddObjectModal()) }}>
            <div onClick={(e) => e.stopPropagation()} className="relative w-1/4 py-4 z-20 h-2/8 max-h-2/8 mx-auto bg-background rounded-lg border border-main-secondary ">
                <div className="flex items-center justify-between pb-2 border-b-[.5px] px-4">
                    <h2 className="text-lg font-light tracking-[.05em] uppercase">{editingObject ? 'Edit Object' : 'Add Object'}</h2>
                    <Image src={'/close.svg'} width={24} height={24} className="cursor-pointer" alt="close" onClick={() => { dispatch(toggleAddObjectModal()) }} />
                </div>
                <div className="flex items-center justify-center my-4">
                    <ToggleSwitch isOn={!isImport} handleToggle={toggleFormType} />
                </div>
                {isImport ? (<ImportFileForm />) : (<AddObjectForm />)}
            </div>
        </Modal>
    )
}

export default AddObjectModal