import React from 'react'
import { Link } from 'react-router-dom';

class MenuBar extends React.Component{
    render() {
        return(
            <div>
                <nav className="navbar navbar-expand-sm navbar-dark menuBar">
                    <div className="row w-100 d-flex justify-content-between">
                        <div className="col-md-4">
                            <nav className="navbar navbar-dark transparent pl-0">
                                <span className="navbar-brand mb-0 h1">Visualize Refactoring - Python</span>
                            </nav>
                        </div>
                        <div className="col-md-8 d-flex flex-row-reverse">
                            <div className="my-auto" id="navbarNav">
                                <ul className="navbar-nav align-middle">
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/">Home </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/refactoring">Refactoring </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/about">About </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

export default MenuBar;