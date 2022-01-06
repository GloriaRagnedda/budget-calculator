import { useEffect, useState } from 'react';
import './App.css';
import Alert from './components/Alert'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import { v4 as uuidv4 } from 'uuid';

/*const initialExpenses = [
  {id:uuidv4(), charge:'rent', amount:1600},
  {id:uuidv4(), charge:'car payment', amount:400},
  {id:uuidv4(), charge:'credit card bill', amount:1200},
]*/

//if the expenses are there, get the value of these expenses
const initialExpenses = localStorage.getItem('expenses')? JSON.parse(localStorage.getItem('expenses')) : []

function App() {
  // ********* state values **********
  //all expenses, add expenses
  const [expenses, setExpenses] = useState(initialExpenses)
  // single expense
  const [charge, setCharge] = useState('');
  // single amount
  const [amount, setAmount] = useState('');
  //alert
  const [alert, setAlert] = useState({show:false});
  //Edit
  const [edit, setEdit] = useState(false);
  //id
  const [id, setId] = useState(0);

 //******use effect ******* */
 useEffect(() => {
   console.log('called useeffect')
   localStorage.setItem('expenses', JSON.stringify(expenses))
 }, [expenses])


  //******functionality ******* */
  const handleCharge = e =>{
    setCharge(e.target.value)
  }

  const handleAmount = e =>{
    setAmount(e.target.value)
  }

  const handleAlert = ({type,text}) =>{
    setAlert({show:true, type, text});
    setTimeout(()=>{
      setAlert({show:false})
    },3000)
  }

  const handleSubmit = e =>{
    e.preventDefault();
    if(charge !== '' && amount > 0){
    if(edit){
      let tempExpenses = expenses.map(item => {
        return item.id ===  id ? {...item, charge:charge,amount:amount} :item
      })
      setExpenses(tempExpenses);
    }else{
      const singleExpense = {id:uuidv4() ,charge:charge, amount:amount}
                  //grap old values //new one
      setExpenses([...expenses, singleExpense])
      handleAlert({type:'success', text:'item added'})
    }
      setCharge('')
      setAmount('')
      handleAlert({type:'success', text:'item edited'})
    } else{
      handleAlert({type:'danger', text:`charge can't be empty has to be bigger than zero`})
    }
  }
// clear all items
const clearItems =()=>{
  setExpenses([])
  handleAlert({type:'danger', text:'all item deleted'} )
}
// delete all items
const handleDelete =(id)=>{      //if your id does not match the id I am passing in
  let tempExpenses = expenses.filter(item => item.id !== id);
  setExpenses(tempExpenses);  
  handleAlert({type:'danger', text:'item deleted'} )
}
// edit all items
const handleEdit =(id)=>{//if the id I am clicking match the id I am passing in, return this item
  let expense = expenses.find(item => item.id === id)
  let {charge,amount} = expense;
  setCharge(charge);
  setAmount(amount)
  setEdit(true)
  setId(id)
}
  return (
    <>
    {alert.show && <Alert type={alert.type} text={alert.text} />}
     <Alert />
     <h1>Budget calculator</h1>
     <main className="App">
     <ExpenseForm 
     charge={charge} 
     handleCharge={handleCharge} 
     amount={amount} 
     handleAmount={handleAmount} 
     handleSubmit={handleSubmit} 
     edit={edit}
     />
     <ExpenseList 
     expenses={expenses} 
     handleDelete={handleDelete} 
     handleEdit={handleEdit} 
     clearItems={clearItems} />
     </main>
     <h1>total spending : <span className="total">
                      {/*total*/}
       $ {expenses.reduce((acc,curr)=>{
         return acc += parseInt(curr.amount);
        //init
       },0)}
     </span></h1>
    </>
  );
}

export default App;
