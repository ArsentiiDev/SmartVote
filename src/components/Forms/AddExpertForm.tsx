import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axios from 'axios';
import { addExpert, editExpert } from '@/store/dataSlice';
import { toggleAddExpertModal, clearEditingObject } from '@/store/uiSlice';
import Email from '../Forms/VotingEmailForm';
import { renderToStaticMarkup } from 'react-dom/server';
import { sendEmail } from './../../util/helpers';

const AddExpertForm = () => {
  const activeVoting = useSelector(
    (state: RootState) => state.ui.activeVotingIndex
  );
  const editingExpert = useSelector(
    (state: RootState) => state.ui.editingObject
  );
  const [submitError, setSubmitError] = useState(null);
  const dispatch = useDispatch();

  const initialValues = editingExpert
    ? { name: editingExpert.name, email: editingExpert.email }
    : { name: '', email: '' };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email().required('Email is required'),
  });

  const onSubmit = async (values: any) => {
    try {
      if (activeVoting) {
        let response;
        if (editingExpert) {
          const expertData = {
            newExpertData: {
              name: values.name,
              email: values.email,
            },
            votingId: activeVoting,
          };
          response = await axios.put(
            `/api/experts?expertId=${editingExpert._id}`,
            expertData
          );
          dispatch(
            editExpert({
              expert: response.data.object,
              expertId: editingExpert._id,
              votingId: activeVoting,
            })
          );
        } else {
          const newExpert = {
            name: values.name,
            email: values.email,
            votingId: activeVoting,
          };
          response = await axios.post('/api/experts', newExpert);
          dispatch(
            addExpert({
              objects: response.data.objects,
              votingId: activeVoting,
            })
          );
          //console.log(response.data)
          sendEmail(
            activeVoting,
            renderToStaticMarkup(
              <Email
                url={`${process.env.BASE_URL}/vote?votingId=${activeVoting}&expertId=${response.data.objects[0]._id}`}
              />
            )
          );
        }
        dispatch(clearEditingObject());
        dispatch(toggleAddExpertModal());
      }
    } catch (err: any) {
      console.error('error', err.response.data.error);
      setSubmitError(err.response.data.error);
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
              <label htmlFor="name">
                <p>Name</p>
              </label>
              <Field
                className="w-full bg-background rounded-md border border-neutral-tertiary cursor-pointer text-sm mt-2 py-3 px-2 tracking-[0.075em] font-light"
                type="text"
                id="name"
                name="name"
              />
              {errors.name && touched.name && (
                <p className=" text-status-rejected mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email">
                <p>Email</p>
              </label>
              <Field
                className="w-full bg-background rounded-md border border-neutral-tertiary cursor-pointer text-sm mt-2 py-3 px-2 tracking-[0.075em] font-light"
                type="text"
                id="email"
                name="email"
              />
              {errors.email && touched.email && (
                <p className=" text-status-rejected mt-1">{errors.email}</p>
              )}
            </div>
            <Button className="w-full bg-main-primary rounded py-3">
              <p>{editingExpert ? 'Save Changes' : 'Add Expert'}</p>
            </Button>
            {submitError && (
              <p className="text-status-rejected text-sm">{submitError}</p>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddExpertForm;
