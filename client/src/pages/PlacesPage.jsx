import { Link, useParams } from "react-router-dom";

export default function PlacesPage(){
    const {action} = useParams();
    
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
                        <h2 className="mt-4 text-2xl">Title</h2>
                        <p className="text-sm text-gray-500">Title for your place. should be short and catchy as in advertisement</p>
                        <input type="text" placeholder="title, for example: My lovely apartment" />
                        <h2 className="mt-4 text-2xl">Address</h2>
                        <p className="text-sm text-gray-500">Address to this place</p>
                        <input type="text" placeholder="address" />
                        <h2 className="mt-4 text-2xl">Photos</h2>
                        <p className="text-sm text-gray-500">More = better</p>
                        <div className="flex gap-2">
                            <input type="text" placeholder={'Add using a link ....jpg'}/>
                            <button className="px-4 bg-gray-200 rounded-2xl">
                                Add&nbsp;photo
                            </button>
                        </div>
                        <div className="grid grid-cols-3 mt-2 md:grid-cols-4 lg:grid-cols-6">
                            <button className="flex justify-center gap-1 p-8 text-gray-600 bg-transparent border rounded-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
</svg>

                                Upload
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}