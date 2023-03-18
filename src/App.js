import './App.css';
import { Input } from 'rsuite';
import { Button } from 'rsuite';
import { Panel } from 'rsuite';
import { Message } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { useState } from 'react';
import axios from 'axios';

function App() {

  // const axios = require("axios");
  const [update, setUpdate] = useState('');
  const [url, setUrl] = useState('');
  const [searched, setSearched] = useState(false)
  const [invalidURL, setInvalidURL] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [downloadURL, setDownloadURL] = useState('');

  const handleSearch = () => {
    setUrl(update);
    // console.log(update)
    const youtubeID = youtube_parser(update);
    // console.log(youtubeID)
    setInvalidURL(!youtubeID)
    // console.log("the url is invalid: "+!youtubeID)
    
    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: {id: youtubeID},
      headers: {
        'X-RapidAPI-Key': '54d7fd6b63msh109fa0f5ea7c4e0p176f73jsn7565d9ceafeb',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      }
    };

    if(!invalidURL){
      axios.request(options).then(function (response) {
        // console.log(response.data);
        setDownloadURL(response.data.link);
        setVideoTitle(response.data.title);
        setVideoDuration(handleTime(response.data.duration));
        setSearched(true);
        setUpdate('')
      }).catch(function (error) {
        console.error(error);
      });
    }
    
  }
  
  const handleDownload = () => {
    window.location.href = downloadURL;
  }

  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length===11)? match[7] : false;
  }

  function handleTime(total){
    var hours = Math.floor(total/3600)
    var minutes = Math.floor((total-hours*3600)/60);
    var seconds = total%60;
    minutes = minutes <= 9 ? '0' + minutes : minutes;
    seconds = seconds <= 9 ? '0' + seconds : seconds;
    return hours==0? minutes+":"+seconds: hours+":"+minutes+":"+seconds
  }

  return (
    <div className="App">
      <h2>YOUTUBE TO MP3 API TEST WITH REACT SUITE</h2>
      <div className="container">
        <Input className="input" placeholder="YouTube Video URL" onChange={value=>{setUpdate(value)}} value={update}/>
        <Button appearance="primary" onClick={handleSearch}>Search</Button>
      </div>
      <div className="center">
        {searched&&!invalidURL?
          <Panel
          className="panel"
          header={videoTitle}
          bordered>
            {/* <Placeholder.Paragraph /> */}
            <small>
              Duration: {videoDuration}
            </small>
            <Button onClick={handleDownload}>Download</Button>
          </Panel>
        :<></>}
        {invalidURL?
        <Message className="panel" showIcon type="error" header="Error">
          Invalid YouTube URL. Please try again.
        </Message>
        :<></>}
      </div>
      <div className='footer'>©Developed by Ching Yen. All rights reserved.</div>
    </div>
  );
}

export default App;
