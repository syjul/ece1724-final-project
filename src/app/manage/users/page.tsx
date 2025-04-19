"use client"

import { Suspense, useEffect, useState } from "react";
import UserList from "@/components/user/userList";
import { getUsers } from "@/lib/actions"
import Navbar from "@/components/navbar";
import Card from "@/components/ui/card_old" 
import  Link  from "next/link"
import { buttonVariants } from "@/components/ui/button";


export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])


  const getUsersContext = async (manage: boolean) => {
    try {
      const q = await getUsers(0,0)
      setUsers(q.users)
    } catch {

    }
    setLoading(false)
  }

  useEffect(()=> {
    getUsersContext(false)
  },[])

  return (
    <div>
      {
      loading? <p>Loading users...</p>:
        <div>
          <Navbar activeTab={1}/>
          <Card title="Users" content={
            <div>
                <Link className={buttonVariants({variant:"outline"})} href="/manage/users/create">Add User</Link>
                <UserList users={users}/>
            </div>
            } />
        </div>
      }
    </div>
  );
}

export const dynamic = "force-dynamic";
