import { RootState } from '@/store/store'
import Image from 'next/image'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../common/Button'
import { switchActiveVote, toggleAddVotingModal, toggleVotingDropdown } from '@/store/uiSlice'

type Props = {}

const HeaderDropdownModal = (props: Props) => {
    const votings = useSelector((state: RootState) => state.data.votings)

    const activeVoting = useSelector((state: RootState) => state.ui.activeVotingIndex);
    const dispatch = useDispatch();

    return (
        <div className="absolute md:hidden inset-x-0 top-14 bottom-0 z-40" onClick={() => dispatch(toggleVotingDropdown())}>
            <div className="tooltip relative top-0 left-2 rounded-lg bg-background border border-main-secondary min-h-56 w-80 z-20" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-between pb-2 border-b-[.5px] px-4 py-4">
                    <h2 className="text-lg font-light tracking-[.05em]">All Votings</h2>
                    <Image src={'/close.svg'} width={24} height={24} className="cursor-pointer" alt="close" onClick={close} />
                </div>
                <div className='flex gap-2 flex-col mt-4'>
                    {votings && votings.map((element, index) => (
                        <Button onClick={() => dispatch(switchActiveVote(element._id))} className={`py-2 my-0 text-left ${activeVoting === element._id ? 'bg-main-secondary px-2 text-neutral-primary' : 'hover:bg-main-secondary cursor-pointer px-2 rounded text-neutral-secondary hover:text-neutral-primary'}`} key={index}>
                            <h3 className="">{element.title}</h3>
                        </Button>
                    ))}
                    <Button onClick={() => { dispatch(toggleVotingDropdown()); dispatch(toggleAddVotingModal()) }} className="w-full rounded-b-md bg-main-primary py-4 mt-6">
                        <p>Add voting</p>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeaderDropdownModal