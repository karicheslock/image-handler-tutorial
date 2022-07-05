import { useState, useEffect } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db, auth, storage } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';

function CreateCollection() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageArray, setImageArray] = useState([]);
    const [progress, setProgress] = useState(0);

    let navigate = useNavigate();

    const isAuth = localStorage.getItem('isAuth');

    const isInvalid = title === '' || description === '' || imageArray.length === 0;

    const createUserCollection = async (event) => {
        event.preventDefault();

        const userCollectionsRef = collection(db, 'userCollections');

        try {
            await addDoc(userCollectionsRef, {
                title,
                description,
                author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
                imageArray,
                created: Timestamp.now()
            });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }

    const handleImageChange = async (event) => {
        event.preventDefault();
        let file = event.target[0].files[0];
        uploadFiles(file);
    };

    const uploadFiles = (file) => {
        if (!file) return;

        const storageRef = ref(storage, `${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(prog);
        },
        (err) => console.log(err),
        () => {
             getDownloadURL(uploadTask.snapshot.ref)
                .then(url => {
                    setImageArray([
                        ...imageArray,
                        url
                    ]);
                })
        }
        );
    };

    useEffect(() => {
        if (!isAuth) {
            navigate("/sign-in");
        }
    }, [isAuth, navigate])

  return (
    <div className='container flex flex-col items-center justify-center h-screen'>
        <div className='flex flex-col justify-center'>
            <div className='flex flex-col border-4 border-blue-900 p-4 bg-gray-100 w-3/4 mx-auto'>
                <label className='mb-2 text-xl text-blue-900 font-bold'>Name your collection:</label>
                <input aria-label='Enter a title' placeholder='Name...' onChange={handleTitleChange} className='text-xl p-2 rounded' />
                <label className='mb-2 mt-2 text-xl text-blue-900 font-bold'>Describe your collection:</label>
                <textarea aria-label='Enter a description' placeholder="Description... (max 250 characters)" onChange={handleDescriptionChange} className='text-xl p-2 h-24 rounded' maxLength={250} />
                <div className='flex flex-col items-center justify-center mt-4'>
                    <form method="POST" onSubmit={handleImageChange}>
                        <div className='mb-4 leading-10'><label className='text-xl text-blue-900 font-bold'>1. Click the <span className='border-2 border-gray-500 text-black bg-gray-100 px-1'>Choose File</span> button to start adding images. 
                        <br />  2. Click <span className='border-2 rounded border-blue-400 px-4 py-1 bg-blue-500 text-blue-50 font-bold'>Upload</span> after each one. 
                        <br />  3. Click the <span className='border-2 rounded border-blue-800 px-4 py-1 bg-blue-900 text-blue-50 text-xl font-bold'>Create Collection</span> button when you have added all images.</label></div>
                        <div className='flex justify-between'>
                            <input type="file" id='input-btn' className='input text-blue-900 font-bold text-xl' aria-label='Select file' />
                            <div>
                                <button type='submit' className='border-2 rounded border-blue-400 px-4 py-1 bg-blue-500 text-blue-50 text-xl font-bold hover:bg-blue-900'>Upload</button>
                                <h3 className='mb-4 text-blue-900'>Uploaded {progress} %</h3>
                            </div>
                        </div>
                        {(imageArray.length > 0) && <div className='mb-4 leading-10 text-xl text-blue-900 font-bold'>4. Add another image with the <span className='border-2 border-gray-500 text-black bg-gray-100 px-1'>Choose File</span> button.</div>}
                    </form>
                </div>
                <div className='flex flex-wrap mb-4'>
                    {(imageArray.length > 0) && imageArray.map((image) => (
                        <img src={image} alt='Collection display' className='w-1/12 h-max mx-1 border-2 border-blue-900 rounded my-2' />
                    )) }
                </div>
                <button onClick={createUserCollection} className={`border-2 rounded border-blue-800 px-4 py-1 bg-blue-900 text-blue-50 text-xl font-bold hover:bg-blue-500 w-fit mx-auto ${isInvalid && 'cursor-not-allowed opacity-50'}`}>Create Collection</button>
                <button onClick={() => navigate('/')} className='text-red-500 font-bold mt-2 hover:text-red-700'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default CreateCollection;