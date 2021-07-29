import {Component} from 'react'
import './assets/TaskGroup.css'
import Task from './Task'
import axios from "axios";
import {toast} from "react-hot-toast";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Draggable, Droppable} from "react-beautiful-dnd";
import AttributePopover from "./AttributePopover";

class TaskGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTask: '',

            // new dialog
            dialogOpen: false,
            name: '',

            // name edit
            editing: false,
            editingName: this.props.taskGroup.name,

            // delete confirmation
            deleteDialogOpen: false,

            // attribute popover
            popoverOpen: false,
            popoverId: '',
        }
    }

    handleNewStatus = async () => {
        await axios({
            method: 'POST',
            withCredentials: true,
            url: `http://localhost:3001/api/attribute/${this.props.boardId}`,
            data: {
                name: this.state.name
            }
        }).then(res => {
            this.props.getData()
            this.setState({
                name: '',
                dialogOpen: false
            })
        }).catch(err => {
            toast(err.toString())
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    addTask = async (e) => {
        e.preventDefault()
        await axios({
            method: 'POST',
            withCredentials: true,
            url: `http://localhost:3001/api/task/${this.props.boardId}/${this.props.taskGroup._id}`,
            data: {
                name: this.state.newTask
            }
        }).then(res => {
            this.props.getData()
            this.setState({
                newTask: ''
            })
        }).catch(err => {
            toast(err.toString())
        })
    }

    handleAttributePopover = (e, id = null) => {
        this.setState(st => ({
            popoverId: id ? id : st.popoverId,
            popoverOpen: e ? e.target.parentNode : null
        }))
    }

    handleDeleteClick = () => {
        this.setState(st => ({deleteDialogOpen: !st.deleteDialogOpen}))
    }

    handleDelete = async () => {
        await axios({
            method: 'DELETE',
            withCredentials: true,
            url: `http://localhost:3001/api/taskgroup/${this.props.boardId}/${this.props.taskGroup._id}`
        }).then(res => {
            this.props.getData()
        }).catch(err => {
            toast(err.toString())
        })
    }

    updateName = async (e) => {
        console.log(e)
        e.preventDefault()
        await axios({
            method: 'PATCH',
            withCredentials: true,
            url: `http://localhost:3001/api/taskGroup/${this.props.boardId}/${this.props.taskGroup._id}`,
            data: {
                name: this.state.editingName
            }
        }).then(res => {
            this.props.getData()
            this.setState(st => ({
                editing: !st.editing,
            }))
        }).catch(err => {
            toast(err.toString())
        })
    }

    toggleNameEdit = () => {
        this.setState(st => ({
            editing: !st.editing,
            editingName: this.props.taskGroup.name
        }))
    }

    render() {
        return (
            <Draggable draggableId={this.props.taskGroup._id} index={this.props.index}>
                {(provided) => (
                    <div className="task" {...provided.draggableProps} ref={provided.innerRef}>
                        <div className="title">
                            <div {...provided.dragHandleProps}>
                                {this.state.editing ? (
                                    <div className="taskGroup-title editing">
                                        <form onSubmit={this.updateName}>
                                            <input
                                                type="text"
                                                name="editingName"
                                                value={this.state.editingName}
                                                onChange={this.handleChange}/>
                                            <div>
                                                <i onClick={this.toggleNameEdit} className="fas fa-times"> </i>
                                                <i onClick={this.updateName} className="fas fa-check"> </i>
                                            </div>
                                        </form>
                                    </div>) : (
                                    <div className="taskGroup-title">
                                        <p>{this.props.taskGroup.name}</p>
                                        <i className="fas fa-pen" onClick={this.toggleNameEdit}> </i>
                                        <i onClick={this.handleDeleteClick} className="fas fa-trash-alt"> </i>
                                    </div>)}
                                <p className="task-amount">{this.props.taskGroup.tasks.length} TASKS</p>
                            </div>
                            <Droppable
                                droppableId={this.props.taskGroup._id + 'attribute'}
                                direction="horizontal"
                                type={`attribute ${this.props.taskGroup._id}`}>
                                {(provided) => (
                                    <div className="attributes" {...provided.droppableProps} ref={provided.innerRef}>
                                        {this.props.attributes.map((x, i) => {
                                            return (
                                                <Draggable
                                                    draggableId={this.props.taskGroup._id + x._id}
                                                    index={i}
                                                    key={this.props.taskGroup._id + x._id}>
                                                    {(provided) => (
                                                        <div
                                                            className="attribute"
                                                            ref={provided.innerRef}
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}>
                                                            <i className="fas fa-caret-down"> </i>
                                                            <p>{x.name}</p>
                                                            <i className="fas fa-caret-down"
                                                               onClick={e => this.handleAttributePopover(e, x)}> </i>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                        <div className="attribute">
                                            <p><i
                                                onClick={() => this.setState({dialogOpen: true})}
                                                className="fas fa-plus-circle"> </i></p>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <Droppable droppableId={this.props.taskGroup._id} type="task">
                            {(provided) => (
                                <div className="tasks" ref={provided.innerRef} {...provided.droppableProps}>
                                    {this.props.taskGroup.tasks.map((task, i) => {
                                        return (
                                            <Task
                                                key={task._id}
                                                getData={this.props.getData}
                                                task={task}
                                                index={i}
                                                taskGroupId={this.props.taskGroup._id}
                                                attributes={this.props.attributes}/>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <form onSubmit={this.addTask}>
                            <div className="new-task">
                                <input
                                    type="text"
                                    placeholder="+ New Task"
                                    value={this.state.newTask}
                                    name="newTask"
                                    onChange={this.handleChange} />
                                {this.state.newTask ? <button>SAVE</button> : null}
                            </div>
                        </form>


                        <Dialog
                            open={this.state.dialogOpen}
                            onClose={() => this.setState({dialogOpen: false})}
                            aria-labelledby="form-dialog-title"
                            fullWidth={true}>
                            <DialogTitle id="form-dialog-title">Add new Status</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    onChange={this.handleChange}
                                    label="Status name"
                                    type="text"
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => this.setState({dialogOpen: false})} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleNewStatus} color="primary">
                                    Create
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={this.state.deleteDialogOpen}
                            onClose={this.handleDeleteClick}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{`Delete ${this.props.taskGroup.name} group?`}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    All tasks within this Group will be deleted.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleDeleteClick} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleDelete} color="primary" variant="contained">
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <AttributePopover
                            getData={this.props.getData}
                            boardId={this.props.boardId}
                            open={this.state.popoverOpen}
                            close={this.handleAttributePopover}
                            attr={this.state.popoverId} />
                    </div>
                )}
            </Draggable>
        );
    }
}

export default TaskGroup