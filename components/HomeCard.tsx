"use client"
import React from 'react'
import Image from 'next/image';
interface HandleCardProp {
    className:string,
    img:string,
    title:string,
    desc:string,
    handleClick:()=>void
}

const HomeCard = ({className , img , title , desc , handleClick}:HandleCardProp) => {
  return (
    <div className={`${className} px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer`}
        onClick={handleClick}
        >
            <div className='flex-center glassmorphism size-12 rounded-[10px]'>
                <Image src={img} width={27} height={27} alt='Meeting add' />

            </div>
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>{title}</h1>
                <p className='text-lg font-normal'>{desc}</p>
            </div>

        </div>
  )
}

export default HomeCard