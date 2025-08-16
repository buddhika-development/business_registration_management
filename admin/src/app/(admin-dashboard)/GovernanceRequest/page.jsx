import ApprovedRequests from '@/components/layout/GovernerSection/ApprovedRequests'
import PendingBusinesses from '@/components/layout/GovernerSection/PendingBusinesses'
import React from 'react'

const page = () => {
  return (
    <div>
      <ApprovedRequests />
      <PendingBusinesses />
    </div>
  )
}

export default page