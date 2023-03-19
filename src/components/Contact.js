import React from 'react'
import ServerComm from './ServComm'


const removeContact = vars => {
  const b = window.confirm(`Delete ${vars.contact.name}? This cannot be undone.`)
  if (b) {
    ServerComm.remove(vars.contact.id).then(()=>{
      ServerComm.getAll().then(result => {vars.setContacts(result.data)})
    })
    .catch(()=>{
      vars.setNotice({type: "error", text: `${vars.contact.name} has already been removed`})
      ServerComm.getAll().then(result => {vars.setContacts(result.data)})
      setTimeout(() => {vars.setNotice({type:null,text:null})}, 5000)
    })
  }
}

const updateContact = vars => {
  const b = window.confirm(`${vars.contact.name} is already in the phonebook. Update this number?`)
  if (b) {
    const newNote = {...vars.contact, number: vars.newNumber}
    ServerComm.update(vars.contact.id, newNote).then(()=>{
      ServerComm.getAll().then(result => {vars.setContacts(result.data)})
      vars.setNotice({type: "update", text: `Changed ${vars.contact.name}'s number`})
      setTimeout(() => {vars.setNotice({type:null,text:null})}, 5000)
    })
    .catch(()=>{
      vars.setNotice({type: "error", text: `${vars.contact.name} has already been removed`})
      ServerComm.getAll().then(result => {vars.setContacts(result.data)})
      setTimeout(() => {vars.setNotice({type:null,text:null})}, 5000)
    })
  }
}

const Notice = vars => {
  if (vars.type == null) return null

  return(
  <div>
    <div className = "notice"  style = {{color: vars.type === "error" ? "red" : "green"}}>
      {vars.text}
    </div>
  </div>)
}

const Contact = (vars) => {
  return (<div>
    <li className = "contact">{vars.contact.name}: {vars.contact.number} <button onClick = {()=>removeContact(vars)}>Delete</button></li>
  </div>)
}

const changeFunction = (event, fun) => {

  fun(event.target.value)

}

const Filter = (vars) =>{
  
  return(
  <form onSubmit = {(event) => event.preventDefault()}>
  Filter: 
    <input value = {vars.var} onChange = {(event) => {changeFunction(event,vars.fun)}}/>
  </form>)
}

const PersonForm = (vars) =>{

  const addPerson = (event) => {
      event.preventDefault()

      var sameContact = null

      vars.contacts.forEach( c => {
        if(sameContact == null && c.name.toLowerCase() === vars.newName.toLowerCase()){
          sameContact = c
        }
      })

      if(sameContact != null){
        updateContact({
          contact: sameContact,
          newNumber: vars.newNumber,
          setContacts: vars.setContacts,
          setNotice: vars.setNotice
        })
      }
      else{
        const newNote = {
          name: vars.newName,
          number: vars.newNumber
        }

      ServerComm.create(newNote).then(response=>{
        vars.setContacts(vars.contacts.concat(response.data))
        vars.setNotice({type: "add", text: `Added ${newNote.name}`})
        setTimeout(() => {vars.setNotice({type:null,text:null})}, 5000)
      })

      vars.setNewName('')
      vars.setNewNumber('')
    }
  }

  return(
    <div>

      <form onSubmit = {(event) => event.preventDefault()}>

          <h1>Add new contact:</h1>

          <div>
          Name:
          <input value = {vars.newName} onChange = {(event) =>changeFunction(event,vars.setNewName)}/>
          </div>


          <div>
          Number:
          <input value = {vars.newNumber} onChange = {(event) =>changeFunction(event,vars.setNewNumber)}/>
          </div>

        

        </form>

        <div>
          <button type = "submit" onClick = {addPerson}>
            Add
          </button>
        </div>
      </div>
  )


}

const Persons = (vars) => {

  var whiteList = vars.pplList.filter( c => {
  return c.name.toLowerCase().includes(vars.filterText.toLowerCase()) || vars.filterText.length === 0
})

return(<ul>
      {whiteList.map(c => 

          <Contact key={c.id} contact={c} setContacts = {vars.setContacts} setNotice = {vars.setNotice}/>
        
      )}
    </ul>)
}



export {Filter,PersonForm,Persons, Notice}