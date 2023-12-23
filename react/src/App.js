import logo from './logo.svg';
import './App.css';
import DefaultLayout from './components/Layouts/DefaultLayout';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { publicRoutes } from './routes';
import { Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useParams } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          { publicRoutes.map((route, index) =>{
            let Layout = DefaultLayout;
            if(route.layout){
              Layout = route.layout;
            }
            else if(route.layout === null){
              Layout = Fragment;
            }
            const Page = route.component;

            return <Route key={index} path={route.path} element={
              <Layout>
                <Page props_paramenter = {route.props}/>
              </Layout>
            }/>
          }
          )}
        </Routes>
      </div>
    </Router>
      
  );
}
export default App;

