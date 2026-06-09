import { useRef ,useEffect } from 'react'
import React  from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { useState } from 'react'
const ChatContainer = () => {
  const {messages , selectedUser ,setSelectedUser,sendMessage ,
    getMessages, setShowRightSidebar }=useContext(ChatContext);
    const { authUser , onlineUser}=useContext(AuthContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [sending, setSending] = useState(false);
    const scrollEnd = useRef()

    const [input,setInput] = useState('')

    //Handle Sending a Message
    const handleSendMessage = async(e)=>{
      e.preventDefault();
      if(selectedImage){
        await sendImage();
        return;
      }
      if(input.trim()==="")return null;
      setSending(true);
      try{
      await sendMessage({text:input.trim()});
      setInput("")
      }finally{
        setSending(false);
      }
    }

    //Select image for preview (do not send immediately)
    const handleSelectImage = async(e)=>{
      const file = e.target.files[0];
      if(!file || !file.type.startsWith("image/")){
        // optional: use toast but avoid importing again
        return;
      }
      const reader = new FileReader();
      reader.onloadend = ()=>{
        setSelectedImage(reader.result);
        e.target.value = "";
      }
      reader.readAsDataURL(file);
    }

    const sendImage = async ()=>{
      if(!selectedImage) return;
      setSending(true);
      await sendMessage({image:selectedImage});
      setSelectedImage(null);
      setSending(false);
    }

   useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id);
    }
   },[selectedUser]) 

   useEffect(()=>{
     if(scrollEnd.current  && messages){
      scrollEnd.current.scrollIntoView({behavior:'smooth'})
     }
   },[])
  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'> 
      { /* ------- header --------- */}
         <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                 <img src = {selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 rounded-full"/>
                 <p className='flex-1 text-lg text-white flex items-center gap-2'>{selectedUser.fullName}
                   {onlineUser.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
                 </p>
                 <img onClick={()=>setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
                 <button onClick={()=>setShowRightSidebar(true)} className='md:hidden p-2 rounded-md hover:bg-white/10'>
                  <img src={assets.help_icon} alt="info" className='w-5' />
                 </button>
                 <img src={assets.help_icon} alt="" className='hidden md:block max-w-5' />
            </div>
         {/* ------- chat area ------- */}
         <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-24'>
            {messages && messages.length > 0 ? (
              messages.map((msg,index)=>(
                msg && <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                  {msg.image ?(
                    <img src = {msg.image} alt="" className=' max-w-[75%] md:max-w-sm border border-gray-700 rounded-lg overflow-hidden mb-8'/>
                  ):(
                  <p className={`p-2 max-w-[75%] md:max-w-xs md:text-sm font-light rounded-lg mb-8 break-all 
                    bg-violet-500/30 text-white ${msg.senderId === authUser._id? 
                      'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                  )}
                  <div className='text-center text-xs'>
                        <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} 
                        alt="" className='w-7 rounded-full'/>
                        <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : <p className='text-gray-400 text-center'>No messages yet</p>}
            <div ref={scrollEnd}> 
            </div>

            {/* ------- bottom area -------- */}
            <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
                  <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input onChange={(e)=>setInput(e.target.value)} value={input}
                     onKeyDown={(e)=>e.key === "Enter" ? handleSendMessage(e):null}
                     type="text" placeholder="Send a message" className='flex-1 text-sm p-3 border-none rounded-lg outline-none
                    text-white placeholder-gray-400'/>
                    <input onChange={handleSelectImage} type="file" id='image' accept='image/png , image/jpeg' hidden/>
                    <label htmlFor='image'>
                        <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
                    </label>
                    {selectedImage && (
                      <div className='ml-2 flex items-center gap-2'>
                        <img src={selectedImage} alt='preview' className='w-10 h-10 object-cover rounded-md'/>
                        <button onClick={()=>setSelectedImage(null)} className='text-sm text-gray-300'>Remove</button>
                      </div>
                    )}
                  </div>
                  <button onClick={handleSendMessage} disabled={sending} className={`flex items-center justify-center w-10 h-10 cursor-pointer ${sending ? 'bg-blue-600 animate-pulse rounded-full' : ''}`}>
                    <img src={assets.send_button} alt="send" className='w-7' />
                  </button>
            </div>
         </div>
    </div>
  ) : (
      <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} className='max-w-16' alt=""/>
        <p className= 'text-lg font-medium text-white'>Chat anytime , anywhere</p>
      </div>
  )
}

export default  ChatContainer
