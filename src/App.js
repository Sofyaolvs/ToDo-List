import './App.css';
import { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark, FaRegTrashAlt } from 'react-icons/fa';

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTarefas = async () => {
      setLoading(true);
      const res = await fetch(API + "/tarefas");
      const data = await res.json();
      setTarefas(data);
      setLoading(false);
    };

    fetchTarefas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novaTarefa = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/tarefas", {
      method: "POST",
      body: JSON.stringify(novaTarefa),
      headers: {
        "Content-Type": "application/json"
      }
    });

    setTarefas([...tarefas, novaTarefa]);
    setTitle("");
    setTime("");
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/tarefas/${id}`, {
        method: "DELETE",
      });
      setTarefas((tarefas) => tarefas.filter((tarefa) => tarefa.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const handleToggleDone = async (id) => {
    const tarefaToUpdate = tarefas.find((tarefa) => tarefa.id === id);
    const updatedTarefa = { ...tarefaToUpdate, done: !tarefaToUpdate.done };

    try {
      await fetch(`${API}/tarefas/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedTarefa),
        headers: {
          "Content-Type": "application/json"
        }
      });

      setTarefas(tarefas.map((tarefa) => (tarefa.id === id ? updatedTarefa : tarefa)));
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <div className="tarefas-header">
        <h1>Your To Do List</h1>
      </div>

      <div className="form-tarefas">
        <h2>Create tasks here</h2>
        <form onSubmit={handleSubmit}>
          <div className="tarefas-control">
            <label htmlFor="title">What are you going to do?</label>
            <input
              type="text"
              placeholder="Title of task"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>
          <div className="tarefas-control">
            <label htmlFor="time">Duration:</label>
            <input
              type="text"
              name="time"
              placeholder="Estimated time (hours)"
              onChange={(e) => setTime(e.target.value)}
              value={time}
              required
            />
          </div>
          <input type="submit" value="Create a new task" />
        </form>
      </div>

      <div className="list-tarefas">
        <h2>Tasks:</h2>
        {tarefas.length === 0 && <p>Nothing here yet!</p>}
        {tarefas.map((tarefa) => (
          <div className="tarefas" key={tarefa.id}>
            <h3 className={tarefa.done ? "tarefas-done" : ""}>{tarefa.title}</h3>
            <p>Duration: {tarefa.time} hours</p>
            <div className="actions">
              <span onClick={() => handleToggleDone(tarefa.id)}>
                {tarefa.done ? <FaBookmark /> : <FaRegBookmark />}
              </span>
              <span onClick={() => handleDelete(tarefa.id)}>
                <FaRegTrashAlt />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;



