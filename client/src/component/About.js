import React from 'react';

const About = () => {
    return (
        <>
            <div className="container mt-5">
                <h2>Usage Instructions:</h2>
                <h5>
                    <li>
                        Navigate to the <i>Home</i> page and upload the Python files of your project and the excel
                        file containing the move commands.
                    </li>
                    <li>
                        Once the Java processes are finished running, navigate to the <i>Refactoring</i> page to view
                        the before and after code. The code can be viewed from the package level and class level
                        by using the navigation panel.
                    </li>
                </h5>
            </div>
        </>
    )
};

export default About;