import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import SAS7BDAT from 'sas7bdat';

const SasData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Load the local sas7bdat file
        fetch('data/gold.sas7bdat')
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const reader = new SAS7BDAT(buffer);
                const rows = reader.read();
                setData(rows);
                reader.close();
            })
            .catch(error => console.error("Error reading the file:", error));
    }, []);

    if (!data.length) return <p>Loading...</p>;

    const headers = Object.keys(data[0]);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {headers.map(header => <th key={header}>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {headers.map(header => <td key={header}>{row[header]}</td>)}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default SasData;
