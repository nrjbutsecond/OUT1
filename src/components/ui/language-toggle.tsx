"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { toast } from "sonner"

export function LanguageToggle() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    // Load from localStorage on mount
    const savedLanguage = localStorage.getItem("ton-language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
      // Trigger custom event to notify other components
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: savedLanguage }))
    }
  }, [])

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("ton-language", lang)
    
    // Trigger custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }))
    
    // Show success toast
    toast.success(`Language changed to ${lang === "en" ? "English" : "Tiếng Việt"}`)
    
    // Reload page to apply language changes
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:text-red-400">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[100] bg-white border border-gray-200 shadow-xl">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("en")}
          className={`text-gray-900 hover:bg-gray-100 cursor-pointer ${language === "en" ? "bg-red-50 text-red-600" : ""}`}
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("vi")}
          className={`text-gray-900 hover:bg-gray-100 cursor-pointer ${language === "vi" ? "bg-red-50 text-red-600" : ""}`}
        >
          🇻🇳 Tiếng Việt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
