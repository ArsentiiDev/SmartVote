import React, { useState } from 'react';
import Modal from './Modal';
import { clearEditingObject, toggleAddExpertModal } from '@/store/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import AddObjectForm from '../Forms/AddObjectForm';
import AddExpertForm from '../Forms/AddExpertForm';
import { RootState } from '@/store/store';
import ToggleSwitch from '../common/ToggleSwitch';
import ImportFileForm from '../Forms/ImportFileForm';


function AddExpertModal() {
  const editingObject = useSelector(
    (state: RootState) => state.ui.editingObject
  );
  const [isImport, setImport] = useState<boolean>(false);
  const dispatch = useDispatch();

  const toggleFormType = () => {
    setImport(!isImport);
  };

  return (
    <Modal event={() => dispatch(toggleAddExpertModal())}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[400px] py-4 z-20 h-fit mx-auto bg-background rounded-lg border border-main-secondary "
      >
        <div className="flex items-center justify-between pb-2 border-b-[.5px] px-4">
          <h2 className="text-lg font-light tracking-[.05em] uppercase">
            {editingObject ? 'Edit Expert' : 'Add Expert'}
          </h2>
          <Image
            src={'/close.svg'}
            width={24}
            height={24}
            className="cursor-pointer"
            alt="close"
            onClick={() => {dispatch(clearEditingObject()); dispatch(toggleAddExpertModal())}}
          />
        </div>
        <div className="flex items-center justify-center my-4">
          <ToggleSwitch isOn={!isImport} handleToggle={toggleFormType} />
        </div>
        {isImport ? <ImportFileForm /> : <AddExpertForm />}
      </div>
    </Modal>
  );
}

export default AddExpertModal;
