import { Component } from 'react'
import '../../../styles/TaskGroup.css'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { connect } from 'react-redux'
import { addTaskGroup } from '../../../modules/state/reducers/boardReducer'
import { ObjectId } from '../../../utils'

class NewTaskGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // name edit
            editingName: ''
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    addTaskGroup = async e => {
        e.preventDefault()
        if (this.state.editingName === '') return this.removeTaskGroup()
        this.props.toggleNewTaskGroup()
        this.props.dispatch(
            addTaskGroup({ _id: ObjectId(), name: this.state.editingName })
        )
    }

    removeTaskGroup = () => {
        this.props.toggleNewTaskGroup()
    }

    render() {
        return (
            <Draggable draggableId={'newTaskGroup'} index={this.props.index}>
                {provided => (
                    <div
                        className="task"
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <div className="title">
                            <div {...provided.dragHandleProps}>
                                <div className="taskGroup-title editing">
                                    <form
                                        onSubmit={this.addTaskGroup}
                                        onBlur={this.addTaskGroup}
                                    >
                                        <input
                                            onKeyUp={e => {
                                                if (e.key === 'Escape')
                                                    this.removeTaskGroup()
                                            }}
                                            type="text"
                                            name="editingName"
                                            value={this.state.editingName}
                                            onChange={this.handleChange}
                                            autoFocus
                                        />
                                        <div>
                                            <i
                                                onClick={this.removeTaskGroup}
                                                className="fas fa-times"
                                            >
                                                {' '}
                                            </i>
                                            <i
                                                onClick={this.addTaskGroup}
                                                className="fas fa-check"
                                            >
                                                {' '}
                                            </i>
                                        </div>
                                    </form>
                                </div>
                                <p className="task-amount">0 TASKS</p>
                            </div>
                            <Droppable
                                droppableId={'newTaskGroup attribute'}
                                direction="horizontal"
                                type={`attribute newTaskGroup`}
                            >
                                {provided => (
                                    <div
                                        className="attributes"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {this.props.attributes.map((x, i) => {
                                            return (
                                                <Draggable
                                                    draggableId={
                                                        'newTaskGroup' + x._id
                                                    }
                                                    index={i}
                                                    key={'newTaskGroup' + x._id}
                                                >
                                                    {provided => (
                                                        <div
                                                            className="attribute"
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}
                                                        >
                                                            <i className="fas fa-caret-down">
                                                                {' '}
                                                            </i>
                                                            <p>{x.name}</p>
                                                            <i className="fas fa-caret-down">
                                                                {' '}
                                                            </i>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                        <div className="attribute">
                                            <p>
                                                <i className="fas fa-plus-circle">
                                                    {' '}
                                                </i>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <Droppable droppableId={'newTaskGroup'} type="task">
                            {provided => (
                                <div
                                    className="tasks"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                ></div>
                            )}
                        </Droppable>
                        <form onSubmit={e => e.preventDefault()}>
                            <div className="new-task">
                                <input
                                    type="text"
                                    placeholder="+ New Task"
                                    value=""
                                    name="newTask"
                                    onChange={this.handleChange}
                                />
                            </div>
                        </form>
                    </div>
                )}
            </Draggable>
        )
    }
}

export default connect(null)(NewTaskGroup)
