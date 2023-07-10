import { Formik, Form, Field } from 'formik';
import React, { ChangeEventHandler, useState } from 'react';
import * as Yup from 'yup';
import Button from '../common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axios from 'axios';
import { addObject, editObject } from '@/store/dataSlice';
import { clearEditingObject, toggleAddObjectModal } from '@/store/uiSlice';
import XLSX from 'xlsx';
import ImportFileForm from './ImportFileForm';

function AddObjectForm() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const activeVoting = useSelector(
        (state: RootState) => state.ui.activeVotingIndex
    );
    const editingObject = useSelector(
        (state: RootState) => state.ui.editingObject
    );
    const dispatch = useDispatch();

    const initialValues = editingObject
        ? { title: editingObject.title, description: editingObject.description }
        : { title: '', description: '' };

    const validationSchema = Yup.object({
        title: Yup.string().required('Name is required'),
        description: Yup.string(),
    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (activeVoting) {
                let response;
                if (editingObject) {
                    const objectData = {
                        newObjectData: {
                            title: values.title,
                            description: values.description,
                        },
                        votingId: activeVoting,
                    };
                    response = await axios.put(
                        `/api/objects?objectId=${editingObject._id}`,
                        objectData
                    );
                } else {
                    const newObject = {
                        title: values.title,
                        description: values.description,
                        votingId: activeVoting,
                    };
                    response = await axios.post('/api/objects', newObject);
                }

                //console.log('RESPONSE in addObjectorm', response);

                if (editingObject) {
                    dispatch(
                        editObject({
                            object: response.data.object,
                            objectId: editingObject._id,
                            votingId: activeVoting,
                        })
                    );
                } else {
                    dispatch(
                        addObject({
                            objects: response.data.objects,
                            votingId: activeVoting,
                        })
                    );
                }
                dispatch(clearEditingObject());
                dispatch(toggleAddObjectModal());
                setLoading(false);
            }
        } catch (err: any) {
            console.error('error', err.message);
        }
    };

    return (
        <div className="px-8">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, errors, touched }) => (
                    <Form className="py-8 space-y-5">
                        <div>
                            <label htmlFor="title">
                                <p>Title</p>
                            </label>
                            <Field
                                className="w-full bg-background rounded-md border border-neutral-tertiary cursor-pointer text-sm mt-2 py-3 px-2 tracking-[0.075em] font-light"
                                type="text"
                                id="title"
                                name="title"
                            />
                            {errors.title && touched.title && (
                                <p className=" text-status-rejected mt-1">{errors.title as string}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="description">
                                <p>Description</p>
                            </label>
                            <Field
                                as="textarea"
                                id="description"
                                name="description"
                                placeholder="e.g. It's a first object in a voting."
                                className=" mt-2 w-full px-2 py-2 h-28 border border-neutral-tertiary rounded-md bg-background text-sm cursor-pointer tracking-[.075em]"
                                rows="3"
                            />
                        </div>
                        {isLoading ? (
                            <button
                                disabled
                                type="button"
                                className="bg-main-primary w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center"
                            >
                                <svg
                                    aria-hidden="true"
                                    role="status"
                                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="#E5E7EB"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Loading...
                            </button>
                        ) : (
                            <Button className="w-full bg-main-primary rounded py-3">
                                <p>{editingObject ? 'Save Changes' : 'Add Object'}</p>
                            </Button>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default AddObjectForm;
