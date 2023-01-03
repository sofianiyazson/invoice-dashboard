import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Navbar from './navbar';
import { Context } from '../Store/context';
import moment from 'moment';
import { useNavigate, Link } from 'react-router-dom';

function Projects() {
  let [projectName, setProjectName] = useState('');
  let [color, setColor] = useState('#000000');
  let [projects, setProjects] = useState<any[]>([]);
  let [toEditId, setToEditId] = useState('');
  let [projectToBeInvoiced, setProjectToBeInvoiced] = useState<any>({});
  let [projectTasks, setProjectTasks] = useState<any[]>([]);
  let [checkedTasks, setCheckedTasks] = useState<any[]>([]);
  let [name, setName] = useState<any>('Sofia');
  let [error, setError] = useState<any>('');
  const [checkedState, setCheckedState] = useState<any[]>([]);

  const navigate = useNavigate();
  let context = useContext(Context);

  useEffect(() => {
    context.getProjects();
    setProjects(context.projects);
    context.getTasks();
  }, [context.projects.length]);

  useEffect(() => {
    let k = Array.from({ length: projectTasks.length }, (_, i) => false);
    setCheckedState(k);
  }, [projectTasks.length]);

  const saveProject = () => {
    if (projectName === '' || projectName === undefined) {
      alert('Please enter the project name.');
      return;
    }
    let date = new Date().toISOString().split('T')[0];
    let obj = { projectName, color, date };

    if (toEditId === '') {
      axios
        .post('http://localhost:3000/projects', obj)
        .then((res) => {
          $('#closeBtn').click();
          context.getProjects();
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .put(`http://localhost:3000/projects/${toEditId}`, obj)
        .then((res) => {
          $('#closeBtn').click();
          context.getProjects();
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
    showOptions(0);
  };

  const editRec = (id: any) => {
    let elem: any = projects.find((elem: any) => elem.id === id);
    setProjectName(elem.projectName);
    setColor(elem.color);
    setToEditId(elem.id);
  };

  const delRec = (id: any) => {
    if (
      window.confirm(
        'Are you sure and want to delete this project? The project details alongwith its tasks wil be deleted.'
      ) == true
    ) {
      let tasksToDel = context.tasks.filter(
        (elem: any) => elem.projectId === id.toString()
      );
      tasksToDel.forEach((elem: any) => {
        axios
          .delete(`http://localhost:3000/tasks/${elem.id}`)
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => console.log(err));
      });

      axios
        .delete(`http://localhost:3000/projects/${id}`)
        .then((res) => {
          context.getProjects();
        })
        .catch((err) => console.log(err));
      showOptions(0);
    }
  };

  const showOptions = (id: any) => {
    projects.forEach((elem: any) => {
      if (elem.id === id) $(`#options${id}`).toggle(100);
      else $(`#options${elem.id}`).hide(100);
    });
  };

  const showPopup = (obj: any) => {
    setError('');
    let tasks = context.tasks.filter(
      (elem: any) => elem.projectId === obj.id.toString()
    );
    let k: any = [];
    tasks.forEach((el: any) => {
      let time = moment.duration(el.time).asSeconds();
      if (time > 0) k.push(el);
    });
    setProjectTasks(k);
    setProjectToBeInvoiced(obj);
  };

  const handleOnChange = (position: any) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    let checked = [];
    for (let i = 0; i < projectTasks.length; i++) {
      if (updatedCheckedState[i] === true) {
        checked.push(projectTasks[i]);
      }
    }
    setCheckedTasks(checked);
    setCheckedState(updatedCheckedState);
  };

  const createInvoice = () => {
    if (name === '') {
      setError('Please enter your name first.');
      return;
    }
    if (checkedTasks.length === 0) {
      setError('Please select the task(s) whose invoice you want to create.');
      return;
    }
    let date = new Date().toISOString().split('T')[0];
    var currentDate = moment(date);
    var futureMonth = moment(currentDate).add(1, 'M');
    var futureMonthEnd = moment(futureMonth).endOf('month');

    if (
      currentDate.date() != futureMonth.date() &&
      futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))
    ) {
      futureMonth = futureMonth.add(1, 'd');
    }

    let createdDate = currentDate.format('DD-MM-YYYY');
    let dueDate = futureMonth.format('DD-MM-YYYY');

    setError('');
    setProjectToBeInvoiced({});

    let tasks = getCalc(checkedTasks).arr;
    let amount = getCalc(checkedTasks).amount;

    let obj = {
      status: 'NOT PAID',
      createdDate,
      dueDate,
      customerName: name,
      amount,
      tasks: tasks,
      project: projectToBeInvoiced,
    };

    axios
      .post('http://localhost:3000/invoices', obj)
      .then((res) => {
        deleteTasks(projectToBeInvoiced);
        document.getElementById('close')?.click();
        $('#hideModal').click();
        navigate(`/invoiceDetails?id=${res.data.id}`);
      })
      .catch((err) => console.log(err));
  };

  const deleteTasks = (arr: any) => {
    checkedTasks.forEach((element) => {
      axios
        .delete(`http://localhost:3000/tasks/${element.id}`)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    });
  };

  const getCalc = (arr: any) => {
    let budget = 0;
    arr.forEach((elem: any) => {
      let k = 0;
      let taskTimeInHours = moment.duration(elem.time).asSeconds();
      taskTimeInHours = taskTimeInHours / 3600;
      k = taskTimeInHours * parseInt(elem.invoice);
      elem.amount = k.toFixed(2);
      budget += k;
    });
    let amount = budget.toFixed(2);
    return { arr, amount };
  };

  return (
    <>
      <div className="row mb-2" style={{ backgroundColor: '#ddd' }}>
        <h1>Overview</h1>
        <nav className="navbar fixed navbar-dark overviewNavbar">
          <div className="col-6 activeA">
            <Link
              to="/overview/projects"
              id="projectLink"
              className="navbar-brand mx-auto"
            >
              <h4>Projects</h4>
            </Link>
          </div>
          <div className="col-6">
            <Link
              to="/overview/tasks"
              id="taskLink"
              className="navbar-brand mx-auto"
            >
              <h4>Tasks</h4>
            </Link>
          </div>
        </nav>
      </div>

      {projects.length === 0 && (
        <h6>
          There are no projects created so far. Click the button below to create
          a new project.
        </h6>
      )}
      {projects.map((elem: any, idx) => {
        return (
          <div className="row task p-0" key={idx}>
            <div className="col-6 m-0 p-0">
              <span
                className="bgColor"
                style={{ backgroundColor: `${elem.color}` }}
              ></span>
              <h2>{elem.projectName}</h2>
              <p>
                <span>
                  Date: <b>{elem.date}</b>
                </span>
              </p>
            </div>
            <div className="col-6">
              <button
                className="btn btn-success btn-sm mt-4 invoice"
                data-toggle="modal"
                data-target="#modal"
                onClick={() => showPopup(elem)}
              >
                Invoice
              </button>
              <span
                className="threeDots mt-3"
                onClick={() => showOptions(elem.id)}
              >
                <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
              </span>
              <span className="options" id={`options${elem.id}`}>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => editRec(elem.id)}
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i>&nbsp; Edit
                </button>
                <br />
                <button
                  className="btn btn-light btn-sm del"
                  onClick={() => delRec(elem.id)}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>&nbsp;
                  Delete
                </button>
              </span>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        className="btn btn-success btn-block"
        data-toggle="modal"
        data-target="#exampleModal"
        style={{ marginBottom: 50 }}
      >
        Add New Project
      </button>

      {/* Add New Project Modal */}
      <div
        className="modal fade mt-5"
        id="exampleModal"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Task
              </h5>
              <button
                type="button"
                id="closeBtn"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setProjectName('');
                  setColor('#000000');
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter Project Name"
              />
              <input
                type="color"
                className="form-control w-50"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ float: 'left', width: '20%' }}
              />
              <h4 style={{ float: 'left' }}>{color}</h4>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                onClick={saveProject}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <div
        className="modal fade"
        id="modal"
        role="dialog"
        aria-labelledby="exampleModalLabel1"
        aria-hidden="true"
        style={{ textAlign: 'left' }}
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel1">
                Create Invoice
              </h5>
              <button
                type="button"
                id="hideModal"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setCheckedState([false])}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {projectTasks.length === 0 && (
              <div className="modal-body">
                <p>
                  This project does not have any tasks or their time is zero.
                </p>
              </div>
            )}
            {projectTasks.length > 0 && (
              <div className="modal-body">
                <p>Please enter your name below.</p>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p>
                  Select the tasks whose invoice you want to create and lick the
                  button. (Only those tasks will be shown whose time is not
                  zero).
                </p>
                {projectTasks.map((elem: any, idx) => {
                  return (
                    <div className="checkBox" key={idx}>
                      <label className="form-check-label">
                        {elem.taskName}
                      </label>
                      <input
                        className="form-check-input"
                        style={{ float: 'right' }}
                        type="checkbox"
                        name={name}
                        value={name}
                        checked={checkedState[idx]}
                        onChange={() => handleOnChange(idx)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {projectTasks.length > 0 && (
              <div className="modal-footer">
                <p style={{ color: 'red' }}>{error}</p>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={createInvoice}
                >
                  Create Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Navbar />
    </>
  );
}

export default Projects;
