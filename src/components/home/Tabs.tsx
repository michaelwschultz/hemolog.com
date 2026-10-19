import React, { type ReactElement, useState } from 'react'

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

export function TabsItem({ children }: TabsItemProps): ReactElement {
  return <>{children}</>
}

export function Tabs({
  initialValue,
  value,
  onChange,
  children,
  className = '',
}: TabsProps): ReactElement {
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
      <div className={className}>
        <nav className='inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-white p-1'>
          {tabItems.map((item) => {
            const isActive = item.value === currentValue

            return (
              <button
                key={item.value}
                onClick={() => handleTabChange(item.value)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'bg-ink text-white' : 'text-slate hover:text-ink'
                }`}
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
