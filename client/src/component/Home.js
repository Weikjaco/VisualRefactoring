import React from 'react';
import Upload from './HomeSubComponents/Upload';

export class Home extends React.Component {
    render() {
        return(
            <div>
                <h2 className="text-center my-5">
                    Welcome to Visualize Refactoring <br/> 
                    <small>where visualizing a complex refactoring is made easy</small>
                </h2>
                <Upload />
            </div>
        )
    }
}
