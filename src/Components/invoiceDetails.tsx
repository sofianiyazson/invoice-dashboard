import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Context } from '../Store/context';
import { Link } from 'react-router-dom';

function InvoiceDetails() {
  let [elem, setElem] = useState<any>({});
  let [totalTime, setTotalTime] = useState<any>('');

  useEffect(() => {
    getInvoiceData();
  }, []);

  const getInvoiceData = () => {
    let id = window.location.href.split('id=').pop();
    axios
      .get(`http://localhost:3000/invoices/${id}`)
      .then((res) => {
        setElem(res.data);
        console.log(res.data);
        let k = 0;
        res.data.tasks.forEach((elem: any) => {
          let myVar = moment.duration(elem.time).asSeconds(); //mm:ss to seconds
          k += myVar;
        });
        let p = moment.utc(k * 1000).format('HH:mm:ss');
        setTotalTime(p);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="row">
      <h1>Invoice</h1>
      <div className="col-12 px-5" style={{ textAlign: 'right' }}>
        <h2>Invoice</h2>
        <p>
          <b>{moment().format('YYYY-MM-DD')}</b>
        </p>
      </div>
      <div className="col-12 px-5" style={{ textAlign: 'left' }}>
        <p>
          Customer Name: <b>{elem.customerName}</b>
        </p>
        <p>
          Status: <b>{elem.status}</b>
        </p>
        <p>
          Issue Date: <b>{elem.createdDate}</b>
        </p>
        <p>
          Due/Expiry Date: <b>{elem.dueDate}</b>
        </p>
        <p>
          Invoice Id: <b>{elem.id}</b>
        </p>
        <p>
          Project Name: <b>{elem.project && elem.project.projectName}</b>
        </p>
        <p>
          Project Creation Date: <b>{elem.project && elem.project.date}</b>
        </p>
      </div>

      <div className="row">
        <div className="col m-4 table-responsive">
          <table className="table table-hover table-bordered table-striped">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Hourly Rate</th>
                <th>Time Logged</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {elem.tasks &&
                elem.tasks.length > 0 &&
                elem.tasks.map((e: any, idx: any) => {
                  return (
                    <tr key={idx}>
                      <td>{e.taskName}</td>
                      <td>${e.invoice}</td>
                      <td>{e.time}</td>
                      <td>${e.amount}</td>
                    </tr>
                  );
                })}
              <tr>
                <td colSpan={2}>
                  <b>Total</b>
                </td>
                <td>
                  <b>{totalTime}</b>
                </td>
                <td>
                  <b>${elem.amount}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h5>Invoice</h5>
      </div>
      <div className="col-12">
        <Link
          to="/invoice"
          className="btn btn-sm btn-dark m-3"
          style={{ float: 'left' }}
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}

export default InvoiceDetails;
