import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import styles from './styles.module.css'

// Type ReactNode for wrapper.
type FkuWaraiProps = {
  children: ReactNode
}

// Main Functional.
export const FukuWarai = ({ children }: FkuWaraiProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [countX, setCountX] = useState(0)
  const [countY, setCountY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const handle = ref.current as HTMLDivElement
        const deltaX = e.clientX - initialX
        const deltaY = e.clientY - initialY

        // Update the positions based on the delta values.
        setCountX(deltaX)
        setCountY(deltaY)

        // Move the element according to the delta values.
        handle.style.left = deltaX + 'px'
        handle.style.top = deltaY + 'px'
      }
    },
    [initialX, initialY, isDragging]
  )

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      // When the mouse is pressed,
      // set the dragging state to true and record the initial positions.
      setIsDragging(true)

      // The current entry positions minus the prev count value,
      // client 500 - (countX -100) = 600.
      setInitialX(e.clientX - countX)
      setInitialY(e.clientY - countY)
    },
    [countX, countY]
  )

  // This is handleMouseUp and handleTouchEnd serve both.
  const handleDragEnd = useCallback(() => {
    // When the dragging (or touch dragging) ends,
    // set the dragging state to false and update the initial positions.
    setIsDragging(false)
    setInitialX(prev => prev + countX)
    setInitialY(prev => prev + countY)
  }, [countX, countY])

  // swipable functions.

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      // When the touch is starts,
      // set the dragging state to true and record the initial touch positions.
      const touch = e.touches[0]
      setIsDragging(true)

      // Same expression as handleMouseDown.
      setInitialX(touch.clientX - countX)
      setInitialY(touch.clientY - countY)
    },
    [countX, countY]
  )

  // The touch version of handleMouseMove.
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging) {
        const elm = ref.current as HTMLDivElement
        const touch = e.touches[0]
        const deltaX = touch.clientX - initialX
        const deltaY = touch.clientY - initialY
        setCountX(deltaX)
        setCountY(deltaY)
        elm.style.left = deltaX + 'px'
        elm.style.top = deltaY + 'px'
      }
    },
    [initialX, initialY, isDragging]
  )

  useEffect(() => {
    const handle = ref.current as HTMLDivElement

    // Set up swipe events.
    handle.addEventListener('touchstart', handleTouchStart)
    handle.addEventListener('touchmove', handleTouchMove)
    handle.addEventListener('touchend', handleDragEnd)

    // Set up click events.
    handle.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleDragEnd)
    return () => {
      // Clean up swipe event.
      handle.removeEventListener('touchstart', handleTouchStart)
      handle.removeEventListener('touchmove', handleTouchMove)
      handle.removeEventListener('touchend', handleDragEnd)

      // Clean up click events.
      handle.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleDragEnd)
    }
  }, [
    handleMouseDown,
    handleTouchMove,
    handleTouchStart,
    handleMouseMove,
    handleDragEnd
  ])

  // Scrolling is off.
  const enterControll = (e: Event) => {
    e.preventDefault()
    document.body.style.overflow = 'hidden'
  }
  // Scrolling is on.
  const leaveControll = () => {
    document.body.style.overflow = 'auto'
  }

  useEffect(() => {
    // Mobile swipe as not scrolling,
    // passive is false because of prevent.
    const controle = ref.current as HTMLDivElement
    controle.addEventListener('touchstart', enterControll, { passive: false })
    controle.addEventListener('touchmove', enterControll, { passive: false })
    controle.addEventListener('touchend', leaveControll)

    return () => {
      controle.removeEventListener('touchstart', enterControll)
      controle.removeEventListener('touchmove', enterControll)
      controle.removeEventListener('touchend', leaveControll)
    }
  }, [])

  // Return sole jsx.
  return (
    <div ref={ref} id="fuku" className={styles.target}>
      {children}
    </div>
  )
}
