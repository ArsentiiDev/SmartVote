import Image from 'next/image';
import React from 'react'
import Button from '../common/Button';
import { TEXT_CONSTANTS } from '@/Constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleAddVotingModal, toggleVotingDropdown } from '@/store/uiSlice';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const {data:session, status} = useSession()
  const isLoginned = false
  const isVotingModalOpen = useSelector((state: RootState) => state.ui.isVotingModalOpen);

  const dispatch = useDispatch();
  const activeVoting = useSelector((state: RootState) => state.ui.activeVotingIndex);

  const votings = useSelector((state: RootState) => state.data.votings)

  const handleTooltipToggle = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click event from bubbling up to document
    dispatch(toggleVotingDropdown())
  };

  return (
    <>
      <div className="flex items-center justify-between h-16">
        <h1 className="hidden md:block">{TEXT_CONSTANTS.VOTING_APP}</h1>
        <Button className="flex gap-2 items-center md:hidden" onClick={(e: any) => handleTooltipToggle(e)}>
          <h2 className="font">{votings?.find(voting => voting._id === activeVoting)?.title}</h2>
          {isVotingModalOpen ? <Image src={"/up.svg"} width={14} height={6} alt='all votes' /> : <Image src={"/tick.svg"} width={14} height={6} alt='all votes' />}
        </Button>

        <div className="flex gap-8">
          {status === 'authenticated' ? (
            <div className='flex items-center gap-4'>
            {session.user?.image && (<Image src={session.user?.image} width={28} height={28} alt='avatar' className='rounded-full'/>)}
           
            <h3>{session.user?.name}</h3>
            <Button className='bg-main-primary py-2 px-4 rounded-lg text-neutral-primary'>

            <h3 className='cursor-pointer  tracking-wider' onClick={() => signOut()}>Sign Out</h3>
            </Button>
            </div>
          ) : (
            <Button className="uppercase rounded-lg tracking-widest">
              <h3>Login</h3>
            </Button>
          )}

          <Button>
            <Image src={"/threedotssvg.svg"} width={6} height={24} alt="settings" />
          </Button>
        </div>
      </div>
    </>
  );
}
