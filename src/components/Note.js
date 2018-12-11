import React, { PureComponent } from 'react';
import { Card, CardText, CardBody, Input } from 'reactstrap';

class Note extends PureComponent {
    state = {
        editMode: false,
        noteText: this.props.note.noteText
    }
    
    editNote = (e) => {
        console.log('edit note', this.state.noteText);
        this.setState({
            editMode: !this.state.editMode
        },  _ => {
            if(!this.state.editMode) {
                this.props.updateNote(this.props.id, this.state.noteText);
            }
        });
    }

    deleteNote = (e) => {
        this.props.deleteNote(this.props.id);
    }

    noteChange = (e) => {
        this.setState({
            noteText: e.target.value
        });
    }

    completeNote = (e) => {
        console.log('complete note');
    }

    render() {
        const cardText = this.state.editMode
            ? <Input value={this.state.noteText} onChange={this.noteChange} />
            : <CardText>{this.props.note.noteText}</CardText>;

        const editLinkClass = this.state.editMode
        ? 'fa-check-square'
        : 'fa-edit';

        return (
            <Card className="note">
                <CardBody>
                    <i className="far fa-window-close fa-lg" onClick={this.deleteNote}></i>
                    <i className={`fas ${editLinkClass} fa-lg`} onClick={this.editNote}></i>
                    <div className="note-text">{cardText}</div>
                </CardBody>
            </Card>
        );
    }
}

export default Note;