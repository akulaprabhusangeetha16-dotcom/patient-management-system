import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [patients, setPatients] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [disease, setDisease] = useState("");

  // LOGIN FUNCTION
  const login = () => {
    axios.post("http://127.0.0.1:8000/login", {
      username,
      password
    })
    .then(res => {
      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
    })
    .catch(() => alert("Login failed"));
  };

  // FETCH PATIENTS
  const fetchPatients = () => {
    axios.get("http://127.0.0.1:8000/patients", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setPatients(res.data))
    .catch(() => alert("Unauthorized"));
  };

  useEffect(() => {
    if (token) fetchPatients();
  }, [token]);

  // ADD PATIENT
  const addPatient = () => {
    axios.post(
      "http://127.0.0.1:8000/patients",
      { name, disease },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(() => {
      fetchPatients();
      setName("");
      setDisease("");
    })
    .catch(() => alert("Error adding patient"));
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPatients([]);
  };

  // UI
  if (!token) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>🔐 Login</h2>
        <input
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏥 Patient Management System</h1>

      <button onClick={logout}>Logout</button>

      <h3>Add Patient</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Disease"
        value={disease}
        onChange={e => setDisease(e.target.value)}
      />
      <button onClick={addPatient}>Add</button>

      <h3>Patient List</h3>
      <ul>
        {patients.map(p => (
          <li key={p.id}>
            {p.name} - {p.disease}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;