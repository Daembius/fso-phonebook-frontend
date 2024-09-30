import { useState, useEffect } from "react";
import axios from "axios";

import Persons from "./components/Persons";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import PersonForm from "./components/PersonForm";
import personService from './services/persons'

import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");

  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    // Trim entry to avoid confusion between "name" and "name_"
    const trimmedName = newName.trim();
    const trimmedNumber = newNumber.trim();
    if (trimmedName === "" || trimmedNumber === "") {
      alert("Name and number are required");
      return;
    }
    const personObject = {
      name: trimmedName,
      number: trimmedNumber,
    };

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === trimmedName.toLocaleLowerCase()
    );

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {
        personService
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => 
              person.id === existingPerson.id ? returnedPerson : person
            ));
            setNewName('');
            setNewNumber('');
            setSuccessMessage(`Updated ${returnedPerson.name}'s number`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch(error => {
            console.error('Error updating person:', error);
            setErrorMessage(
              `Information of '${existingPerson.name}' has already been removed from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setSuccessMessage(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch(error => {
          console.error("Error adding person: ", error);
          setErrorMessage(
            `Failed to add ${personObject.name}. ${error.response?.data?.error || 'An error occurred.'}`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(prevPersons => prevPersons.filter(person => person.id !== id));
          setSuccessMessage(`Deleted ${name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch(error => {
          console.error("Error deleting person:", error);
          setErrorMessage(
            `Information of '${name}' has already been removed from server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          setPersons(prevPersons => prevPersons.filter(person => person.id !== id));
        });
    }
  };

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setNewSearch(searchTerm);
  };

  console.log("persons array; ", persons);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handlePersonChange={handlePersonChange}
        handleNumberChange={handleNumberChange}
      />
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
      <h3>Numbers</h3>
      <Persons persons={persons} newSearch={newSearch} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
