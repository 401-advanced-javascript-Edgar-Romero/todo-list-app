import Header from './components/header/header.js'
import UserForm from './components/todo/form.js'
import TodoList from './components/todo/list.js'

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap'
import superagent from 'superagent';
import axios from 'axios';
const url = 'https://auth-server-cb.herokuapp.com/api/v1/todo';


export default function App() {

  const [refresh, triggerRefresh] = useState(false)
  const [list, setList] = useState([])
  const [error, setError] = useState(null)


  async function handleForm(item) {
    const config = {
      method: 'post',
      url,
      data: {
        ...item,
        complete:false
      },
    };
    try{
      await axios(config);
      triggerRefresh(!refresh);
      setError(null);
    }
    catch (error){
      setError(error.message);
    }
  }
  

  useEffect(() => {
    const unfinishedItems = list.filter(i => i.complete === false).length;
    document.title = `To Do List: ${unfinishedItems}`;

    
    handleSuperagent();
    
  },[])// eslint-disable-line react-hooks/exhaustive-deps
  
  async function handleSuperagent() {
    const response = await superagent.get('https://auth-server-cb.herokuapp.com/api/v1/todo')
    const toDoItems = response.body.results;
    console.log(toDoItems)
    setList(toDoItems);

  }
  
  async function toggleComplete (id) {
    let item = list.filter(i => i._id === id)[0] || {};

    const config = {
      method: 'put',
      url: `${url}/${id}`,
      data: {
        ...item,
        complete:!item.complete,
      },
    };
    try{
      await axios(config);
      triggerRefresh(!refresh);
      setError(null);
    }
    catch(error){
      setError(error.message);
    }
  }

  return (
    <>
    <Header />
      <Container>
      <Container className = 'p-3'/>
        <h2 className = 'text-white bg-dark mt-3 p-3'>To Do List Manager ({list.filter(item => !item.complete).length})</h2>
      <Row>
      <Col xs={12} sm={12} md={6} lg={4}>
        <UserForm handler = {handleForm}/>
      </Col>
      
      <Col xs={12} sm={12} md={6} lg={8}>
        <TodoList list = {list} handleComplete={toggleComplete}/>
      </Col>
      </Row>
      </Container>
      {/* < Footer />  */}
    </>
  );
}
