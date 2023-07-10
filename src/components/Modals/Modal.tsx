import { clearEditingObject } from '@/store/uiSlice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';


const Modal = ({ children, event }: {
    children: JSX.Element,
    event: () => void
}) => {
    const dispatch = useDispatch()
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []); 

    return (
        <div onClick={() => {dispatch(clearEditingObject()); event()} } className="fixed overflow-hidden inset-0 bg-modal z-10 flex items-center justify-center">
            {children}
        </div>
    )
}

export default Modal