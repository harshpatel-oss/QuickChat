import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {
  const navigate = useNavigate();
  const {selectedUser , messages, showRightSidebar, setShowRightSidebar} = useContext(ChatContext);
  const {logout , onlineUser} = useContext(AuthContext);
  const [msgImages , setMsgImages] = useState([]);

   // get all images from the messages and set them to state
   useEffect(()=>{
    setMsgImages(
      messages?.filter(msg=>msg.image).map(msg=>msg.image) || []
    )
   },[messages]);

  if(!selectedUser) return null;

  // Desktop / large screens: show as column
  const desktopPanel = (
    <div className='hidden md:block bg-[#8185B2]/10 text-white w-full relative overflow-y-auto'>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-square rounded-full'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUser.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'/>}
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>
      <hr className='border-[#ffffff50] my-4'/>
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-50 overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.length > 0 ? (
            msgImages.map((url,index)=>(
              <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
                <img src={url} alt="" className='h-full rounded-md'/>
              </div>
            ))
          ) : (
            <p className='col-span-2 text-gray-400 text-center'>No media yet</p>
          )}
        </div>
      </div>
      <div className='mt-6 flex flex-col gap-3 w-full items-center pb-6'>
        <button onClick={()=>navigate('/profile')} className='w-11/12 max-w-xs bg-white/10 text-white text-sm font-light py-2 rounded-full hover:bg-white/20 transition'>
          Edit Profile
        </button>
        <button onClick={()=>logout()} className='w-11/12 max-w-xs bg-linear-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 rounded-full cursor-pointer'>
          Logout
        </button>
      </div>
    </div>
  );

  // Mobile overlay when toggled
  const mobileOverlay = showRightSidebar ? (
    <div className='md:hidden fixed inset-0 z-50 bg-black/50 flex justify-end' onClick={()=>setShowRightSidebar(false)}>
      <div className='w-4/5 max-w-sm bg-[#0f1724] text-white h-full overflow-y-auto p-4' onClick={(e)=>e.stopPropagation()}>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-12 aspect-square rounded-full'/>
            <div>
              <p className='font-medium'>{selectedUser.fullName}</p>
              {onlineUser.includes(selectedUser._id) && <span className='text-green-500 text-xs'>Online</span>}
            </div>
          </div>
          <button onClick={()=>setShowRightSidebar(false)} className='text-gray-300'>Close</button>
        </div>
        <hr className='border-[#ffffff30] my-2'/>
        <div className='mt-2 text-xs'>
          <p>Media</p>
          <div className='mt-2 max-h-50 overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
            {msgImages.length > 0 ? (
              msgImages.map((url,index)=>(
                <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
                  <img src={url} alt="" className='h-full rounded-md'/>
                </div>
              ))
            ) : (
              <p className='col-span-2 text-gray-400 text-center'>No media yet</p>
            )}
          </div>
        </div>
        <div className='mt-6 flex flex-col gap-3'>
          <button onClick={()=>{navigate('/profile'); setShowRightSidebar(false)}} className='bg-white/10 text-white text-sm font-light py-2 rounded-full hover:bg-white/20 transition'>
            Edit Profile
          </button>
          <button onClick={()=>{logout(); setShowRightSidebar(false)}} className='bg-linear-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 rounded-full cursor-pointer'>
            Logout
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {desktopPanel}
      {mobileOverlay}
    </>
  )
}

export default RightSidebar
