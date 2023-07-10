import React, { useEffect } from 'react'
import Button from '../common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { setEditingObject, toggleAddExpertModal, toggleAddHeuristicModal, toggleAddObjectModal, toggleTooltip } from '@/store/uiSlice'
import axios from 'axios'
import { RootState } from '@/store/store'
import { removeExpert, removeHeuristic, removeObject } from '@/store/dataSlice'


const CardTooltip = ({ id, type, element }: {
    id: any,
    type:string,
    element: any
}) => {

    const activeVoting = useSelector((state: RootState) => state.ui.activeVotingIndex);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            dispatch(toggleTooltip(null))
        }

        document.addEventListener('click', handleOutsideClick)
        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    })

    const removeItem = async () => {
        let response
        switch(type) {
            case 'objects':
                response = await axios.delete(`/api/objects?objectId=${id}&votingId=${activeVoting}`)
                if (response.data.success) {
                    dispatch(removeObject({objectId:id, votingId: activeVoting}))
                    dispatch(toggleTooltip(null))
                }
                break;
            case 'experts':
                response = await axios.delete(`/api/experts?expertId=${id}&votingId=${activeVoting}`)
                if (response.data.success) {
                    dispatch(removeExpert({expertId:id, votingId: activeVoting}))
                    dispatch(toggleTooltip(null))
                }
                break;
            case 'heuristics':
                response = await axios.delete(`/api/heuristics?heuristicId=${id}&votingId=${activeVoting}`)
                if (response.data.success) {
                    dispatch(removeHeuristic({heuristicId:id, votingId: activeVoting}))
                    dispatch(toggleTooltip(null))
                }
                break;
            
        }

    }

    const togglEditButton = () => {
        //console.log('element', element)
        dispatch(setEditingObject(element))
        switch(type) {
            case 'objects':
                dispatch(toggleTooltip(null))
                dispatch(toggleAddObjectModal())
                break;
            case 'experts':
                dispatch(toggleTooltip(null));
                dispatch(toggleAddExpertModal())
                break;
            case 'heuristics':
                dispatch(toggleTooltip(null));
                dispatch(toggleAddHeuristicModal())
        }
    }

    return (
        <div className="tooltip absolute top-0 right-0 rounded-lg z-10 bg-background border border-main-secondary">
            <Button onClick={togglEditButton} className="w-full hover:bg-neutral-tertiary px-5 py-1 rounded-t-lg"><h4>Edit</h4></Button>
            <Button onClick={removeItem} className="text-status-rejected w-full px-5 py-1 hover:bg-status-rejected-bg rounded-b-lg"><h4>Delete</h4></Button>
        </div>
    )
}

export default CardTooltip