import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './table.css';
import env from "../../config/enviLoad";

import DeleteConfirmationAlert from "../alerts/AlertDeletionItemConfirm";


const sortByStartTime = (data) => {
    return data.slice().sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
};

const truncateString = (str, num) => {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
};

const ItemsTable = ({ rows, updateData }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});
    const [isDuplicate, setIsDuplicate] = useState(false);

    const handleUpdateClick = (row, duplicate = false) => {
        setSelectedRow(row);
        setSelectedId(row.id);
        setIsDuplicate(duplicate);
        setShowUpdateWidget(true);
    };

    const handleDeleteClick = async (id) => {
        const result = await DeleteConfirmationAlert();
        if (result.isConfirmed) {
            await handleDelete(id, updateData);
        }
    };

    const sortedRows = sortByStartTime(rows);

    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Type and Channel</th>
                    <th>Item info</th>
                    <th>Description</th>
                    <th className="action-column">Update</th>
                    <th className="action-column">Delete</th>
                </tr>
                </thead>
                <tbody>
                {sortedRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>{row.id}</td>
                        <td>
                            <img src={`${env.REACT_APP_S3_URL}/.../${row.images}`}
                                 className="thumbnail-image"
                                 title={row.images}
                            />
                        </td>
                        <td>
                            <div>Type: {row.type}</div>
                        </td>
                        <td className="show-info-cell">
                            <div>Title: {row.title}</div>
                            <div>
                                Image: {expandedRows[row.id]?.images || row.images.length <= 20 ? row.images : truncateString(row.images, 20)}
                                {row.images.length > 20 && (
                                    <button className="expand-button" onClick={() => toggleExpand(row.id, 'images')}>
                                        {expandedRows[row.id]?.images ? 'Show Less' : 'Show More'}
                                    </button>
                                )}
                            </div>
                        </td>
                        <td className="show-time-cell">
                            <div className="nowrap">Start Time: {row.startTimeDisplay}</div>
                            <div className="nowrap">End Time: {row.endTimeDisplay}</div>
                        </td>
                        <td className="description-cell">
                            {expandedRows[row.id]?.description || row.description.length <= 150 ? row.description : `${row.description.substring(0, 150)}...`}
                            {row.description.length > 150 && (
                                <button className="expand-button" onClick={() => toggleExpand(row.id, 'description')}>
                                    {expandedRows[row.id]?.description ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                        </td>
                        <td>{row.name}</td>
                        <td style={{textAlign: 'center'}}>
                            <UpdateButton onClick={() => handleUpdateClick(row, false)} />
                        </td>
                        <td style={{textAlign: 'center'}}>
                            <DeleteButton onClick={() => handleDeleteClick(row.id)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemsTable;
