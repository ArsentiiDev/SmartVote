import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/common/Button';
import { IObject, ISuccessResponse } from '@/Types/Interfaces';
import axios from 'axios';
import { useRouter } from 'next/router';

const VotingForm: React.FC = ({}) => {
  const [objects, setObjects] = useState<IObject[] | null>(null);
  const [isSubmitted, setSubmit] = useState<boolean>(false);
  const router = useRouter();

  const initialValues = {
    firstPlace: '',
    secondPlace: '',
    thirdPlace: '',
  };
  const validationSchema = Yup.object({
    firstPlace: Yup.string().required('First place vote is required'),
    secondPlace: Yup.string().required('Second place vote is required'),
    thirdPlace: Yup.string().required('Third place vote is required'),
  });

  const onSubmit = async (values: any) => {
    const newAssessment = {
      firstPlace: values.firstPlace,
      secondPlace: values.secondPlace,
      thirdPlace: values.thirdPlace,
      expertId: router.query.expertId,
      votingId: router.query.votingId,
    };
    try {
      const response: any = await axios.post(
        `/api/submitForm`,
        newAssessment
      );
      if (response.data.success) {
        const newVote = {
          scores: response.data.object as string[],
          votingId: newAssessment.votingId as string,
        };
        //console.log('/api/votes');
        await axios.post(`/api/votes`, newVote);
      }
      setSubmit(true);
      router.replace(router.pathname);
    } catch (err: any) {
      //console.log('error', err.message);
    }
  };

  useEffect(() => {
    if (router.isReady && router.query.votingId) {
      const fetchObjects = async () => {
        try {
          const response = await axios
            .get(
              `${process.env.BASE_URL}/api/objects?votingId=${router.query.votingId}`
            )
            .then((res) => res.data);
          setObjects(response.objects);
          //console.log('objects', response);
        } catch (err) {
          //console.log('error');
        }
      };
      fetchObjects();
    }
  }, [router.isReady, router.query.votingId]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full md:w-1/2 lg:w-1/4 m-x-2">
        {isSubmitted ? (
          <h1>Thanks for your vote</h1>
        ) : (
          <>
            <h1 className="text-center mb-8">Please take a vote</h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, errors, touched }) => (
                <Form className="px-4 py-3 space-y-12">
                  <div>
                    <label htmlFor="firstPlace mb-4">
                      <p>First Place</p>
                    </label>
                    <Field
                      as="select"
                      id="firstPlace"
                      name="firstPlace"
                      className="bg-background px-8 py-2 flex items-center justify-between w-full mt-2"
                    >
                      <option selected>Choose an object</option>
                      {objects &&
                        objects
                          .filter(
                            (object) =>
                              object.title !== values.secondPlace &&
                              object.title !== values.thirdPlace
                          )
                          .map((object, index) => (
                            <option key={index} value={object.title}>
                              {object.title}
                            </option>
                          ))}
                    </Field>
                    <ErrorMessage
                      name="firstPlace"
                      component="p"
                      className="text-status-rejected mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="secondPlace">
                      <p>Second Place</p>
                    </label>
                    <Field
                      as="select"
                      id="secondPlace"
                      name="secondPlace"
                      className="bg-background px-8 py-2 flex items-center justify-between w-full mt-2"
                    >
                      <option selected>Choose an object</option>
                      {objects &&
                        objects
                          .filter(
                            (object) =>
                              object.title !== values.firstPlace &&
                              object.title !== values.thirdPlace
                          )
                          .map((object, index) => (
                            <option key={index} value={object.title}>
                              {object.title}
                            </option>
                          ))}
                    </Field>
                    <ErrorMessage
                      name="secondPlace"
                      component="p"
                      className="text-status-rejected mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="thirdPlace">
                      <p>Third Place</p>
                    </label>
                    <Field
                      as="select"
                      id="thirdPlace"
                      name="thirdPlace"
                      className="bg-background px-8 py-2 flex items-center justify-between w-full mt-2"
                    >
                      <option selected>Choose an object</option>
                      {objects &&
                        objects
                          .filter(
                            (object) =>
                              object.title !== values.firstPlace &&
                              object.title !== values.secondPlace
                          )
                          .map((object, index) => (
                            <option key={index} value={object.title}>
                              {object.title}
                            </option>
                          ))}
                    </Field>
                    <ErrorMessage
                      name="thirdPlace"
                      component="p"
                      className="text-status-rejected mt-1"
                    />
                  </div>
                  <Button className="w-full bg-main-primary rounded py-3">
                    <p>Add Voting</p>
                  </Button>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
};

export default VotingForm;
