import React from 'react';
import CARD from '../../assets/images/card.png';
import { LuTrendingUpDown } from 'react-icons/lu';

const AuthLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen flex">
      
      {/* Left Section */}
      <div className="md:w-[60vw] w-full px-12 pt-8 pb-12">
        <h2 className="text-3xl font-medium text-black">Spend X</h2>
        {children}
      </div>

      {/* Right Section - Card Image */}
      <div className="hidden md:block w-[40] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5'/>
        <div className='w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10' />
        <div className='w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5' />

            <div className='grid grid-cols-1 z-20'>
                <StatsInfoCard 
                    icon = {<LuTrendingUpDown /> }
                    label = "Track Your income & Expense"
                    value = "  5,60,000 /-"
                    color = "bg-primary" 
                    />
            </div>

            <div className="group relative">
              <div className="relative group">
 <img
  src={CARD}
  alt="Card"
  className="
    w-64 lg:w-[90%]
    relative top-[200px] left-10

    rounded-2xl
    shadow-[0_20px_40px_rgba(126,34,206,0.35)]

    transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
    cursor-pointer

    hover:top-[70px]
    hover:scale-[0.92]
    hover:shadow-[0_35px_70px_rgba(126,34,206,0.55)]
  "
/>
</div>
</div>

      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
      <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
        {icon}
      </div>
      <div>
        <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
        <span className="text-[20px]">₹{value}</span>
      </div>
    </div>
  );
};
