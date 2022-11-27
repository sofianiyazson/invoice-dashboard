import { useEffect, useState } from "react";
import axios from 'axios';
import moment from 'moment';
import * as bootstrap from "bootstrap";
import {useNavigate} from 'react-router-dom';
import Navbar from "./navbar";

function Timer() {
    let [intrvl, setIntrvl] = useState('');
    let [sec, setSec] = useState(0);
    let [time, setTime] = useState('00:00:00');
    let [int, setInt] = useState<any>(0);
    let [name, setName] = useState<any>("Ansar");
    let [error, setError] = useState<any>("");
    let [taskObj, setTaskObj] = useState<any>({});

    let [totalTime, setTotalTime] = useState("00:00:00");
    let [todaysTotalTime, setTodaysTotalTime] = useState("00:00:00");
    let [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => { getData() }, [])

    const getData = () => {
        axios.get('http://localhost:3000/tasks')
            .then(res => {
                setTasks(res.data);
                calTodaysTotalTime(res.data);
                setTotalTime(calTotalTime(res.data));
            })
            .catch(err => console.log(err))
    }

    const calTodaysTotalTime = (arr:any) => {
        let today = getTodayDate();
        let filtered = arr.filter((elem:any) => elem.date === today);
        setTodaysTotalTime(calTotalTime(filtered));
    }

    const calTotalTime = (arr:any) => {
        let total = calMilliseconds(arr);

        let seconds:any = Math.floor(total / 1000);
        let minutes:any = Math.floor(seconds / 60);
        let hours:any = Math.floor(minutes / 60);

        seconds = seconds % 60;
        minutes = minutes % 60;

        hours = hours % 24;
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;

        return `${hours}:${minutes}:${seconds}`;
    }

    const getTodayDate = () => {
        let today:any = new Date();
        let dd:any = today.getDate();
        let mm:any = today.getMonth() + 1;
        let yyyy:any = today.getFullYear();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }

    const calMilliseconds = (arr:any) => {
        let total = 0;
        arr.forEach((elem:any) => {
            let timeArr = elem.time.split(':');
            let timeInMilliseconds = (timeArr[0] * 3600000) + (timeArr[1] * 60000) + (timeArr[2] * 1000);
            total += timeInMilliseconds;
        });
        return total;
    }

    const startTimer = (id:any) => {
        if(tasks.length > 0) {
            tasks.forEach((elem:any) => {
                document.getElementById(`pauseBtn${elem.id}`)!.style.display = "none";
                document.getElementById(`startBtn${elem.id}`)!.style.display = "block";
                clearInterval(intrvl);
            });

            document.getElementById(`startBtn${id}`)!.style.display = "none";
            document.getElementById(`pauseBtn${id}`)!.style.display = "block";

            let obj:any = tasks.find((elem:any) => elem.id === id);

            setTime(obj.time);
            let hrs:any = Math.floor(obj.time.split(':')[0]);
            let mnts:any = Math.floor(obj.time.split(':')[1]);
            let scnds:any = Math.floor(obj.time.split(':')[2]);
            hrs = hrs * 60 * 60;
            mnts = mnts * 60;
            let p = Math.floor(hrs + mnts + scnds);
            setSec(p);
            int = setInterval(() => {
                setSec(p++);
                myTime(obj, p);
            }, 1000);
            setIntrvl(int);
        }
    }

    const myTime = (obj:any, p:any) => {
        let hours:any = Math.floor(p / 3600);
        let rem = p - (hours * 3600);
        let minutes:any = Math.floor(rem / 60);
        let seconds:any = rem - (minutes * 60);


        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;

        time = `${hours}:${minutes}:${seconds}`;
        setTime(time);
        document.getElementById(`time${obj.id}`)!.innerHTML = time;

        axios.put(`http://localhost:3000/tasks/${obj.id}`, {
            id: obj.id,
            projectName: obj.projectName,
            invoice: obj.invoice,
            taskName: obj.taskName,
            color: obj.color,
            date: obj.date,
            time: time
        })
        getData();
    }

    const pause = (id:any) => {
        document.getElementById(`pauseBtn${id}`)!.style.display = "none";
        document.getElementById(`startBtn${id}`)!.style.display = "block";
        clearInterval(intrvl);
        getData();
    }

    const createInvoice = () => {
        if(name === "") {
            setError('Please enter your name first.');
            return;
        }
        let date = new Date().toISOString().split('T')[0];
        var currentDate = moment(date);
        var futureMonth = moment(currentDate).add(1, 'M');
        var futureMonthEnd = moment(futureMonth).endOf('month');

        if(currentDate.date() != futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
            futureMonth = futureMonth.add(1, 'd');
        }

        let createdDate = currentDate.format('DD-MM-YYYY');
        let dueDate = futureMonth.format('DD-MM-YYYY');

        let taskTimeInHours = moment.duration(taskObj.time).asSeconds();
        taskTimeInHours = taskTimeInHours / 3600;
        let amount = taskTimeInHours * parseInt(taskObj.invoice);
        let obj = {status: 'NOT PAID', createdDate, dueDate, amount: amount.toFixed(2), customerName: name, taskId: taskObj._id, taskCreationDate: taskObj.date, invoice: taskObj.invoice, taskName: taskObj.taskName, time: taskObj.time};

        axios.delete(`http://localhost:3000/tasks/${taskObj.id}`)
        .then(res => getData())
        .catch(err => console.log(err))

        setError('');
        setTaskObj('');
        
        axios.post('http://localhost:3000/invoices', obj)
        .then(res => {
            document.getElementById('close')?.click();
            navigate(`/invoiceDetails?id=${res.data.id}`);
        })
        .catch(err => console.log(err))
    }

    return (
        <>
            <div className='row header'>
                <div className='col'>
                    <h1 className='m-0 p-4'>Timer</h1>
                    <h1 className='m-0 p-4'>{time}</h1>
                    <nav className="navbar fixed navbar-dark overviewNavbar">
                        <a className="navbar-brand mx-auto"><h4>Total: <br /> {totalTime}</h4></a>
                        <a className="navbar-brand mx-auto"><h4>Today: <br /> {todaysTotalTime}</h4></a>
                    </nav>
                </div>
            </div>

            {tasks.map((elem:any, idx) => {
                return <div className='row task p-0' key={idx}>
                    <div className='col-6 m-0 p-0'>
                        <span className='bgColor' style={{ backgroundColor: `${elem.color}` }}></span>
                        <h2>{elem.taskName}</h2>
                        <p>
                            <span>Time: <b id={`time${elem.id}`}>{elem.time}</b></span>
                            <span className='b'>Price: <b>${elem.invoice}</b></span>
                        </p>
                    </div>
                    <div className='col-6'>
                        <button className="btn btn-success btn-sm mt-4 invoice" data-toggle="modal" data-target="#modal" onClick={() => setTaskObj(elem)}>Invoice</button>
                        <span className="handleTimer mt-4" id={`startBtn${elem.id}`}><i className="fa fa-play" aria-hidden="true" onClick={() => startTimer(elem.id)}></i></span>
                        <span className="handleTimer mt-4" id={`pauseBtn${elem.id}`} style={{ display: 'none', color: 'red' }}><i className="fa fa-stop-circle" aria-hidden="true" onClick={() => pause(elem.id)}></i></span>
                    </div>
                </div>
            })}

            <div className="modal fade" id="modal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Create Invoice</h5>
                            <button type="button" id="close" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    <div className="modal-body">
                        <p>Please enter your name below and click the button to create an invoice.</p>
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="modal-footer">
                        <p style={{color: 'red'}}>{error}</p>
                        <button type="button" className="btn btn-success" onClick={createInvoice}>Create Invoice</button>
                    </div>
                    </div>
                </div>
            </div>
            <Navbar />
        </>
    )
}

export default Timer;