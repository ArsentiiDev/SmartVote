import React, { useState } from 'react';
import Button from './common/Button';
import { CRITERIA, TEXT_CONSTANTS } from '@/Constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { switchCriteria, switchMethod } from '@/store/uiSlice';
import axios from 'axios';
import { clearResults, setResults } from '@/store/dataSlice';


const Criteria: React.FC = () => {
  const selectedCriteria = useSelector(
    (state: RootState) => state.ui.selectedCriteria
  );
  const selectedMethod = useSelector(
    (state: RootState) => state.ui.selectedMethod
  );
  const activeVoting = useSelector(
    (state: RootState) => state.ui.activeVotingIndex
  );
  const votes = useSelector(
    (state: RootState) =>
      state.data.votings.find((voting) => voting._id === activeVoting)?.votes
  );
  const dispatch = useDispatch();

  const [submitError, setSubmitError] = useState(null);

  const criterias = [
    { name: CRITERIA.ADDITIVE },
    { name: CRITERIA.MINMAX },
    { name: CRITERIA.QUADRATIC },
  ];

  const methods = [{ name: 'Algebraic method' }];

  const renderCriterias = () =>
    criterias.map((el, index) => {
      const className =
        selectedCriteria === el.name
          ? 'bg-main-secondary px-6 py-3 rounded-lg lg:px-3 text-neutral-primary'
          : 'hover:bg-neutral-quaternary px-6 py-3 rounded-lg lg:px-3 text-neutral-secondary';

      return (
        <Button
          key={index}
          className={className}
          onClick={() => dispatch(switchCriteria(el.name))}
        >
          <h4 className={`cursor-pointer`}>{el.name}</h4>
        </Button>
      );
    });

  const renderMethods = () =>
    methods.map((el, index) => {
      const className =
        selectedMethod === el.name
          ? 'bg-main-secondary px-6 py-3 rounded-lg text-neutral-primary'
          : 'hover:bg-neutral-quaternary px-6 py-3 rounded-lg text-neutral-secondary';

      return (
        <Button
          key={index}
          className={className}
          onClick={() => dispatch(switchMethod(el.name))}
        >
          <h4 className={`lowercase  cursor-pointer`}>{el.name}</h4>
        </Button>
      );
    });

  const getResults = async () => {
    setSubmitError(null)
    dispatch(clearResults());
    try {
      if (!selectedCriteria || !selectedMethod) {
        throw new Error('Please choose method and criteria');
      }
      const body = {
        criteria: selectedCriteria,
        method: selectedMethod,
        votingId: activeVoting,
      };
      const response = await axios.post('/api/results', body);
      //console.log('RESULTS', response);
      if (response.data.success) {
        dispatch(
          setResults({
            results: response.data.objects,
            votingId: activeVoting as string,
          })
        );
      }
    } catch (err: any) {
      console.error('ERROR', err.message);
      setSubmitError(err.message);
    }
  };

  return (
    <div className="my-6 lg:flex lg:flex-col lg:justify-between lg:h-96">
      <div>
        <h3>{TEXT_CONSTANTS.CHOOSE_CRITERIA}</h3>
        <div className="flex gap-x-12 my-4 lg:gap-2 xl:gap-3">
          {renderCriterias()}
        </div>

        <h3>{TEXT_CONSTANTS.CHOOSE_METHOD}</h3>
        <div className="flex gap-12 my-4">{renderMethods()}</div>
      </div>
      {!votes ? (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[75%] my-12 mx-auto lg:mx-auto lg:my-2">
          <Button className="bg-neutral-tertiary disabled block cursor-default w-full py-2 rounded-lg uppercase tracking-widest">
            <h3>{TEXT_CONSTANTS.GET_RESULTS}</h3>
          </Button>
          <p className="text-neutral-secondary text-center text-sm font-light tracking-widest">
            {TEXT_CONSTANTS.ERROR_LOCKED}
          </p>
        </div>
      ) : (
        <div className="w-full my-12 mx-auto lg:mx-auto lg:my-2">
          <Button
            onClick={getResults}
            className="bg-main-primary block w-[75%] mx-auto py-2 rounded-lg mt-12 uppercase tracking-widest"
          >
            <h3>{TEXT_CONSTANTS.GET_RESULTS}</h3>
          </Button>
          {submitError && (
            <p className="text-status-rejected text-sm text-center">{submitError}</p>
          )}{' '}
        </div>
      )}
    </div>
  );
};

export default Criteria;
