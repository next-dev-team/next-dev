'use client';
import {
  useTodoControllerAll,
  useTodoControllerCreate,
  useTodoControllerRemove,
  useTodoControllerUpdate,
} from '@rnr/api-counter';
import { useEffect, useRef, useState } from 'react';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [view, setView] = useState<'home' | 'dashboard'>('home');
  const [newTodo, setNewTodo] = useState('');
  const topBarRef = useRef<HTMLDivElement | null>(null);

  const { data: todos, refetch } = useTodoControllerAll();
  const { mutateAsync: createTodo } = useTodoControllerCreate();
  const { mutateAsync: updateTodo } = useTodoControllerUpdate();
  const { mutateAsync: removeTodo } = useTodoControllerRemove();

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await createTodo({
        data: {
          title: newTodo,
          completed: false,
        },
      });
      setNewTodo('');
      refetch();
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleToggleTodo = async (todo: TodoItem) => {
    try {
      await updateTodo({
        id: todo.id,
        data: {
          completed: !todo.completed,
        },
      });
      refetch();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await removeTodo({ id });
      refetch();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const openDashboard = async () => {
    setView('dashboard');
    const headerHeight = topBarRef.current?.offsetHeight || undefined;
    await (window as any).electronAPI?.setDashboardView({
      view: 'dashboard',
      port: 42000,
      headerHeight,
    });
  };

  const switchToHome = async () => {
    setView('home');
    const headerHeight = topBarRef.current?.offsetHeight || undefined;
    await (window as any).electronAPI?.setDashboardView({
      view: 'home',
      headerHeight,
    });
  };

  useEffect(() => {
    window.electronAPI.pterm(['version', 'terminal']).then((res) => {
      console.log('PTERM', res);
    });
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        ref={topBarRef}
        style={{
          position: 'relative',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #eaeaea',
          background: '#fff',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}
        >
          <button
            type="button"
            onClick={switchToHome}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: view === 'home' ? '2px solid #111827' : '2px solid transparent',
              fontWeight: view === 'home' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Home
          </button>
          <button
            type="button"
            onClick={openDashboard}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: view === 'dashboard' ? '2px solid #111827' : '2px solid transparent',
              fontWeight: view === 'dashboard' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Dashboard
          </button>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '14px',
            color: '#666',
          }}
        >
          Port: {42000}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: view === 'home' ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="card">
            <div className="title">Pinokio Running</div>

            <div
              className="todo-container"
              style={{
                margin: '20px 0',
                padding: '20px',
                border: '1px solid #eee',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '600px',
              }}
            >
              <div className="subtitle" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                Todo List
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                  placeholder="Add a new task..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTodo}
                  style={{
                    padding: '8px 16px',
                    background: '#111827',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {Array.isArray(todos) &&
                  todos.map((todo: TodoItem) => (
                    <li
                      key={todo.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px',
                        borderBottom: '1px solid #f0f0f0',
                        gap: '10px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span
                        style={{
                          flex: 1,
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? '#999' : '#333',
                        }}
                      >
                        {todo.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTodo(todo.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '18px',
                        }}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                {(!todos || todos.length === 0) && (
                  <li style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                    No tasks yet. Add one above!
                  </li>
                )}
              </ul>
            </div>

            <button
              type="button"
              className="btn"
              onClick={() => {
                console.log('Button clicked - starting pterm call');
                window.electronAPI
                  .pterm(['start ', '/Users/zila/pinokio/api/todo/start.js'])
                  .then((res) => {
                    console.log('pterm success - run applio result:', res);
                    window.electronAPI.pterm(['push', '"Todo API started"', '--sound']);
                  })
                  .catch((error) => {
                    console.error('pterm error - run applio failed:', error);
                  });
              }}
            >
              Start Todo API
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                console.log('Button clicked - starting pterm call');
                window.electronAPI
                  .pterm(['stop ', '/Users/zila/pinokio/api/todo//start.js'])
                  .then((res) => {
                    console.log('pterm stop - run applio result:', res);
                    window.electronAPI.pterm(['push', '"Todo API stopped"', '--sound']);
                  })
                  .catch((error) => {
                    console.error('pterm error - run applio failed:', error);
                  });
              }}
            >
              Stop Todo API
            </button>
          </div>
        </div>
        {/* Dashboard is handled by BrowserView in main process */}
        <div
          style={{
            width: '100%',
            height: '100%',
            display: view === 'dashboard' ? 'block' : 'none',
            background: '#fff',
          }}
        />
      </div>
    </div>
  );
}
