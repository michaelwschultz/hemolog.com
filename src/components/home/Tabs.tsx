import React, { useState } from 'react'

export interface TabsProps {
  initialValue?: string
  value?: string
  onChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export interface TabsItemProps {
  label: string
  value: string
  children: React.ReactNode
}

export function TabsItem({ children }: TabsItemProps): JSX.Element {
  return <>{children}</>
}

export function Tabs({
  initialValue,
  value,
  onChange,
  children,
  className = '',
}: TabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>(initialValue || '')

  const currentValue = value !== undefined ? value : activeTab

  const handleTabChange = (newValue: string): void => {
    if (value === undefined) {
      setActiveTab(newValue)
    }
    if (onChange) {
      onChange(newValue)
    }
  }

  const tabItems: {
    label: string
    value: string
    children: React.ReactNode
  }[] = []

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === TabsItem) {
      const {
        label,
        value: tabValue,
        children: tabChildren,
      } = child.props as TabsItemProps
      tabItems.push({ label, value: tabValue, children: tabChildren })
    }
  })

  const activeTabContent = tabItems.find(
    (item) => item.value === currentValue
  )?.children

  return (
    <>
      <div
        className={`border-b border-gray-200 dark:border-gray-700 ${className}`}
      >
        <nav className='flex space-x-8'>
          {tabItems.map((item) => {
            const isActive = item.value === currentValue

            return (
              <button
                key={item.value}
                onClick={() => handleTabChange(item.value)}
                className={`
                  whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer
                  ${
                    isActive
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
                role='tab'
                aria-selected={isActive}
                type='button'
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
      {activeTabContent}
    </>
  )
}

export interface TabsContentProps {
  children: React.ReactNode
  className?: string
}

export function TabsContent({
  children,
  className = '',
}: TabsContentProps): JSX.Element {
  return <div className={`py-6 ${className}`}>{children}</div>
}
