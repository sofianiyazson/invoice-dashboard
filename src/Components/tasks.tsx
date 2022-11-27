import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';
import $ from 'jquery';
import { Context } from '../Store/context';
import React, { useContext } from 'react';
import Navbar from './navbar';

function Tasks() {
    let [taskName, setTaskName] = useState('');
    let [projectName, setProjectName] = useState('');
    let [color, setColor] = useState('#000000');
    let [invoice, setInvoice] = useState<any>('10');
    let [tasks, setTasks] = useState([]);
    let [toEditId, setToEditId] = useState('');

    let contextData = useContext(Context);

    useEffect(() => {
        setTasks(contextData.data);
    }, [contextData.data.length])

    const getData = () => {
        axios.get('http://localhost:3000/tasks')
            .then(res => {
                setTasks(res.data);
            })
            .catch(err => console.log(err))
    }

    const saveTask = () => {
        if (taskName === "" || taskName === undefined || projectName === "" || projectName === undefined || invoice === "" || invoice === undefined) {
            alert('Please fill all the data and selecta color');
            return;
        }
        let id = Date.now();
        let time = "00:00:00";

        let y:any = new Date().getFullYear();
        let m:any = new Date().getMonth() + 1;
        let d:any = new Date().getDate();
        if (m < 10) m = "0" + m;
        if (d < 10) d = "0" + d;
        if (invoice < 10) invoice = "0" + invoice;
        let date = `${y}-${m}-${d}`;

        let obj = { id, taskName, invoice, projectName, color, time, date };

        if (toEditId === '') {
            axios.post('http://localhost:3000/tasks', obj)
                .then(res => window.location.reload())
                .catch(err => console.log(err))
        } else {
            axios.put(`http://localhost:3000/tasks/${toEditId}`, obj)
                .then(res => window.location.reload())
                .catch(err => console.log(err))
        }
    }

    const editRec = (id:any) => {
        let elem:any = tasks.find((elem:any) => elem.id === id);
        setTaskName(elem.taskName);
        setInvoice(elem.invoice);
        setProjectName(elem.projectName);
        setColor(elem.color);
        setToEditId(elem.id);
    }

    const delRec = (id:any) => {
        axios.delete(`http://localhost:3000/tasks/${id}`)
            .then(res => {
                getData();
            })
            .catch(err => console.log(err))
        showOptions(0);
    }

    const showOptions = (id:any) => {
        tasks.forEach((elem:any) => {
            if (elem.id === id) $(`#options${id}`).toggle(100);
            else $(`#options${elem.id}`).hide(100);
        });
    }

    return (
        <>
            <div className='row' style={{ backgroundColor: '#ddd'}}>
                <h1>Overview</h1>
                <nav className="navbar fixed navbar-dark overviewNavbar">
                    <div className='col-6'>
                        <Link to="/overview/projects" id='projectLink' className="navbar-brand mx-auto"><h4>Projects</h4></Link>
                    </div>
                    <div className='col-6 activeA'>
                        <Link to="/overview/tasks" id='taskLink' className="navbar-brand mx-auto"><h4>Tasks</h4></Link>
                    </div>
                </nav>
            </div>
            
            {tasks.map((elem:any, idx) => {
                return <div className='row task p-0' key={idx}>
                    <div className='col-6 m-0 p-0'>
                        <span className='bgColor' style={{ backgroundColor: `${elem.color}` }}></span>
                        <h2>{elem.taskName}</h2>
                        <p>
                            <span>Price: <b>${elem.invoice}</b></span>
                            <span className='b'>Date: <b>{elem.date}</b></span>
                        </p>
                    </div>
                    <div className='col-6'>
                        <span className='threeDots mt-3' onClick={() => showOptions(elem.id)}><i className="fa fa-ellipsis-v" aria-hidden="true"></i></span>
                        <span className='options' id={`options${elem.id}`}>
                            <button className='btn btn-light btn-sm' onClick={() => editRec(elem.id)} data-toggle="modal" data-target="#exampleModal"><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp; Edit</button><br />
                            <button className='btn btn-light btn-sm del' onClick={() => delRec(elem.id)}><i className="fa fa-trash" aria-hidden="true"></i>&nbsp; Delete</button>
                        </span>
                    </div>
                </div>
            })}

            <div className='row' style={{marginBottom: 50}}>
                <div className='col'>
                    <button type="button" className="btn btn-success btn-block" data-toggle="modal" data-target="#exampleModal">Add New Task</button>
                </div>
            </div>


            <div className="modal fade mt-5" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add New Task</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input type="text" className='form-control' value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="Enter Task Name" />
                            <input type="number" className='form-control' value={invoice} onChange={e => setInvoice(e.target.value)} placeholder="Enter Task Price" />
                            <input type="text" className='form-control' value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Enter Project Name" />
                            <input type="color" className='form-control w-50' value={color} onChange={e => setColor(e.target.value)} style={{ float: 'left', width: '20%' }} />
                            <h4 style={{ float: 'left' }}>{color}</h4>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={saveTask}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <Navbar />
        </>
    )
}

export default Tasks;