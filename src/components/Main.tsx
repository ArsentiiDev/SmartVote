import React from 'react'
import Button from './common/Button';
import Chart from './common/Chart';
import Experts from './Experts'
import Objects from './Objects';
import Heuristics from './Heuristics';
import Criteria from './Criteria';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { switchActiveTab } from '@/store/uiSlice';
import { TEXT_CONSTANTS } from './../Constants/constants';
import AddObjectModal from './Modals/AddObjectModal';
import AddExpertModal from './Modals/AddExpertModal';
import AddHeuristicModal from './Modals/AddHeuristicModal';
import AddVotingModal from './Modals/AddVotingModal';
import WinnersCard from './WinnersCard';


export enum Tab {
  Objects,
  Experts,
  Heuristics
}

interface TabInfo {
  id: Tab,
  name: string
}

const Main: React.FC = () => {

  const activeTab = useSelector((state: RootState) => state.ui.activeTab)
  const isAddObjectModalOpen = useSelector((state: RootState) => state.ui.isAddObjectModalOpen)
  const isAddExpertModalOpen = useSelector((state: RootState) => state.ui.isAddExpertModalOpen)
  const isAddHeuristicModalOpen = useSelector((state: RootState) => state.ui.isAddHeuristicModalOpen)
  const isAddVotingModalOpen = useSelector((state: RootState) => state.ui.isAddVotingModalOpen)

  const dispatch = useDispatch();

  const tabs: TabInfo[] = [
    { id: Tab.Objects, name: 'Objects' },
    { id: Tab.Experts, name: 'Experts' },
    { id: Tab.Heuristics, name: 'Heuristics' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Objects: return <Objects />;
      case Tab.Experts: return <Experts />;
      case Tab.Heuristics: return <Heuristics />;
      default: return null;
    }
  }

  const switchActive = (index: Tab): void => {
    dispatch(switchActiveTab(index))
  }

  const renderTabs = ():JSX.Element[] => tabs.map((el, index) => {
    const isActiveTab = activeTab === index;
    const className = isActiveTab ? "bg-main-secondary px-4 pt-1 pb-3 rounded-t-lg text-neutral-primary"
      : "hover:bg-neutral-quaternary px-4 pt-1 pb-3 rounded-t-lg text-neutral-secondary";
    return (
      <Button
        key={index}
        className={className}
        onClick={() => switchActive(index)}>
        <h3 className={`lowercase  cursor-pointer`}>{el.name}</h3>
      </Button>
    );
  });


  return (
    <div className="mt-8 lg:flex lg:flex-row lg:flex-wrap">
      <div className="flex mb-1 items-center lg:hidden gap-1">
        {renderTabs()}
      </div>
      <div className='block lg:hidden'>
        {renderContent()}
        <Criteria />
      </div>
      <div className='hidden lg:grid lg:grid-cols-4 lg:w-full'>
        <Objects />
        <Experts />
        <Heuristics />
        <Criteria />
      </div>

      <div className="lg:w-full lg:grid lg:grid-cols-2 lg:mt-12 lg:items-baseline lg:gap-12" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="h-80 lg:h-[330px] z-0">
          <h2>{TEXT_CONSTANTS.RESULT_GRAPH}</h2>
          <Chart />
        </div>
        <WinnersCard />
      </div>
      {isAddObjectModalOpen && <AddObjectModal />}
      {isAddExpertModalOpen && <AddExpertModal />}
      {isAddHeuristicModalOpen && <AddHeuristicModal />}
      {isAddVotingModalOpen && <AddVotingModal />}
    </div>
  );
}

export default Main;