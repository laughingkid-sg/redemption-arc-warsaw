import { IoSearchOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";

const HomeSearchBar = () => {
    return (
      <div className="flex items-center justify-between bg-white p-4 rounded-md shadow mt-3 w-1/2 z-10 h-10">
        <div className="flex flex-row items-center space-x-4 w-full pr-10">
            <IoSearchOutline className="mr-1"/> 
            <input type="text" placeholder="Search Events, Categories, Location, ..." className="w-full outline-none"/>
        </div>
        <div className="flex flex-row items-center">
            <IoLocationOutline className="mr-1"/>
            <select name="location" id="location" className="outline-none">
                <option>Singapore</option>
                <option>South Korea</option>
                <option>Japan</option>
                <option>Thailand</option>
            </select>
        </div>
      </div>
    );
  };

export default HomeSearchBar;