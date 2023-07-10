import React from 'react'
import { Formik, Form, Field, validateYupSchema } from 'formik'
import * as Yup from 'yup'
import Button from '../common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import axios from 'axios'
import { clearEditingObject, toggleAddHeuristicModal } from '@/store/uiSlice'
import { addHeuristic, editHeuristic } from '@/store/dataSlice'
import { IHeuristic } from '@/Types/Interfaces'

const AddHeuristicForm = () => {
    const activeVoting = useSelector((state: RootState) => state.ui.activeVotingIndex);
    const editingObject = useSelector((state: RootState) => state.ui.editingObject)

    const dispatch = useDispatch();
    type heuristicValues = {
        sum: number,
        placing: number
    }

    const initialValues = editingObject
    ? { sum: editingObject.sum, placing: editingObject.placing }
    : { sum: null, placing: null };
    const validationSchema = Yup.object({
        sum: Yup.number()
            .typeError("That doesn't look like a number")
            .min(0, 'Placing should be equal to or greater than zero')
            .integer('field must be an integer')
            .required("Required"),
        placing: Yup.number()
            .typeError("That doesn't look like a number")
            .min(0, 'Placing should be equal to or greater than zero')
            .integer('field must be an integer')
            .notRequired(),
    });


    const onSubmit = async (values:heuristicValues) => {
        //console.log(values)
        try {
            if (activeVoting) {
                let response;
                let newHeuristicData: any = {
                    sum: +values.sum,
                };
                if (values.placing !== null) {
                    newHeuristicData.placing = values.placing;
                }
                const newObjectData = {
                    newHeuristicData,
                    votingId: activeVoting
                }
                if (editingObject) {

                    response = await axios.put(`/api/heuristics?heuristicId=${editingObject._id}`, newObjectData);
                  } else {
                    let objectData: any = {
                        sum: +values.sum,
                        votingId: activeVoting
                    }
                    if (values.placing !== null) {
                        objectData.placing = +values.placing;
                    }
                    response = await axios.post('/api/heuristics', objectData);
                  }
    
                  if (editingObject) {
                    dispatch(editHeuristic({ object: response.data.object, objectId: editingObject._id, votingId: activeVoting }));
                  } else {
                    dispatch(addHeuristic({ object: response.data.object, votingId: activeVoting }));
                  }
                dispatch(clearEditingObject());
                dispatch(toggleAddHeuristicModal())
            }
        } catch(err: any) {
            console.error('error', err.message)
        }
    }

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}>
                {({ errors, touched }) => (
                    <Form className='px-4 py-3 space-y-5'>
                        <div>
                            <label
                             htmlFor='sum'
                             >Enter a number of votes item should receive:</label>
                            <Field
                                className="w-full bg-background rounded-md border border-neutral-tertiary cursor-pointer text-sm mt-2 py-3 px-2 tracking-[0.075em] font-light"
                                type="text"
                                id="sum"
                                name="sum" />
                            {errors.sum && touched.sum && (
                                <p className=" text-status-rejected mt-1">{errors.sum}</p>
                            )}
                        </div>

                        <div>
                            <label
                            htmlFor="placing"
                            >Enter a placement an item should be at:</label>
                            <Field
                                className="w-full bg-background rounded-md border border-neutral-tertiary cursor-pointer text-sm mt-2 py-3 px-2 tracking-[0.075em] font-light"
                                type="text"
                                id="placing"
                                name="placing" />
                            {errors.placing && touched.placing && (
                                <p className=" text-status-rejected mt-1">{errors.placing}</p>
                            )}
                        </div>
                        <Button
                            className='w-full bg-main-primary rounded py-3'
                        >
                            <p>{editingObject? 'Save Changes': 'Add Heuristic'}</p>
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default AddHeuristicForm