import React, { useState, useEffect } from 'react';
import './components/css/main.css';

import { filterData } from "./helper";
import itemModel from "./models/itemModel";

import Search from "./components/search";
import Logo from "./components/logo";
import ItemsTable from './components/table';

function App() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showWidget, setShowWidget] = useState(false);

    const fetchData = async () => {
        try {
            const userData = await fetchUserData();
            const queryParams = {
                email: userData.email,
                roles: JSON.stringify(userData.roles),
                name: userData.name
            };
            const data = await getItems(queryParams);
            setData(data);
            setFilteredData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (query) => {
        const filtered = filterData(data, query);
        setFilteredData(filtered);
    };

    const handleShowWidget = () => {
        setShowWidget(true);
    };

    const handleCloseWidget = () => {
        setShowWidget(false);
    };

    const formattedData = modifyDataToShow(filteredData);

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <Logo />
                </div>
                <div>
                    <div className="container-fluid">
                        <Search onSearch={handleSearch} fetchData={fetchData} handleShowWidget={handleShowWidget} showWidget={showWidget} handleCloseWidget={handleCloseWidget} />
                        <ItemsTable rows={formattedData} columns={Object.keys(itemModel)} updateData={fetchData} />
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
