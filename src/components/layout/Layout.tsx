import * as React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

import HeaderDropdownModal from '../Modals/Header.Modal';


export interface IAppProps {
  children: JSX.Element
}

export default function Layout(props: IAppProps) {
  const isVotingModalOpen = useSelector((state: RootState) => state.ui.isVotingModalOpen);

  return (
    <div className='flex flex-col min-h-screen'>
      <header className="border-b-[.5px] border-b-neutral-primary md:border-0 px-5 sticky top-0 bg-background z-20">
        <Navbar />
      </header>
      <div className="flex flex-1 ml-5 mr-5">
        <aside className="hidden md:block md:basis-2/6 border-r-[.5px] border-r-neutral-secondary my-4 mr-10 pr-5 lg:basis-1/5">
          <Sidebar />
        </aside>
        <main className="w-full md:basis-4/6 lg:basis-4/5">{props.children}</main>
      </div>
      {isVotingModalOpen && <HeaderDropdownModal />}
    </div>
  );
}
