import React from 'react';
import { Formik, Form, Field, validateYupSchema } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import axios from 'axios';
import { IVoting } from '@/Types/Interfaces';
import { addVoting } from '@/store/dataSlice';
import { useDispatch } from 'react-redux';
import { switchActiveVote, toggleAddVotingModal } from '@/store/uiSlice';
import { useSession } from 'next-auth/react';

const AddVotingForm = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const initialValues = {
    title: '',
  };
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
  });

  const onSubmit = async (values: any) => {
    try {
      const newVoting = {
        title: values.title,
        status: 'Just Created',
        userEmail: session?.user?.email,
      };
      const voting: any = await axios.post('/api/voting', newVoting);
      //console.log("new Voting", voting)
      dispatch(addVoting(voting.data.object));
      dispatch(toggleAddVotingModal());
      dispatch(switchActiveVote(voting.data.object._id))
    } catch (err: any) {
      console.error('error', err.message);
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched }) => (
          <Form className="px-4 py-3 space-y-5">
            <div>
              <label htmlFor="title">
                <p>Name</p>
              </label>
              <Field
                className="w-full bg-background rounded-md border border-neutral-tertiary cursor-pointer text-sm mt-2 py-3 px-2 tracking-[0.075em] font-light"
                type="text"
                id="title"
                name="title"
              />
              {errors.title && touched.title && (
                <p className=" text-status-rejected mt-1">{errors.title}</p>
              )}
            </div>
            <Button className="w-full bg-main-primary rounded py-3">
              <p>Add Voting</p>
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddVotingForm;
