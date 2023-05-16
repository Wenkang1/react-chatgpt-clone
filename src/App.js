import { useState,useEffect } from "react"
// import request from "request";
import axios from 'axios';
import { Avatar, List, Tag, Button, Menu } from 'antd';
import { SendOutlined } from '@ant-design/icons';


const App = () => {

  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)
  const [loading, setLoading] = useState(false)

  const createNewChat = () => {
    setMessage(null)
    setValue('')
    setCurrentTitle(null)

  }

  const handleClick = (uniqueTitle) => {
    setMessage(null)
    setValue('')
    setCurrentTitle(uniqueTitle);
  }

  // console.log(previousChat)

  const getMessages = async () =>{
    setLoading(true)
    axios.post('http://localhost:8001/completions', 
      {
        message : value
      },
      {
        headers:{
        "Content-Type": "application/json"
      }
      }).then( (response) => {
        // console.log('setMessage' + JSON.stringify(response.data.choices[0].message))
        setMessage(response.data.choices[0].message)
        setValue(value)
        setLoading(false)
      }).catch( (error) => {
        console.error(error.status + error)
        alert('Error, try later')
        setLoading(false)
      })
      
    }

  useEffect(() => {
    // console.log(currentTitle, value, message)
    if (!currentTitle && value && message){
      console.log('set title to ' + value)
      setCurrentTitle(value)
    }
    if (currentTitle && value && message){
      setPreviousChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role:"you",
            content: value
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content
        }
      ]
      ))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message,currentTitle] )

  const currenChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  // console.log(previousChat)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  // console.log(currenChat)
  return (
    <div className="App">
      <section className="side-bar">
      <Button ghost onClick={createNewChat}>+ New Chat</Button>
        <ul className="history">
          
          {uniqueTitles?.map((uniqueTitle, index) => <li bordered={false} color="geekblue" key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <List.Item.Meta
            avatar={
              <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel`} />
            }
            title={<a href="https://github.com/Wenkang1">{"made by Wenkang"}</a>}
            description="A chatGPT clone with antd-UI"
          />
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>FanQiangGPT</h1>}
        <ul className="feed">
          {currenChat?.map((chatMessage, index) => 
          <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>
          )}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <Button ghost id="submit" onClick={getMessages} loading={loading} icon={<SendOutlined />}>submit</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
