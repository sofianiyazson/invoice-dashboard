import { useEffect, useState } from "react";
import axios from 'axios';
import Navbar from "./navbar";
import {useNavigate} from 'react-router-dom';

function Invoice() {
    let [totalAmount, setTotalAmount] = useState<any>("");
    let [totalPaid, setTotalPaid] = useState<any>("");
    let [invoices, setInvoices] = useState<any>([]);
    const navigate = useNavigate();

    useEffect(() => { getData() }, [])

    const getData = () => {
        axios.get('http://localhost:3000/invoices')
            .then(res => {
                setInvoices(res.data);

                let t1 = 0;
                let t2 = 0;
                res.data.forEach((elem:any) => {
                    t1 += parseInt(elem.amount);
                });
                setTotalAmount(t1.toFixed(2));

                let paid = res.data.filter((elem:any) => elem.status === "PAID");
                paid.forEach((elem:any) => {
                    t2 += parseInt(elem.amount);
                });
                setTotalPaid(t2.toFixed(2));
            })
            .catch(err => console.log(err))
    }

    const updateStatus = (obj:any) => {
        if(window.confirm('Are you sure and want to update status?')) {
            axios.put(`http://localhost:3000/invoices/${obj.id}`, {
                status: "PAID",
                createdDate: obj.createdDate,
                dueDate: obj.dueDate,
                amount: obj.amount,
                customerName: obj.customerName,
            })
            .then(res => { getData() })
            .catch(err => console.log(err))
        }
    }

    const delElem = (id:any) => {
        if(window.confirm('Are you sure and want to update status?')) {
            axios.delete(`http://localhost:3000/invoices/${id}`)
            .then(res => { getData() })
            .catch(err => console.log(err))
        }
    }

    const view = (id:any) => {
        navigate(`/invoiceDetails?id=${id}`);
    }

    return (
        <>
            <div className='row header'>
                <div className='col'>
                    <h1 className='m-0 p-4'>Invoices</h1>
                    <nav className="navbar fixed navbar-dark overviewNavbar">
                        <a className="navbar-brand mx-auto"><h4>Total: ${totalAmount}</h4></a>
                        <a className="navbar-brand mx-auto"><h4>Paid: ${totalPaid}</h4></a>
                        <a className="navbar-brand mx-auto"><h4>Unpaid: ${totalAmount - totalPaid}</h4></a>
                    </nav>
                </div>
            </div>

            <div className="row">
                <div className="col m-4 table-responsive">
                    <table className="table table-hover table-bordered table-striped table-sm dashboardTable">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Customer Name</th>
                                <th>Amount</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>View</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((elem:any, idx:any) => {
                                return <tr key={idx}>
                                    <td>{idx+1}</td>
                                    <td>{elem.customerName}</td>
                                    <td>{parseInt(elem.amount).toFixed(2)}</td>
                                    <td>{elem.createdDate}</td>
                                    <td>{elem.dueDate}</td>
                                    <td>{elem.status === "PAID" ? <span className="badge bg-success">{elem.status}</span> :
                                    <span className="badge bg-secondary">{elem.status}</span>}</td>
                                    <td>
                                        <button className="btn btn-dark btn-sm mx-1" onClick={() => view(elem.id)}>View</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-dark btn-sm mx-1" onClick={() => updateStatus(elem)} disabled={elem.status !== "NOT PAID"}>Mark As Paid</button>
                                        <button className="btn btn-danger btn-sm mx-1" onClick={() => delElem(elem.id)}>Delete</button>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
          <Navbar />
        </>
    )
}

export default Invoice;