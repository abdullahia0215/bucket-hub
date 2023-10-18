
import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import About from '../About/About';
import CreateGroup from '../CreateGroup/CreateGroup';
import GroupBucketList from '../GroupBucketList/GroupBucketList';
import MyList from '../MyList/MyList';


import { useDispatch, useSelector } from 'react-redux';

function App() {
    
return (
    <Router>
        <div>
            <Switch>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/create-group">
                    <CreateGroup />
                </Route>
                <Route path="/group-bucket-list">
                    <GroupBucketList />
                </Route>
                <Route path="/my-list">
                    <MyList />
                </Route>
                <Route path="/">
                    <Redirect to="/about" />
                </Route>
            </Switch>
        </div>
    </Router>
); 
}
export default App;