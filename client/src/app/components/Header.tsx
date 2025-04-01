"use client"

const Header = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    // console.log(`${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`); 

    return (
        <header className="flex justify-between items-center p-5 m-5 mb-0 rounded-xl  bg-gray-800 text-white">
            <h1>Hello, Name</h1>
            <div>
            <p>{`${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`}</p>
            <button className="btn">Logout</button>
            </div>
        </header>
    )
}
export default Header;