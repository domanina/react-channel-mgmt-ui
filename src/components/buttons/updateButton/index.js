import React from 'react';
import { BsFillPenFill } from 'react-icons/bs';

const UpdateItemButton = ({ onClick }) => {
    return (
        <button className="btn btn-danger" onClick={onClick}>
            <BsFillPenFill />
        </button>
    );
};

export default UpdateItemButton;