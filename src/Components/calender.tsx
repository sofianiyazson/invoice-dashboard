import { useEffect, useState } from "react";
import axios from 'axios';
import { Context } from '../Store/context';
import React, { useContext } from 'react';
import Navbar from "./navbar";

function Calender() {
    let [month, setMonth] = useState<any[]>([]);
    let [bol, setBol] = useState(false);
    let [tasks, setTasks] = useState<any[]>([]);
    let [date, setDate] = useState('');

    let contextData = useContext(Context);

    useEffect(() => {
        setTasks(contextData.data);

        let arr = [];
        let d:any = new Date().getDate();
        let m:any = new Date().getMonth() + 1;
        let y:any = new Date().getFullYear();
        if (d < 10) d = "0" + d;
        if (m < 10) m = "0" + m;

        for (let i = d; i >= 1; i--) {
            if (i < 10) i = "0" + i;
            let date = `${y}-${m}-${i}`;
            arr.push(date);
        }
        setMonth(arr);
        setBol(true);
    }, [contextData.data.length])

    useEffect(() => {
        if (date === "0") {
            setTasks(tasks);
            return;
        }
        let currTasks = contextData.data.filter((elem:any) => elem.date == date);
        setTasks(currTasks);
    }, [date])

    return (
        <>
            <div className='row'>
                <div className='col'>
                    <h1>Calender</h1>
                    <select className="form form-control" value={date} onChange={e => setDate(e.target.value)}>
                        <option value="0">Select Date</option>
                        {bol && month.map((elem, idx) => {
                            return <option value={elem} key={idx}>{elem}</option>
                        })}
                    </select>
                </div>
            </div>

            {tasks.map((elem:any, idx) => {
                return <div className='row task p-0' key={idx}>
                    <div className='col-6 m-0 p-0'>
                            <span className='bgColor' style={{ backgroundColor: `${elem.color}` }}></span>
                            <h2>{elem.taskName}</h2>
                            <p>Time: <b>{elem.time}</b> Price: <b>${elem.invoice}</b></p>
                        </div>
                </div>
            })}
            <Navbar />
        </>
    )
}

export default Calender;