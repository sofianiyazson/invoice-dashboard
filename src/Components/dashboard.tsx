import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Navbar from "./navbar";

function Dashboard() {
  let [tasksLength, setTasksLength] = useState(0);
  let [projectsLength, setProjectsLength] = useState(0);
  let [invoicesLength, setInvoicesLength] = useState(0);

  let [totalInvoice, setTotalInvoice] = useState<any>(0);
  let [paid, setPaid] = useState<any>(0);
  let [paidLength, setPaidLength] = useState<any>(0);
  let [unpaid, setUnpaid] = useState<any>(0);
  let [unpaidLenth, setUnpaidLength] = useState<any>(0);
  let [timeLogged, setTimeLogged] = useState<any>(0);
  let [invoicePerYear, setInvoicePerYear] = useState<any>(0);

  let [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("http://localhost:3000/tasks")
      .then((res) => {
        setTasksLength(res.data.length);
        let timeInSecs = 0;
        res.data.forEach((elem: any) => {
            var dateofvisit = moment(`{${elem.date}}`, 'YYYY-MM-DD');
            var today = moment();
            let diff = today.diff(dateofvisit, 'days');
            if(diff <= 30) {
                timeInSecs += moment.duration(elem.time).asSeconds();
                filteredTasks.push(elem);
            }
        });
        setTimeLogged(moment.utc(timeInSecs * 1000).format("HH:mm:ss"));
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/projects")
      .then((res) => {
        setProjectsLength(res.data.length);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/invoices")
      .then((res) => {
        setInvoicesLength(res.data.length);

        let t1 = 0;
        let t2 = 0;
        let t3 = 0;
        let t4 = 0;

        res.data.forEach((elem: any) => {
            t1 += parseInt(elem.amount);
            var dateofvisit = moment(`{${elem.createdDate}}`, 'YYYY-MM-DD');
            var today = moment();
            let diff = today.diff(dateofvisit, 'years');
            console.log(diff)
            if(diff <= 0) {
                t4 += parseInt(elem.amount);
            }
        });
        setTotalInvoice(t1.toFixed(2));
        setInvoicePerYear(t4.toFixed(2));

        let paid = res.data.filter((elem: any) => elem.status === "PAID");
        setPaidLength(paid.length);
        paid.forEach((elem: any) => {
          t2 += parseInt(elem.amount);
        });
        setPaid(t2.toFixed(2));

        let unpaid = res.data.filter((elem: any) => elem.status === "NOT PAID");
        setUnpaidLength(unpaid.length);
        unpaid.forEach((elem: any) => {
          t3 += parseInt(elem.amount);
        });
        setUnpaid(t3.toFixed(2));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h1>Dashboard</h1>
      <div className="row px-5">
        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 my-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Number of Tasks</h5>
              <p className="card-text">Here is the total number of tasks that has been done so far.</p>
              <a href="#" className="btn btn-primary">{tasksLength}</a>
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 my-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Number of Projects</h5>
              <p className="card-text">Here is the total number of projects that has been done so far.</p>
              <a href="#" className="btn btn-primary">{projectsLength}</a>
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 my-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Number of Invoices</h5>
              <p className="card-text">Here is detail of all invoices.</p>
              <p className="card-text">Paid: <b>{paidLength}</b> &nbsp; || &nbsp; Unpaid: <b>{unpaidLenth}</b></p>
              <div className="btn btn-primary">{invoicesLength}</div>
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 my-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Revenue Generated</h5>
              <p className="card-text">Here is detail of revenue generated.</p>
              <p className="card-text">Paid: <b>${paid}</b> &nbsp; || &nbsp; Unpaid: <b>${unpaid}</b></p>
              <div className="btn btn-primary">${totalInvoice}</div>
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 my-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Time logged Last Month</h5>
              <p className="card-text">Here is total time ran in last 30 days.</p>
              <div className="btn btn-primary">{timeLogged}</div>
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 my-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Invoice Last Year</h5>
              <p className="card-text">The number of dollar invoiced in the last year.</p>
              <div className="btn btn-primary">${invoicePerYear}</div>
            </div>
          </div>
        </div>
        
      </div>
      
      <h2 style={{float: 'left', margin: '3% 0 1% 5%'}}>List of timings for the last 30 days</h2>
      {filteredTasks.map((elem:any, idx:any) => {
            return <div className='row task' key={idx}>
                <div className='col-12 m-0 p-0'>
                    <span className='bgColor' style={{ backgroundColor: `${elem.color}` }}></span>
                    <h2>{elem.taskName}</h2>
                    <p>
                        <span>Time: <b id={`time${elem.id}`}>{elem.time}</b></span>
                        <span className='b'>Price: <b>${elem.invoice}</b></span>
                    </p>
                </div>
            </div>
        })}

      <div className='row' style={{marginBottom: 70}}></div>
      <Navbar />
    </>
  );
}

export default Dashboard;
