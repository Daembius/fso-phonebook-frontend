// import React from 'react';

const Persons = ({ persons, newSearch, deletePerson }) => {
  return (
    <ul>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(newSearch.toLowerCase())
        )
        .map((person) => (
          <li key={person.id}>
            {person.name} {person.number} 
            &nbsp;
            <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
          </li>
        ))}
    </ul>
  );
};

export default Persons;
