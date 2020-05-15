import React, {useState} from 'react';
import SideNav from './RefactoringSubComponents/SideNav';
import jsonData from '../upload/jsonData.json';
import "./styling.css";

const Refactoring = () => {
    const [selectedItem, selectItem] = useState(null)
    const [{umlImgBefore, umlImgAfter}, setPackages] = useState({})

    // Get data of files uploaded
    const getJSONFileData = () => {
        let files  = Object.entries(jsonData);
        let newData = files.map(file => file[1].data).flat();
        return newData;
    };

    const onSetPackages = obj => {
        setPackages(obj)
    };

    return (
        <>
            <div className="content-grid bg">
                <div className="sideNav pt-2">
                    <h5 className="ml-1 mt-0">Navigation Panel</h5>
                    <SideNav data={getJSONFileData()} onLinkClick={selectItem} setPackages={onSetPackages} />
                </div>
                {/* Before */}
                <div className="mt-4">
                    
                    <h4 className="text-light mb-4">Code Before:</h4>
                    {umlImgBefore ? (
                        <div>
                            <img src={umlImgBefore}  alt={"Image Not Found"}/>
                        </div>
                    ) : null}
                    <pre className="codeBlock text-light">
                        {selectedItem?.beforeCode}
                    </pre>
                </div>
                {/* After */}
                <div className="mt-4">
                    <h4 className="text-light mb-4">Code After:</h4>
                    {umlImgAfter ? (
                        <div>
                            <img src={umlImgAfter}  alt={"Image Not Found"}/>
                        </div>
                    ) : null}
                    <pre className="codeBlock text-light"> 
                        {selectedItem?.afterCode}   
                    </pre>
                </div>
            </div>
        </>
    )
};

export default Refactoring;