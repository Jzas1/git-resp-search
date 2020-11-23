import React, { Component, Fragment } from 'react'
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/NavBar'
import Users from './components/users/Users'
import User from './components/users/user'
import Alert from './components/layout/Alert'
import Search from './components/users/Search'
import About from './components/pages/About'
import axios from 'axios'

class App extends React.Component{
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  }
  

  searchUsers = async text => {
    this.setState({ loading: true })

    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=b56884119321a642d344&client_secret=2dc53aecf25af7ccc66d3922d81d2ef3674dfac7`)

    this.setState({ users: res.data.items, loading: false })  
  }

  getUser = async (username) => {
    this.setState({ loading: true })

    const res = await axios.get(`https://api.github.com/users/${username}?client_id=b56884119321a642d344&client_secret=2dc53aecf25af7ccc66d3922d81d2ef3674dfac7`)

    this.setState({ user: res.data, loading: false })  
  }


  getUserRepos = async (username) => {
    this.setState({ loading: true })

    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=b56884119321a642d344&client_secret=2dc53aecf25af7ccc66d3922d81d2ef3674dfac7`)

    this.setState({ repos: res.data, loading: false })  
    
  }

  

  clearUsers = () => this.setState({ users: [], loading: false })

  
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } })

    setTimeout(() => this.setState({ alert: null }), 5000)
}
 

  render(){
      const { users, user, loading, repos } = this.state

     return ( 
       <Router>
       <div className="App">
          <Navbar />
          <div className='container'>
          <Alert alert={this.state.alert} />
          <Switch>
            <Route exact path='/' render={props => (
              <Fragment>
              <Search
              searchUsers={this.searchUsers} 
              clearUsers={this.clearUsers} 
              showClear={ this.state.users.length >  0 ? true : false  }
              setAlert={this.setAlert}
              />
         
             <Users loading={this.state.loading} users={this.state.users} />  

              </Fragment>
            )} />
            <Route exact path="/about" component={About} />
            <Route exact path='/user/:login' render={props => (
              <User {...props}  
              getUser={this.getUser} 
              getUserRepos={this.getUserRepos} 
              repos={repos}
              user={user} 
              loading={loading} />
            )} />
          </Switch>
    
          </div>
       </div>
       </Router>

   )
  }
}

export default App;

