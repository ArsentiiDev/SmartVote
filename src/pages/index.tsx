import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Main from '@/components/Main';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setVotings } from '@/store/dataSlice';
import { switchActiveVote } from '@/store/uiSlice';
import { IVoting } from '@/Types/Interfaces';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import EmptyBoard from '@/components/EmptyBoard';
import { RootState } from '@/store/store';

interface HomeProps {
  data: { objects: IVoting[] };
  success: boolean;
}

interface ServerSideProps {
  success: boolean;
  data: { objects: IVoting[] } | null;
}

const Home: React.FC<HomeProps> = ({ data, success }) => {
  const { data: session, status } = useSession();
  const votings = useSelector((state: RootState) => state.data.votings)
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      dispatch(setVotings(data.objects));
      dispatch(
        switchActiveVote(data.objects.length > 0 ? data.objects[0]._id : null)
      );
    }
  }, [dispatch, data, success]);

  if (status === 'authenticated') {
    return (
      <Layout>
        {votings.length
        ? <Main/> : <EmptyBoard />}
      </Layout>
    );
  }
  return (
    <section className="grid h-screen place-items-center">
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome To Voting app
        </h2>
        <br />
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          You currently not authenticated. Click the login button to get
          started!
        </p>
        <button
          type="button"
          onClick={() => signIn()}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Sign In
        </button>
      </div>
    </section>
  );
};
export default Home;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const testSession = await getSession({ req: context.req });
  const session = await getSession(context);
  console.log('getServerSide', session);
  console.log('testSession', testSession);
  try {
    if (session?.user && session.user.email) {
      const response = await axios
        .get(`${process.env.BASE_URL}/api/voting?userEmail=${session.user.email}`)
        .then((res) => res.data);
      return {
        props: {
          success: true,
          data: response,
        },
      };
    } else {
      return {
        props: {
          success: false,
          data: null,
        },
      };
    }
  } catch (err) {
    //console.log('eror',err)
    return {
      props: {
        success: false,
        data: null,
      },
    };
  }
};
