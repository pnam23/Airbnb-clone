import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";

export default function PlacesPage(){
    const {action} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);

    function inputHeader(text) {
        return (
            <h2 className="mt-4 text-2xl">{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className="text-sm text-gray-500">{text}</p>
        )
    }

    function preInput(header, description){
        return (
            <div>
                {inputHeader(header)}
                {inputDescription(description)}
            </div>
        )
    }

    async function addPhotoByLink(ev){
        ev.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link', {link: photoLink})
        setAddedPhotos(prev => {
            return [...prev, filename];
        });
        setPhotoLink('');
    };

    return (
        <div>
            {action != 'new' && (
                <div className="text-center">
                    <div className="">
                        <Link className="inline-flex gap-1 px-6 py-2 mt-6 text-white rounded-full bg-primary" to={'/account/places/new'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                            Add new place
                        </Link>
                    </div>
                    My place
                </div>
            )}
            {action === 'new' && (
                <div>
                    <form action="">
                        {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
                        <input value={title} 
                                onChange={ev => setTitle(ev.target.value)} 
                                type="text" 
                                placeholder="title, for example: My lovely apartment" />
                        {preInput('Address', 'Address to this place')}
                        <input value={address} 
                                onChange={ev => setAddress(ev.target.value)} 
                                type="text" 
                                placeholder="address" />
                        {preInput('Photos', 'More = better')}
                        <div className="flex gap-2">
                            <input value={photoLink} 
                                    onChange={ev => setPhotoLink(ev.target.value)} 
                                    type="text" 
                                    placeholder={'Add using a link ....jpg'}/>
                            <button className="px-4 bg-gray-200 rounded-2xl"
                                    onClick={addPhotoByLink}>
                                Add&nbsp;photo
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2 md:grid-cols-4 lg:grid-cols-6">
                            {addedPhotos.length > 0 && addedPhotos.map(link => (
                                <div>
                                    <img src={"http://localhost:4000/uploads/"+link} className="rounded-2xl" />
                                </div>
                            ))}
                            <button className="flex items-center justify-center gap-1 p-2 text-gray-600 bg-transparent border rounded-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                </svg>
                                Upload
                            </button>
                        </div>
                        {preInput('Description','Description of the place')}
                        <textarea value={description} 
                                onChange={ev => setDescription(ev.target.value)}/>
                        {preInput('Perks','Select all the perks of your place')}
                        <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3 lg:grid-cols-6">
                            <Perks selected={perks} onChange={setPerks}/>
                        </div>
                        {preInput('Extra','House rules, etc')}
                        <textarea value={extraInfo} 
                                onChange={ev => setExtraInfo(ev.target.value)}/>
                        {preInput('Check in & out times','Add check in and out times, remember to have some time for cleaning the rooms between guests')}
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-1 ">Check in time</h3>
                                <input value={checkIn} 
                                        onChange={ev => setCheckIn(ev.target.value)} 
                                        type="text" 
                                        placeholder="11:11"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1 ">Check out time</h3>
                                <input type="text" 
                                        value={checkOut} 
                                        onChange={ev => setCheckOut(ev.target.value)} 
                                        placeholder="12:34"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1 ">Max number of guests</h3>
                                <input type="number"  
                                        value={maxGuests} 
                                        onChange={ev => setMaxGuests(ev.target.value)}/>
                            </div>
                        </div>
                        <button className="my-4 primary">Save</button>
                    </form>
                </div>
            )}
        </div>
    )
}