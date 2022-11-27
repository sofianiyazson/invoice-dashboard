import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    let id = window.location.href.split('/')[3];
    useEffect(() => {
        if (id === undefined || id == "") changeClass('dashboard')
        else changeClass(`${id}`);
    }, []);

    const changeClass = (id:any) => {
        let elems = document.getElementsByClassName('navbar-brand');
        for (let i = 0; i < elems.length; i++) {
            document.getElementsByClassName('navbar-brand')[i].classList.remove("active");
        }
        document.getElementById(id)?.classList.add("active");
    }

    return (
        <div className='row navbar' style={{marginTop: '5%'}}>
            <div className='col'>
                <nav className="navbar fixed-bottom navbar-dark">
                    <Link to="/" id='dashboard' className="navbar-brand mx-auto active" onClick={() => changeClass('dashboard')}><i className="bi bi-boxes"></i></Link>
                    <Link to="/timer" id='timer' className="navbar-brand mx-auto" onClick={() => changeClass('timer')}><i className="bi bi-stopwatch-fill"></i></Link>
                    <a href="/calender" id='calender' className="navbar-brand mx-auto" onClick={() => changeClass('calender')}><i className="bi bi-calendar-fill"></i></a>
                    <Link to="/overview/projects" id='overview' className="navbar-brand mx-auto" onClick={() => changeClass('overview')}><i className="fa fa-archive" aria-hidden="true"></i></Link>
                    <Link to="/invoice" id='invoice' className="navbar-brand mx-auto" onClick={() => changeClass('invoice')}><i className="bi bi-receipt-cutoff"></i></Link>
                </nav>
            </div>
        </div>
    )
}

export default Navbar;