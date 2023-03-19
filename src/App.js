import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {Filter,PersonForm,Persons, Notice} from './components/Contact'
import ServerComm from './components/ServComm'

const App = () => {
  
  const [filter, setFilter] = useState("")
  const [contacts, setContacts] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [notice, setNotice] = useState({type:null, text:null})
  

  useEffect(() => {
    ServerComm.getAll().then(response => {
        setContacts(response.data)
      })
  }, [])

  
  return (
    <div>
      <h1>Phonebook</h1>
      <Notice type = {notice.type} text = {notice.text}/>

      <Filter fun = {setFilter} var = {filter} />
      
      <PersonForm contacts = {contacts} setContacts = {setContacts} setNotice = {setNotice}
      newName = {newName} setNewName = {setNewName} newNumber = {newNumber} setNewNumber = {setNewNumber}
      />
      
      <h1>Numbers</h1>

      <Persons pplList = {contacts} filterText = {filter} setContacts = {setContacts} setNotice = {setNotice}/>
      
    </div>
  )
}

export default App 