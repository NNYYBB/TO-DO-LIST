import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, Edit, Trash, Plus, List, Moon, Sun } from 'lucide-react';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('add');

    useEffect(() => {
        fetchTasks();
    }, []);

    // Helper function to format date for input fields
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tasks');
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const addTask = async () => {
        if (!newTask || !description || !startDate || !endDate) {
            setError('All fields are required');
            return;
        }
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: newTask,
                    description,
                    start_date: startDate,
                    end_date: endDate,
                }),
            });
            if (!response.ok) throw new Error('Failed to add task');
            const createdTask = await response.json();
            setTasks([...tasks, createdTask]);
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete task');
            setTasks(tasks.filter((task) => task.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const updateTask = async () => {
        if (!newTask || !description || !startDate || !endDate) {
            setError('All fields are required');
            return;
        }
        setError('');

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: newTask,
                    description,
                    start_date: startDate,
                    end_date: endDate,
                }),
            });
            if (!response.ok) throw new Error('Failed to update task');
            const updatedTask = await response.json();
            setTasks(tasks.map((task) => (task.id === editingId ? updatedTask : task)));
            setEditingId(null);
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setNewTask('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setError('');
        setEditingId(null);
    };

    const handleEdit = (task) => {
        setNewTask(task.task);
        setDescription(task.description);
        setStartDate(formatDateForInput(task.start_date));
        setEndDate(formatDateForInput(task.end_date));
        setEditingId(task.id);
        setActiveTab('add');
    };

    return (
        <div className={`min-h-screen p-4 ${darkMode ? 'bg-[#0f172a]' : 'bg-blue-50'}`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                        ToDo APP
                    </h1>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-2 rounded-full ${darkMode ? 'hover:bg-blue-800 text-blue-300' : 'hover:bg-blue-100 text-blue-600'} transition-colors`}
                    >
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                </div>

                <div className="mb-6">
                    <div className={`flex border-b ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                        <button
                            className={`flex items-center px-4 py-2 ${
                                activeTab === 'add'
                                    ? `border-b-2 ${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                                    : `${darkMode ? 'text-blue-400' : 'text-blue-500'} hover:text-blue-700`
                            }`}
                            onClick={() => setActiveTab('add')}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Task
                        </button>
                        <button
                            className={`flex items-center px-4 py-2 ${
                                activeTab === 'list'
                                    ? `border-b-2 ${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                                    : `${darkMode ? 'text-blue-400' : 'text-blue-500'} hover:text-blue-700`
                            }`}
                            onClick={() => setActiveTab('list')}
                        >
                            <List className="w-4 h-4 mr-2" />
                            Task List
                        </button>
                    </div>
                </div>

                {activeTab === 'add' && (
                    <div className={`${darkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
                        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                            {editingId ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                    Task Name
                                </label>
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="Enter task name"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                                    ${darkMode ? 'bg-[#0f172a] border-blue-800 text-blue-200 placeholder-blue-600' : 'border-blue-300 text-blue-900 placeholder-blue-400'}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter task description"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                                    ${darkMode ? 'bg-[#0f172a] border-blue-800 text-blue-200 placeholder-blue-600' : 'border-blue-300 text-blue-900 placeholder-blue-400'}`}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                        Start Date
                                    </label>
                                    <div className="relative">
                                        <CalendarDays className={`absolute left-3 top-2.5 h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                                            ${darkMode ? 'bg-[#0f172a] border-blue-800 text-blue-200' : 'border-blue-300 text-blue-900'}`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                        End Date
                                    </label>
                                    <div className="relative">
                                        <CalendarDays className={`absolute left-3 top-2.5 h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                                            ${darkMode ? 'bg-[#0f172a] border-blue-800 text-blue-200' : 'border-blue-300 text-blue-900'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={editingId ? updateTask : addTask}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    {editingId ? 'Update Task' : 'Create Task'}
                                </button>
                                <button
                                    onClick={resetForm}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        darkMode 
                                            ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800' 
                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    }`}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'list' && (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`${darkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h3 className={`font-semibold text-lg ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                                            {task.task}
                                        </h3>
                                        <p className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
                                            {task.description}
                                        </p>
                                        <div className={`flex items-center text-sm ${darkMode ? 'text-blue-300' : 'text-blue-500'}`}>
                                            <Clock className="h-4 w-4 mr-1" />
                                            <span>
                                                {new Date(task.start_date).toLocaleDateString()} - {new Date(task.end_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(task)}
                                            className={`p-2 rounded-md transition-colors ${
                                                darkMode 
                                                    ? 'text-blue-400 hover:bg-blue-800' 
                                                    : 'text-blue-600 hover:bg-blue-50'
                                            }`}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className={`p-2 rounded-md transition-colors ${
                                                darkMode 
                                                    ? 'text-red-400 hover:bg-red-900/30' 
                                                    : 'text-red-500 hover:bg-red-50'
                                            }`}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && (
                            <div className={`text-center py-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                                No tasks found. Create one to get started!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoList;