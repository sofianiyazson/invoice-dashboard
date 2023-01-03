import React, { Component, createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Projects from '../Components/projects';
export const Context = React.createContext<any>(null);

function ThemeContextProvider(props:any) {
    let [tasks, setTasks] = useState<any[]>([]);
    let [projects, setProjects] = useState<any[]>([]);
    let [invoices, setInvoices] = useState<any>([]);

    const getTasks = () => {
        axios.get('http://localhost:3000/tasks')
            .then(res => {
                setTasks(res.data);
            })
            .catch(err => console.log(err));
    }

    const getProjects = () => {
        axios.get('http://localhost:3000/projects')
            .then(res => {
                setProjects(res.data);
            })
            .catch(err => console.log(err));
    }

    const getInvoices = () => {
        axios.get('http://localhost:3000/invoices')
            .then(res => {
                setInvoices(res.data);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getTasks();
        getProjects();
        getInvoices();
    },[])
    
    return (
        <Context.Provider value={{ tasks, projects, invoices, getTasks, getProjects, getInvoices}}>
            {props.children}
        </Context.Provider>
    )
}

export default ThemeContextProvider;
