import { useCallback, useEffect, useRef, useState } from 'react'

interface UseWebSocketOptions {
  url?: string
  onMessage?: (data: any) => void
  reconnectInterval?: number
  heartbeatInterval?: number
}

export function useWebSocket({
  url,
  onMessage,
  reconnectInterval = 5000,
  heartbeatInterval = 30000,
}: UseWebSocketOptions) {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>(undefined)
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout>(undefined)

  const connect = useCallback(() => {
    if (!url) return

    // Clean up existing connection
    if (ws.current) {
      ws.current.close()
    }

    try {
      const socket = new WebSocket(url)
      ws.current = socket

      socket.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        startHeartbeat()
      }

      socket.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        stopHeartbeat()
        // Attempt reconnect
        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval)
      }

      socket.onerror = error => {
        console.error('WebSocket error:', error)
        socket.close()
      }

      socket.onmessage = event => {
        try {
          const data = JSON.parse(event.data)
          onMessage?.(data)
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e)
        }
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
    }
  }, [url, onMessage, reconnectInterval])

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close()
      ws.current = null
    }
    setIsConnected(false)
    stopHeartbeat()
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
  }, [])

  const sendMessage = useCallback((data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [])

  const startHeartbeat = () => {
    stopHeartbeat()
    heartbeatTimeoutRef.current = setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'ping' }))
      }
    }, heartbeatInterval)
  }

  const stopHeartbeat = () => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current)
    }
  }

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    sendMessage,
  }
}
