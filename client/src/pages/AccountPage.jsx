import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AccountPage() {
    const {user, ready, setUser} = useContext(UserContext);
    const[redirect, setRedirect] = useState(null);
    let {subpage} = useParams();
    if(subpage === undefined){
        subpage = 'profile';
    }

    async function logout(){
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }

    if(!ready) {
     return 'Loading...';   
    }

    if(ready && !user && !redirect){
        return <Navigate to = {'/login'} />;
    }
    
    function linkClasses(type=null){
        let classes = 'px-6 py-2';
        if (type === subpage || (subpage === undefined && type === 'profile')){
            classes += ' bg-primary text-white rounded-full';
        }
        return classes;
    }

    if(redirect){
        return <Navigate to = {redirect} />;
    }

    return (
        <div>
            <nav className="flex justify-center w-full gap-2 mt-8">
                <Link className={linkClasses('profile')} to={'/account'}>My profile</Link>
                <Link className={linkClasses('bookings')} to={'/account/bookings'}>My bookings</Link>
                <Link className={linkClasses('places')} to={'/account/places'}>My accomodations</Link>
            </nav>
            {subpage === 'profile' && (
                <div className="max-w-lg mx-auto text-center">
                    Logged in as {user.name} ({user.email}) <br />
                    <button onClick={logout} className="max-w-sm mt-2 primary">Logout</button>   
                </div>

            )}
        </div>
    );
};