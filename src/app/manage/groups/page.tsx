"use client"

import { Suspense, useEffect, useState } from "react";
import { getGroups } from "@/lib/actions"
import Navbar from "@/components/navbar";
import Card from "@/components/ui/card_old" 
import  Link  from "next/link"
import { buttonVariants } from "@/components/ui/button";
import GroupList from "@/components/group/groupList";


export default function Groups() {
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState([])


  const getGroupContext = async (manage: boolean) => {
    try {
      const q = await getGroups(0,0)
      setGroups(q.groups)
    } catch {

    }
    setLoading(false)
  }

  useEffect(()=> {
    getGroupContext(false)
  },[])

  return (
    <div>
      {
      loading? <p>Loading groups...</p>:
        <div>
          <Navbar activeTab={2}/>
          <Card title="Groups" content={
            <div>
                <Link className={buttonVariants({variant:"outline"})} href="/manage/groups/create">Add Group</Link>
                <GroupList groups={groups}/>
            </div>
            } />
        </div>
      }
    </div>
  );
}

export const dynamic = "force-dynamic";