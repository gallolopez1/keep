import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { REMOVE_TODO } from '../utils/mutations';
import Auth from '../utils/auth';

const ToDo = ({ toDos }) => {

  //set removeToDo as the mutation REMOVE_TODO
  const [removeToDo] = useMutation(REMOVE_TODO);

  //get user token from auth function
  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    return <h3>Please Login to Add To-Dos</h3>
  } else if     //if no Todos returned, return this h3
    (!toDos.length) {
    return <h3>No To-Dos Yet!</h3>
  }

  // create function that accepts the book's mongo _id value as param and deletes the todo from the database
  const handleDeleteToDo = async (toDoId) => {

    //if no token do return out of function
    if (!token) {
      return false;
    }
    //try to async remove the todo by passing in the toDoId param to match _id in db
    try {
      await removeToDo({
        variables: { _id: toDoId }
      });
      return window.location.reload();
    } catch (err) {
      //else console log error if unsuccessful
      console.error(err);
    }

  };

  // const handleShowUpdate = async (id) => {
  //   console.log(id)
  //   let inputValueId = document.getElementById(id);
  //   inputValueId.setAttribute("style", "display: flex");

  //   return;
  // }

  // const handleUpdateToDo = async (id, event) => {
  //   //id of todo
  //   console.log(id);
  //   //value of updated to do
  //   console.log(event.target.previousSibling.value);
  // }



  return (

    <div>
      <div className="m-1 row justify-content-around">
        {/*  */}
        <div className="col-12 col-md-6 mb-3">
          <div className="card">
            <h4 className="card-header bg-dark text-light d-flex align-items-center">
              To Do
            </h4>
            <ul id="list-toDo" className="list-group list-group-flush">
              {toDos.map((toDo) => (
                <>
                  <li className='list-group-item d-flex justify-content-between align-items-center' key={toDo._id}>
                    <span className="text" data-bs-toggle="modal" data-bs-target="#updateTask"> {toDo.text}</span>
                    {/* <div id={toDo._id} className="hide">
                      <textarea>{toDo.text}</textarea>
                      <button onClick={(event) => handleUpdateToDo(toDo._id, event)} >Update</button>
                    </div> */}
                    {/* <span className="bonus-text"> from {toDo.createdAt}</span> */}
                    <br />
                    {/* <!-- Modal --> */}
                    <div className="modal fade" id="updateTask" tabIndex="-1" aria-labelledby="updateTask" aria-hidden="true">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 style={{ fontFamily: 'calibri' }} className="modal-title" id="exampleModalLabel">Update Task</h5>
                            <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body">
                            Update Function
                          </div>
                          <div className="modal-footer">
                            <button className="btn btn-add">Save changes</button>
                            <button onClick={() => handleDeleteToDo(toDo._id)} id="remove-tasks" className="btn btn-danger m-1"><span className="oi oi-trash mr-2"></span>Delete Task</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='d-flex justify-content-center'>
                      <button id="remove-tasks" className="btn btn-success m-1 btn-sm"><span className="oi oi-task mr-2"></span>Done</button>

                    </div>
                  </li>
                </>

              ))}
            </ul>
          </div>
        </div>
        {/*             
            <div className="col-12 col-md-6 col-xl-3 mb-3">
              <div className="card">
                <h4 className="card-header bg-dark text-light d-flex align-items-center">
                  In Progress
                </h4>
                <ul id="list-inProgress" className="list-group list-group-flush">
                </ul>
              </div>
            </div> */}
        {/*  */}
        <div className="col-12 col-md-6 mb-3">
          <div className="card">
            <h4 className="card-header bg-dark text-light d-flex align-items-center">
              Done
            </h4>
            <ul id="list-done" className="list-group list-group-flush">
            </ul>
          </div>
        </div>
      </div>
      {/* <button id="create-task" className="btn btn-block btn-add" data-toggle="modal" data-target="#task-form-modal">
        <span className="oi oi-plus mr-2"></span>
        Add Task
      </button>
      <button id="remove-tasks" className="btn btn-block btn-delete mb-2 mb-md-4">
        <span className="oi oi-trash mr-2"></span>
        Delete All Tasks
      </button> */}


    </div >
  )
}

export default ToDo;