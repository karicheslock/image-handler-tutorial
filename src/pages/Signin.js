import { auth, provider } from '../firebase-config';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Signin() {
    let navigate = useNavigate();

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            localStorage.setItem("isAuth", true);
            navigate("/");
        });
    };

    return (
        <div className="container flex flex-col mx-auto max-w-screen-md items-center h-screen justify-center">
            <p className='text-3xl py-5 text-light-teal font-bold'>Sign in with Google to Continue</p>
            <button className="login-with-google-btn" onClick={ signInWithGoogle }>
                Sign in with Google
            </button>
        </div>
    )
}

export default Signin;