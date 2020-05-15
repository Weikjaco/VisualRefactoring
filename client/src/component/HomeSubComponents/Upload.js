import React, { Fragment, useState } from 'react';
import Progress from './Progress';
import axios from 'axios';

const Upload = () => {

  const [file, setFile] = useState([]);
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState('');
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onFileChange = e => {

    // Add files to file
    let file_items = Object.values(e.target.files);
    setFile(file_items);

    // Get filenames from file
    const fileNames = file_items.map(item => item.name);
    setFilename(fileNames.join(', '));

  };

  const onSubmit = async e => {

    e.preventDefault();
    const formData = new FormData();

    // Append filenames to form data
    file.map(file => formData.append(file.name, file));

    try {
      const res = await axios.post('/upload', formData, { //URL, DATA, PARAMETERS
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
          // Clear percentage bar after 10 seconds
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      setMessage('File Uploaded Successfully!');

      // Make uploaded file names a string and store in uploadedfile to later be used in html
      let fileNamesUploaded = res.data.filesUploaded.join(", ");
      setUploadedFile(fileNamesUploaded);

    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <div className='container'>
          <div className='row justify-content-md-center'>
            <small className="mt-5 pt-3 mb-0 pb-0">Please upload your <u>Python</u> project below</small>
          </div>
          <div className='row justify-content-md-center'>
            <div className='custom-file col-md-6'>
              <input type='file' className='' id='customFile' multiple onChange={onFileChange}/>
              <label className='custom-file-label' htmlFor='customFile'> {filename} </label>
            </div>
          </div>
          <div className='row justify-content-md-center mt-2'>
            <div className='custom-file col-md-6 p-0'>
              <Progress percentage={uploadPercentage} />
            </div>
          </div>
          <p className="row justify-content-md-center p-0 m-0">{message}</p><br/>
          <div className='row justify-content-md-center'>
            <div className='custom-file col-md-3'>
              <input type='submit' value='Upload' className='btn btn-primary btn-block'/>
            </div>
          </div>
        </div>
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile}</h3>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default Upload;