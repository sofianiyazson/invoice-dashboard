import React, { Component, createContext, useEffect, useState } from 'react';
import axios from 'axios';
export const Context = React.createContext<any>(null);

function ThemeContextProvider(props:any) {
    let [data, setData] = useState<any[]>([]);

    useEffect(() => {
        axios.get('http://localhost:3000/tasks')
            .then(res => {
                setData(res.data);
            })
            .catch(err => console.log(err));
    }, [])

    return (
        <Context.Provider value={{ data }}>
            {props.children}
        </Context.Provider>
    )
}

export default ThemeContextProvider;
