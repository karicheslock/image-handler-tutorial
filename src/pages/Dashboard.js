import { useEffect, useState } from "react";
import {signOut} from 'firebase/auth';
import {auth} from '../firebase-config';
import {useNavigate, Link} from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';

function Dashboard() {
  const [userCollectionsArray, setUserCollectionsArray] = useState([]);

  let navigate = useNavigate();
  let isAuth = localStorage.getItem('isAuth');

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      isAuth = false;
      navigate('/');
    });
  };

  const myCollection = 'userCollections';

  useEffect(() => {
    const images = onSnapshot(collection(db, myCollection), (querySnapshot) => {
      const documents = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id
      }
      });
      setUserCollectionsArray(documents);
    });
    return () => images();
  }, [myCollection]);

  return (
    <div className="container flex flex-col">
        <div className="flex items-center w-screen h-24 justify-between px-10">
            {!isAuth && <div className='flex items-center justify-center h-screen w-screen'>
                <p className='text-blue-500 text-4xl'>Click <Link to='/sign-in' className='text-blue-900 font-bold hover:text-yellow-400'>here</Link> to sign in and begin adding image collections.</p>
                </div>}
            {isAuth && <Link to='/create-collection' className='border-2 rounded border-blue-400 px-4 py-2 bg-blue-400 text-blue-50 font-bold hover:bg-blue-900'>+ Add Collection</Link>}
            {isAuth && <button onClick={signUserOut} className='text-blue-400 flex flex-col items-center'>
                Logout
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='fill-blue-400 w-6'>
                <path d="M160 416H96c-17.67 0-32-14.33-32-32V128c0-17.67 14.33-32 32-32h64c17.67 0 32-14.33 32-32S177.7 32 160 32H96C42.98 32 0 74.98 0 128v256c0 53.02 42.98 96 96 96h64c17.67 0 32-14.33 32-32S177.7 416 160 416zM502.6 233.4l-128-128c-12.51-12.51-32.76-12.49-45.25 0c-12.5 12.5-12.5 32.75 0 45.25L402.8 224H192C174.3 224 160 238.3 160 256s14.31 32 32 32h210.8l-73.38 73.38c-12.5 12.5-12.5 32.75 0 45.25s32.75 12.5 45.25 0l128-128C515.1 266.1 515.1 245.9 502.6 233.4z"/>
                </svg>
            </button>}
        </div>
        <div>
            {isAuth && userCollectionsArray.map((userCollection) => {
                return (
                    <div className="border-2 border-blue-700 w-1/2 mx-auto py-10">
                        <div key={userCollection.id} className='flex flex-col items-center justify-center'>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-4xl mb-4"><span className="text-blue-500 font-bold px-4">Title: </span>{userCollection.title}</p>
                                <p className="text-2xl mb-4"><span className="text-blue-500 font-bold px-4">Description: </span>{userCollection.description}</p>
                            </div>
                            <div className="flex items-center justify-center border-2 border-blue-400 rounded py-4 mx-10">
                                {userCollection.imageArray.map((image) => {
                                    return (
                                        <div key={image} className="w-1/4 mx-4">
                                            <img src={image} alt="Collection item" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>  
    </div>
  )
}

export default Dashboard;