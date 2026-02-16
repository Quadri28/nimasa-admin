import React from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import { Link, useLocation } from 'react-router-dom'

const GlobalTaskScroller = () => {
  const {pathname}= useLocation()
  return (
    <div>
      <ScrollContainer vertical={false} className="header-links mb-2 scroller"
       style={{overflow:'scroll'}}>
        <Link to=''
          className={pathname === "/global-admin-dashboard/manage-users" 
            || pathname === '/global-admin-dashboard/admin-tasks' 
            || pathname.includes('/global-admin-dashboard/admin-tasks/edit-user') || 
            pathname.includes('/global-admin-dashboard/admin-tasks/reset-user') 
            ||  pathname.includes('/global-admin-dashboard/admin-tasks/add-user') ? "active-navigator" : null}
        >
          Manage users
        </Link>
        <Link to='operation-lock-status'
          className={pathname.includes("/global-admin-dashboard/admin-tasks/operation-lock-status") ? "active-navigator" : null}
        >
          Operation lock status
        </Link>
        <Link to='manage-roles'
          className={pathname.includes("/global-admin-dashboard/admin-tasks/manage-roles") ? "active-navigator" : null}
        >
          Manage roles
        </Link>
        <Link to='change-password'
          className={pathname.includes("/global-admin-dashboard/admin-tasks/change-password") ? "active-navigator" : null}
        >
          Change password
        </Link>
        <Link to='cooperative-approval'
          className={pathname.includes("/global-admin-dashboard/admin-tasks/cooperative-approval") ? "active-navigator" : null}
        >
          Cooperative approval
        </Link>
        <Link to='global-user-reset'
          className={pathname.includes("/global-admin-dashboard/admin-tasks/global-user-reset") ? "active-navigator" : null}
        >
          Global user reset
        </Link>
        <Link to='global-role-configuration'
          className={pathname.includes("/global-admin-dashboard/admin-tasks/global-role-configuration") ? "active-navigator" : null}
        >
          Global role config
        </Link>
        <Link to='manage-tenants'
          className={pathname.includes("/global-admin-dashboard/admin-tasks/manage-tenants") ? "active-navigator" : null}
        >
          Manage tenants
        </Link>
        <Link to='outstanding-subscription'
          className={pathname.includes("/global-admin-dashboard/admin-tasks/outstanding-subscription") ? "active-navigator" : null}
        >
          Outstanding subscription
        </Link>
        <Link to='cooperative-subscription-info'
          className={pathname.includes("/global-admin-dashboard/admin-tasks/cooperative-subscription-info") ? "active-navigator" : null}
        >
          Coop subscription info
        </Link>
        <Link to='post-coop-settlement'  className={pathname.includes("/global-admin-dashboard/admin-tasks/post-coop-settlement") ? "active-navigator" : null}
          >Post coop settlement</Link>
      </ScrollContainer>
    </div>
  )
}

export default GlobalTaskScroller
