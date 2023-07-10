import React from 'react';
import Button from '../common/Button';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addExpert, addObject } from '@/store/dataSlice';
import { IMPORT_OPTIONS } from '@/Constants/constants';
import { IExpert } from '@/Types/Interfaces';
import { sendEmail } from '@/util/helpers';
import { renderToStaticMarkup } from 'react-dom/server';
import Email from './VotingEmailForm';

type Props = {};

interface ImportFormValues {
  file: File | null;
  startingCell: string;
  endingCell: string;
  importOption: string;
}

const ImportFileForm = (props: Props) => {
  const activeVoting = useSelector(
    (state: RootState) => state.ui.activeVotingIndex
  );
  const isAddObjectModalOpen = useSelector(
    (state: RootState) => state.ui.isAddObjectModalOpen
  );
  const dispatch = useDispatch();

  const handleFileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const file = form.file.files && form.file.files[0];
    const startingCell = form.startingCell.value;
    const endingCell = form.endingCell.value;
    const importOption = form.importOption.value;

    const values: ImportFormValues = {
      file,
      startingCell,
      endingCell,
      importOption,
    };

    //console.log('values', values);

    if (values.file) {
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        if (e.target?.result) {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const objects = [];
          const range = XLSX.utils.decode_range(
            `${startingCell}:${endingCell}`
          );
          for (let row = range.s.r; row <= range.e.r; row++) {
            const rowData = [];
            for (let col = range.s.c; col <= range.e.c; col++) {
              const cellAddress = { c: col, r: row };
              const cellRef = XLSX.utils.encode_cell(cellAddress);
              const cell = worksheet[cellRef];
              const value = cell ? cell.v : undefined;
              rowData.push(value);
            }
            objects.push(rowData);
          }
          //console.log('jsonData', objects);
          postData(objects, importOption);
        }
      };
      reader.readAsArrayBuffer(values.file);
    }
  };

  const postData = async (data: any[], importOption: string) => {
    try {
      if (isAddObjectModalOpen) {
        const response = await axios.post('/api/objects', {
          data,
          votingId: activeVoting,
          importOption,
        });

        dispatch(
          addObject({ objects: response.data.objects, votingId: activeVoting })
        );
      } else {
        const response = await axios.post('/api/experts', {
          data,
          votingId: activeVoting,
          importOption,
        });
        const assessments = new Map(response.data.assessments);
        const newExperts = response.data.objects.filter(
          (expert: IExpert) => !assessments.get(expert._id)
        );
        for(const expert of newExperts) {
            sendEmail(activeVoting as string,  renderToStaticMarkup(
              <Email
                url={`${process.env.BASE_URL}/vote?votingId=${activeVoting}&expertId=${expert._id}`}
              />
            ))
        }
        //console.log('RESPONSE experts', response);
        dispatch(
          addExpert({ objects: response.data.objects, votingId: activeVoting })
        );
      }
    } catch (error) {
      console.error('ERror', error);
    }
  };

  return (
    <form
      onSubmit={handleFileSubmit}
      encType="multipart/form-data"
      className="px-6 py-4 space-y-5"
    >
      <div>
        <label htmlFor="file">
          <p>Choose File</p>
        </label>
        <input type="file" id="file" name="file" accept=".xls, .xlsx" />
      </div>

      <div>
        <label htmlFor="startingCell">
          <p>Starting Cell</p>
        </label>
        <input
          className="w-full bg-background rounded-md border border-neutral-tertiary cursor-pointer text-sm mt-2 py-3 px-2 tracking-[0.075em] font-light"
          type="text"
          id="startingCell"
          name="startingCell"
        />
      </div>

      <div>
        <label htmlFor="endingCell">
          <p>Ending Cell</p>
        </label>
        <input
          className="w-full bg-background rounded-md border border-neutral-tertiary cursor-pointer text-sm mt-2 py-3 px-2 tracking-[0.075em] font-light"
          type="text"
          id="endingCell"
          name="endingCell"
        />
      </div>

      <div className="flex items-center mt-2">
        <label htmlFor="importOption" className="mr-2">
          Import Option:
        </label>
        <select
          id="importOption"
          name="importOption"
          className="w-32 bg-background rounded-md border border-neutral-tertiary cursor-pointer text-sm py-3 px-2 tracking-[0.075em] font-light"
        >
          <option value={IMPORT_OPTIONS.MERGE}>{IMPORT_OPTIONS.MERGE}</option>
          <option value={IMPORT_OPTIONS.UPDATE}>{IMPORT_OPTIONS.UPDATE}</option>
          <option value={IMPORT_OPTIONS.REPLACE}>
            {IMPORT_OPTIONS.REPLACE}
          </option>
        </select>
      </div>
      <Button className="w-full bg-main-primary rounded py-3 mt-4">
        <p>Add</p>
      </Button>
    </form>
  );
};

export default ImportFileForm;
