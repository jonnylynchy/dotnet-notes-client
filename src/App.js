import React, { Component } from 'react';
import { Alert, Button, InputGroup, Input, InputGroupAddon } from 'reactstrap';

import Note from './components/Note';

import './App.css';

const rootPath = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';
const rootUrl = `${rootPath}/api/notes/`

class App extends Component {
	state = {
		notes: [],
		newNote: '',
		updated: false
	};

	componentDidMount() {
		this.fetchNotes();
	}

	fetchNotes = _ => {
		fetch(rootUrl)
      		.then(res => res.json())
			.then(json => {
				console.log(json);
				this.setState({ notes: json });
			});
	}

	noteChange = (e) => {
		const note = e.target.value;
		this.setState({
			newNote: note
		});
	}

	updateNote = async (noteId, text) => {
		// update UI (expecting that update on server worked)
		const updatedNotes = this.state.notes.map((x) => {
			if(x.noteID === noteId) {
				const newNote = {...x, noteText: text}
				return newNote;
			}
			return x;
		});

		this.setState({
			notes: updatedNotes
		});

		// send update to server
		const noteUrl = rootUrl + noteId;
		console.log(noteUrl);
		const data = {
			NoteText: text
		};
		const rawResponse = await fetch(noteUrl, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if(rawResponse.ok) {
			console.log('note updated');
		} else {
			console.log('Error', rawResponse.statusText);
		}
	}

	insertNote = async _ => {
		const data = {
			NoteText: this.state.newNote
		};
		const rawResponse = await fetch(rootUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if(rawResponse.ok) {
			console.log('note inserted');
			this.setState({
				updated: true
			});
			this.fetchNotes();
		} else {
			this.setState({
				error: rawResponse.statusText
			});
		}
	}

	deleteNote = async (noteId) => {
		// update UI (expecting that update on server worked)
		const updatedNotes = this.state.notes.filter((x) => x.noteID !== noteId);

		this.setState({
			notes: updatedNotes
		});

		// send update to server
		const noteUrl = rootUrl + noteId;
		const rawResponse = await fetch(noteUrl, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});

		if(rawResponse.ok) {
			console.log('note deleted');
		} else {
			console.log('Error', rawResponse.statusText);
		}
	}

	render() {

		const noteList = this.state.notes.map((note) => <Note id={note.noteID} key={note.noteID} note={note} updateNote={this.updateNote} deleteNote={this.deleteNote}/>);

		return (
			<div className="App">
				<div className="container">
					<header>
						Scratch
					</header>
					{this.state.updated
						? (
							<Alert color="success">
								Note Added
						  	</Alert>
						  )
						: null
					}
					{this.state.error 
						? (
							<Alert color="danger">
								{this.state.error}
							</Alert>
						)
						: null
					}
					<p></p>
					<InputGroup>
						<Input 
							onChange={this.noteChange}
							value={this.state.newNote}
							placeholder="Enter a new note and click 'Save'"
						/>
						<InputGroupAddon addonType="append">
							<Button 
								onClick={this.insertNote} 
								color="primary">
								Save
							</Button>
						</InputGroupAddon>
					</InputGroup>
					<p></p>
					<h3 className="text-center">Notes</h3>
					<div className="note-list text-center">
						{noteList.length ? noteList : <div>No notes</div>}
					</div>
					
				</div>
			</div>
		);
	}
}

export default App;
