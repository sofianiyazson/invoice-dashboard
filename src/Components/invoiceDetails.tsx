import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import moment from 'moment';

function InvoiceDetails() {
  let [elem, setElem] = useState<any>({});

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let id = window.location.href.split('id=').pop();
    axios
      .get(`http://localhost:3000/invoices/${id}`)
      .then((res) => {
        console.log(res.data);
        setElem(res.data);
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
          Issue Date: <b>{elem.createdDate}</b>
        </p>
        <p>
          Due/Expiry Date: <b>{elem.dueDate}</b>
        </p>
        <p>
          Task Creation Date: <b>{elem.taskCreationDate}</b>
        </p>
        <p>
          Status: <b>{elem.status}</b>
        </p>
        <p>
          Invoice Id: <b>{elem.id}</b>
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
              <tr>
                <td>{elem.taskName}</td>
                <td>${elem.invoice}</td>
                <td>{elem.time}</td>
                <td>${parseFloat(elem.amount).toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <b>Total</b>
                </td>
                <td>
                  <b>${parseFloat(elem.amount).toFixed(2)}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h5> </h5>
      </div>
    </div>
  );
}

export default InvoiceDetails;
