"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Notification {
  id: string
  title: string
  content: string
  type: 'ORDER' | 'EVENT' | 'ORGANIZATION' | 'SYSTEM' | 'MENTOR'
  read: boolean
  createdAt: string
}

interface AppContextType {
  notifications: Notification[]
  unreadNotifications: number
  cartCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
  markNotificationAsRead: (id: string) => void
  updateCartCount: () => void
  clearNotifications: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [cartCount, setCartCount] = useState(0)

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('ton-notifications')
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [])

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('ton-notifications', JSON.stringify(notifications))
  }, [notifications])

  // Update cart count from localStorage
  const updateCartCount = () => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      const cartItems = JSON.parse(cart)
      const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(totalItems)
    } else {
      setCartCount(0)
    }
  }

  // Load cart count on mount
  useEffect(() => {
    updateCartCount()
  }, [])

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <AppContext.Provider value={{
      notifications,
      unreadNotifications,
      cartCount,
      addNotification,
      markNotificationAsRead,
      updateCartCount,
      clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
