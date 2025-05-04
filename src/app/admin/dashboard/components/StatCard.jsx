import Link from 'next/link'
import React from 'react'

export default function StatCard({link,title,icon,value}) {
  return (
    <Link href={link}>
        <div className="p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
            <div className="flex justify-between">
                <h3 className="text-sm md:text-md font-semibold">{title}</h3>
                {icon}
            </div>
            <p className="font-bold">{value}</p>
        </div>
    </Link>
  )
}
