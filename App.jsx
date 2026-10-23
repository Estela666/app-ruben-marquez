import React, { useState, useEffect } from 'react';
import {
import { db } from "./firebaseasa"; 
  Calendar as CalendarIcon, 
  Users, 
  CreditCard, 
  Lock, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Clock, 
  User, 
  ShieldAlert,
  RefreshCw,
  Key,
  Check,
  Mail,
  Phone,
  Settings,
  AlertOctagon,
  LogOut
} from 'lucide-react';

const INITIAL_TRAINERS = ['Rubén Márquez', 'Facundo', 'Mónica', 'Georgina', 'Martín'];

const INITIAL_CLIENTS = [
  { id: '1', name: 'Carlos Rodríguez', email: 'carlos@example.com', phone: '612345678', plan: 8, remainingClasses: 6, paid: true, assignedTrainer: 'Rubén Márquez', notes: 'Lesión leve de rodilla' },
  { id: '2', name: 'Ana Martínez', email: 'ana@example.com', phone: '622345679', plan: 4, remainingClasses: 1, paid: true, assignedTrainer: 'Mónica', notes: 'Turnos rotativos' },
  { id: '3', name: 'David Gómez', email: 'david@example.com', phone: '633345680', plan: 'Indefinido', remainingClasses: '∞', paid: true, assignedTrainer: 'Facundo', notes: 'Socio VIP' },
  { id: '4', name: 'Laura Sánchez', email: 'laura@example.com', phone: '644345681', plan: 8, remainingClasses: 2, paid: false, assignedTrainer: 'Georgina', notes: 'Pendiente de transferencia' },
  { id: '5', name: 'Javier López', email: 'javier@example.com', phone: '655345682', plan: 4, remainingClasses: 0, paid: false, assignedTrainer: 'Martín', notes: 'Bono agotado' },
];

const INITIAL_SESSIONS = [
  { id: 's1', clientId: '1', clientName: 'Carlos Rodríguez', trainer: 'Rubén Márquez', date: new Date().toISOString().split('T')[0], time: '09:00' },
  { id: 's2', clientId: '2', clientName: 'Ana Martínez', trainer: 'Mónica', date: new Date().toISOString().split('T')[0], time: '10:00' },
  { id: 's3', clientId: '3', clientName: 'David Gómez', trainer: 'Facundo', date: new Date().toISOString().split('T')[0], time: '17:00' },
];

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function App() {
  const [clients, setClients] = useState([]);
    
  });

  const [trainers, setTrainers] = useState(() => {
    const saved = localStorage.getItem('rma_trainers');
    return saved !== null ? JSON.parse(saved) : INITIAL_TRAINERS;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('rma_sessions');
    return saved !== null ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('rma_admin_pw') || '1234';
  });

  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'clients_admin', 'athlete_view', 'settings'
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [targetTabAfterLogin, setTargetTabAfterLogin] = useState('clients_admin');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirmar',
    isDanger: true
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Athlete view selection
  const [selectedAthleteId, setSelectedAthleteId] = useState('');

  useEffect(() => {
    if (clients.length > 0 && (!selectedAthleteId || !clients.some(c => c.id === selectedAthleteId))) {
      setSelectedAthleteId(clients[0].id);
    } else if (clients.length === 0) {
      setSelectedAthleteId('');
    }
  }, [clients, selectedAthleteId]);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Session Modal State
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    clientId: '',
    trainer: '',
    date: '',
    time: '09:00'
  });

  // Client Modal State
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 8,
    remainingClasses: 8,
    paid: true,
    assignedTrainer: '',
    notes: ''
  });

  // Password Change State
  const [currentPwForm, setCurrentPwForm] = useState('');
  const [newPwForm, setNewPwForm] = useState('');
  const [confirmPwForm, setConfirmPwForm] = useState('');
  const [pwChangeMessage, setPwChangeMessage] = useState({ type: '', text: '' });

  useEffect(() => {
  useEffect(() const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => { setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); });
  return unsubscribe; }, []);

  useEffect(() => {
    localStorage.setItem('rma_trainers', JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem('rma_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('rma_admin_pw', adminPassword);
  }, [adminPassword]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAdminLoggedIn(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError('');
      setActiveTab(targetTabAfterLogin);
    } else {
      setPasswordError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    if (activeTab === 'clients_admin' || activeTab === 'settings') {
      setActiveTab('calendar');
    }
  };

  const openAdminTab = (tabName) => {
    if (!isAdminLoggedIn) {
      setTargetTabAfterLogin(tabName);
      setShowPasswordModal(true);
    } else {
      setActiveTab(tabName);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (currentPwForm !== adminPassword) {
      setPwChangeMessage({ type: 'error', text: 'La contraseña actual no es correcta.' });
      return;
    }
    if (!newPwForm.trim()) {
      setPwChangeMessage({ type: 'error', text: 'La nueva contraseña no puede estar vacía.' });
      return;
    }
    if (newPwForm !== confirmPwForm) {
      setPwChangeMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    setAdminPassword(newPwForm);
    setCurrentPwForm('');
    setNewPwForm('');
    setConfirmPwForm('');
    setPwChangeMessage({ type: 'success', text: '¡Contraseña de administrador actualizada correctamente!' });
  };

  const handleResetAllData = () => {
    setConfirmModal({
      isOpen: true,
      title: '⚠️ ¿Borrar todos los datos?',
      message: 'Esta acción borrará definitivamente TODOS los deportistas registrados y todas las sesiones del calendario. ¿Estás seguro?',
      confirmText: 'Sí, Borrar Todo',
      isDanger: true,
      onConfirm: () => {
        setClients([]);
        setSessions([]);
        localStorage.removeItem('rma_clients');
        localStorage.removeItem('rma_sessions');
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        triggerToast('Base de datos reseteada por completo');
      }
    });
  };

  // Hours array 07:00 -> 21:00
  const HOURS = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 7;
    return `${hour < 10 ? '0' : ''}${hour}:00`;
  });

  const handlePrevMonth = () => {
    setCurrentCalendarDate(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const handleTodayCalendar = () => {
    const now = new Date();
    setCurrentCalendarDate({ year: now.getFullYear(), month: now.getMonth() });
    setSelectedDate(now.toISOString().split('T')[0]);
  };

  // Generate days array for current month grid
  const getDaysInMonthGrid = () => {
    const { year, month } = currentCalendarDate;
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    // Adjust to European Monday-first format (Monday: 0, Sunday: 6)
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    
    // Padding from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      days.push({
        dayNumber: prevMonthDays - i,
        isCurrentMonth: false,
        dateStr: null
      });
    }

    // Days in current month
    for (let d = 1; d <= totalDays; d++) {
      const monthFormatted = (month + 1).toString().padStart(2, '0');
      const dayFormatted = d.toString().padStart(2, '0');
      const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;
      days.push({
        dayNumber: d,
        isCurrentMonth: true,
        dateStr: dateStr
      });
    }

    // Padding for next month to complete grid
    const remainingSlots = 42 - days.length; // 6 rows of 7
    for (let i = 1; i <= (remainingSlots < 7 ? remainingSlots : remainingSlots % 7); i++) {
      days.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateStr: null
      });
    }

    return days;
  };

  const handleOpenAddSession = (time) => {
    if (clients.length === 0) {
      triggerToast('⚠️ Registra primero un deportista antes de agendar.');
      return;
    }
    setEditingSession(null);
    setSessionForm({
      clientId: clients[0]?.id || '',
      trainer: trainers[0] || 'Rubén Márquez',
      date: selectedDate,
      time: time
    });
    setShowSessionModal(true);
  };

  const handleOpenEditSession = (session) => {
    setEditingSession(session);
    setSessionForm({
      clientId: session.clientId,
      trainer: session.trainer,
      date: session.date,
      time: session.time
    });
    setShowSessionModal(true);
  };

  const handleSaveSession = (e) => {
    e.preventDefault();
    if (!sessionForm.clientId) return;

    const client = clients.find(c => c.id === sessionForm.clientId);
    if (!client) return;

    if (editingSession) {
      setSessions(prev => prev.map(s => s.id === editingSession.id ? {
        ...s,
        clientId: client.id,
        clientName: client.name,
        trainer: sessionForm.trainer,
        date: sessionForm.date,
        time: sessionForm.time
      } : s));
      triggerToast('Sesión actualizada correctamente');
    } else {
      if (client.plan !== 'Indefinido' && Number(client.remainingClasses) <= 0) {
        triggerToast(`⚠️ ${client.name} no tiene clases disponibles.`);
        return;
      }

      const newSession = {
        id: Date.now().toString(),
        clientId: client.id,
        clientName: client.name,
        trainer: sessionForm.trainer,
        date: sessionForm.date,
        time: sessionForm.time
      };

      setSessions(prev => [...prev, newSession]);

      if (client.plan !== 'Indefinido') {
        setClients(prev => prev.map(c => {
          if (c.id === client.id) {
            return {
              ...c,
              remainingClasses: Math.max(0, Number(c.remainingClasses) - 1)
            };
          }
          return c;
        }));
      }
      triggerToast('Clase agendada con éxito');
    }

    setShowSessionModal(false);
  };

  const handleDeleteSession = (sessionId) => {
    const sessionToDelete = sessions.find(s => s.id === sessionId);
    if (!sessionToDelete) return;

    setConfirmModal({
      isOpen: true,
      title: 'Cancelar Reserva',
      message: `¿Cancelar la clase de ${sessionToDelete.clientName} el ${sessionToDelete.date} a las ${sessionToDelete.time}? Se le devolverá 1 clase a su bono.`,
      confirmText: 'Sí, Cancelar Clase',
      isDanger: true,
      onConfirm: () => {
        const client = clients.find(c => c.id === sessionToDelete.clientId);
        if (client && client.plan !== 'Indefinido') {
          setClients(prev => prev.map(c => {
            if (c.id === client.id) {
              return {
                ...c,
                remainingClasses: Number(c.remainingClasses) + 1
              };
            }
            return c;
          }));
        }

        setSessions(prev => prev.filter(s => s.id !== sessionId));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        triggerToast('Clase cancelada y devuelta al bono');
      }
    });
  };

  const handleOpenAddClient = () => {
    setEditingClient(null);
    setClientForm({
      name: '',
      email: '',
      phone: '',
      plan: 8,
      remainingClasses: 8,
      paid: true,
      assignedTrainer: trainers[0] || 'Rubén Márquez',
      notes: ''
    });
    setShowClientModal(true);
  };

  const handleOpenEditClient = (client) => {
    setEditingClient(client);
    setClientForm({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      plan: client.plan,
      remainingClasses: client.remainingClasses,
      paid: client.paid,
      assignedTrainer: client.assignedTrainer || trainers[0] || 'Rubén Márquez',
      notes: client.notes || ''
    });
    setShowClientModal(true);
  };

  const handleSaveClient = (e) => {
    e.preventDefault();
    if (!clientForm.name.trim()) return;

    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? {
        ...c,
        ...clientForm,
        remainingClasses: clientForm.plan === 'Indefinido' ? '∞' : (isNaN(Number(clientForm.remainingClasses)) ? clientForm.remainingClasses : Number(clientForm.remainingClasses))
      } : c));

      setSessions(prev => prev.map(s => s.clientId === editingClient.id ? { ...s, clientName: clientForm.name } : s));
      triggerToast('Deportista actualizado');
    } else {
      const newClient = {
        id: Date.now().toString(),
        ...clientForm,
        remainingClasses: clientForm.plan === 'Indefinido' ? '∞' : Number(clientForm.remainingClasses)
      };
      setClients(prev => [...prev, newClient]);
      triggerToast('Nuevo deportista guardado');
    }

    setShowClientModal(false);
  };

  const handleDeleteClient = (id) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Deportista',
      message: `¿Estás seguro de eliminar a "${client.name}"? Se borrarán también todas sus citas agendadas en la agenda.`,
      confirmText: 'Eliminar Definitivamente',
      isDanger: true,
      onConfirm: () => {
        setClients(prev => prev.filter(c => c.id !== id));
        setSessions(prev => prev.filter(s => s.clientId !== id));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        triggerToast('Deportista eliminado');
      }
    });
  };

  const handleClearDemoClients = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Vaciar lista de deportistas',
      message: '¿Quieres eliminar TODOS los deportistas registrados para empezar la lista limpia desde cero?',
      confirmText: 'Vaciar Todo',
      isDanger: true,
      onConfirm: () => {
        setClients([]);
        setSessions([]);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        triggerToast('Lista de deportistas vaciada');
      }
    });
  };

  const handleTogglePaymentStatus = (clientId) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, paid: !c.paid } : c));
    triggerToast('Estado de pago actualizado');
  };

  const handleResetClientQuota = (client) => {
    const defaultClasses = client.plan === 'Indefinido' ? '∞' : Number(client.plan);
    setClients(prev => prev.map(c => c.id === client.id ? {
      ...c,
      remainingClasses: defaultClasses,
      paid: true
    } : c));
    triggerToast(`Bono renovado para ${client.name}`);
  };

  const selectedAthlete = clients.find(c => c.id === selectedAthleteId);
  const selectedAthleteSessions = sessions.filter(s => s.clientId === selectedAthleteId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative">
      
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      {}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-2xl shadow-lg shadow-amber-500/20 text-slate-950">
              <Dumbbell className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Rubén Márquez Alberca
              </h1>
              <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
                Centro de Rendimiento Deportivo
              </p>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Agenda</span>
            </button>

            <button
              onClick={() => setActiveTab('athlete_view')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'athlete_view'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Mi Bono</span>
            </button>

            <button
              onClick={() => openAdminTab('clients_admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'clients_admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Gestión Pagos</span>
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
            </button>

            <button
              onClick={() => openAdminTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Ajustes</span>
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
            </button>

            {isAdminLoggedIn && (
              <button
                onClick={handleAdminLogout}
                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
                title="Cerrar sesión de administrador"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* TAB 1: AGENDA CON CALENDARIO MES/AÑO COMPLETO */}
        {}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            
            {/* Full Calendar Control Section */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              
              {/* Header: Month and Year selector + navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white capitalize">
                      {MONTH_NAMES[currentCalendarDate.month]} {currentCalendarDate.year}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Haz clic en cualquier día para agendar y ver reservas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-colors"
                    title="Mes Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Dropdowns for Month and Year quick jump */}
                  <select
                    value={currentCalendarDate.month}
                    onChange={(e) => setCurrentCalendarDate({ ...currentCalendarDate, month: Number(e.target.value) })}
                    className="bg-slate-950 border border-slate-700 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {MONTH_NAMES.map((name, idx) => (
                      <option key={idx} value={idx}>{name}</option>
                    ))}
                  </select>

                  <select
                    value={currentCalendarDate.year}
                    onChange={(e) => setCurrentCalendarDate({ ...currentCalendarDate, year: Number(e.target.value) })}
                    className="bg-slate-950 border border-slate-700 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleNextMonth}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-colors"
                    title="Mes Siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleTodayCalendar}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-xl text-xs transition-colors ml-1 shadow-md"
                  >
                    Hoy
                  </button>
                </div>
              </div>

              {/* Month Grid */}
              <div>
                {/* Weekday labels */}
                <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                  {WEEKDAYS.map((wd, i) => (
                    <div key={i} className="py-1">{wd}</div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 pt-2">
                  {getDaysInMonthGrid().map((item, idx) => {
                    if (!item.isCurrentMonth) {
                      return (
                        <div key={idx} className="h-14 sm:h-16 p-1 bg-slate-950/20 rounded-xl opacity-30 text-xs text-slate-600 border border-transparent">
                          <span>{item.dayNumber}</span>
                        </div>
                      );
                    }

                    const isSelected = item.dateStr === selectedDate;
                    const isToday = item.dateStr === todayStr;
                    const daySessionsCount = sessions.filter(s => s.date === item.dateStr).length;

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(item.dateStr)}
                        className={`h-14 sm:h-16 p-1.5 rounded-2xl border text-left transition-all flex flex-col justify-between relative group ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg ring-1 ring-amber-500'
                            : isToday
                            ? 'bg-slate-800 border-amber-500/50 text-amber-300'
                            : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className={`text-xs font-bold rounded-lg px-1.5 py-0.5 ${
                            isSelected ? 'bg-amber-500 text-slate-950' : isToday ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300'
                          }`}>
                            {item.dayNumber}
                          </span>

                          {daySessionsCount > 0 && (
                            <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full">
                              {daySessionsCount}
                            </span>
                          )}
                        </div>

                        {daySessionsCount > 0 && (
                          <div className="w-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span className="text-[10px] text-amber-300 truncate font-medium">
                              {daySessionsCount} {daySessionsCount === 1 ? 'cita' : 'citas'}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Selected Date Header Display */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Entrenamientos para el día:</span>
                  <h3 className="text-lg font-black text-white">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (e.target.value) {
                      const d = new Date(e.target.value + 'T00:00:00');
                      setCurrentCalendarDate({ year: d.getFullYear(), month: d.getMonth() });
                    }
                  }}
                  className="bg-slate-950 border border-slate-700 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Hourly Schedule Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {HOURS.map(hour => {
                const hourSessions = sessions.filter(s => s.date === selectedDate && s.time === hour);

                return (
                  <div key={hour} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                      <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-base">
                        <Clock className="w-4 h-4" />
                        <span>{hour}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {hourSessions.length} {hourSessions.length === 1 ? 'persona' : 'personas'}
                      </span>
                    </div>

                    <div className="py-3 space-y-2.5 flex-1">
                      {hourSessions.length === 0 ? (
                        <p className="text-xs text-slate-600 italic py-2">Sin entrenamientos agendados</p>
                      ) : (
                        hourSessions.map(session => (
                          <div key={session.id} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 flex justify-between items-start gap-2">
                            <div>
                              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-amber-400" />
                                {session.clientName}
                              </div>
                              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <span className="text-slate-500">Entrenador:</span> 
                                <span className="text-slate-200 font-medium">{session.trainer}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditSession(session)}
                                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors"
                                title="Editar cita"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSession(session.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
                                title="Cancelar reserva"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenAddSession(hour)}
                      className="w-full mt-2 py-2 px-3 bg-slate-800/60 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-semibold text-xs rounded-xl border border-amber-500/20 hover:border-amber-500 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Agendar Deportista</span>
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: VISTA DEL DEPORTISTA */}
        {}
        {activeTab === 'athlete_view' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Athlete Selector */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="text-sm font-bold text-slate-300">Consulta tu perfil de deportista:</label>
              <select
                value={selectedAthleteId}
                onChange={(e) => setSelectedAthleteId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm w-full sm:w-auto focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {selectedAthlete ? (
              <div className="space-y-6">
                
                {/* Warning Notification if <= 2 classes remaining */}
                {selectedAthlete.plan !== 'Indefinido' && Number(selectedAthlete.remainingClasses) <= 2 && (
                  <div className="bg-amber-500/10 border-2 border-amber-500/40 p-4 rounded-2xl flex items-start gap-3.5 animate-pulse">
                    <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-300 text-sm">¡Aviso de Renovación de Bono!</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Te quedan únicamente <span className="font-bold text-amber-400">{selectedAthlete.remainingClasses} clases</span> en tu cuota actual. Por favor, realiza el pago del siguiente bono con Rubén para no interrumpir tus sesiones.
                      </p>
                    </div>
                  </div>
                )}

                {/* Athlete Card */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <h2 className="text-2xl font-black text-white">{selectedAthlete.name}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Entrenador asignado: <span className="text-amber-400 font-semibold">{selectedAthlete.assignedTrainer || 'Rubén Márquez'}</span></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                        selectedAthlete.paid 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {selectedAthlete.paid ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <XCircle className="w-3.5 h-3.5" />}
                        {selectedAthlete.paid ? 'Cuota Pagada' : 'Pago Pendiente'}
                      </span>
                    </div>
                  </div>

                  {/* Class Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 text-center space-y-1">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tipo de Bono / Tarifa</span>
                      <p className="text-xl font-bold text-white">
                        {selectedAthlete.plan === 'Indefinido' ? 'Indefinido / Ilimitado' : `${selectedAthlete.plan} Clases / Mes`}
                      </p>
                    </div>

                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 text-center space-y-1">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Clases Disponibles</span>
                      <p className="text-3xl font-black font-mono text-amber-400">
                        {selectedAthlete.remainingClasses}
                      </p>
                    </div>
                  </div>

                  {/* Scheduled Sessions list for athlete */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-amber-400" />
                      Tus Próximas Clases Agendadas:
                    </h3>

                    {selectedAthleteSessions.length === 0 ? (
                      <p className="text-xs text-slate-500 italic bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                        No tienes ninguna clase programada en el calendario.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedAthleteSessions.map(s => (
                          <div key={s.id} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">{s.time}</span>
                              <span className="text-slate-200 font-semibold">{s.date}</span>
                            </div>
                            <span className="text-slate-400">Con: <strong className="text-slate-200">{s.trainer}</strong></span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-center py-8 text-slate-500">No se ha seleccionado ningún deportista.</p>
            )}

          </div>
        )}

        {/* TAB 3: GESTIÓN Y CONTROL DE PAGOS (ADMIN) */}
        {}
        {activeTab === 'clients_admin' && isAdminLoggedIn && (
          <div className="space-y-6">
            
            {/* Admin Table Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  Control y Edición de Deportistas y Pagos
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Modifica cualquier dato en cualquier momento (nombre, email, cuota, clases restantes y pagos).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {clients.length > 0 && (
                  <button
                    onClick={handleClearDemoClients}
                    className="bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5"
                    title="Borrar todos los deportistas actuales para empezar desde cero"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Vaciar deportistas</span>
                  </button>
                )}
                <button
                  onClick={handleOpenAddClient}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Añadir Deportista</span>
                </button>
              </div>
            </div>

            {/* Main Table */}
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/80 text-xs font-semibold uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Deportista</th>
                      <th className="px-5 py-4">Contacto</th>
                      <th className="px-5 py-4">Tarifa / Bono</th>
                      <th className="px-5 py-4 text-center">Clases Restantes</th>
                      <th className="px-5 py-4">Entrenador</th>
                      <th className="px-5 py-4 text-center">Estado del Pago</th>
                      <th className="px-5 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-5 py-8 text-center text-slate-500 italic">
                          No hay deportistas registrados. Haz clic en "Añadir Deportista" para empezar.
                        </td>
                      </tr>
                    ) : (
                      clients.map((client) => {
                        const isLowClasses = client.plan !== 'Indefinido' && Number(client.remainingClasses) <= 2;

                        return (
                          <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-5 py-4 font-medium text-white">
                              <div className="font-semibold text-base">{client.name}</div>
                              {client.notes && <div className="text-[11px] text-slate-500 italic mt-0.5">{client.notes}</div>}
                            </td>

                            <td className="px-5 py-4 text-xs text-slate-400">
                              {client.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-500" /> {client.email}</div>}
                              {client.phone && <div className="flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-slate-500" /> {client.phone}</div>}
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-block bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-xs font-semibold text-amber-300">
                                {client.plan === 'Indefinido' ? 'Indefinido' : `${client.plan} Clases/mes`}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <div className={`inline-flex items-center justify-center space-x-1 font-mono font-bold text-base px-3 py-1 rounded-xl border ${
                                isLowClasses 
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse' 
                                  : 'bg-slate-900 text-slate-200 border-slate-700'
                              }`}>
                                <span>{client.remainingClasses}</span>
                                {isLowClasses && <AlertTriangle className="w-3.5 h-3.5 ml-1 text-amber-400" />}
                              </div>
                            </td>

                            <td className="px-5 py-4 text-slate-300">
                              {client.assignedTrainer || 'Sin asignar'}
                            </td>

                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => handleTogglePaymentStatus(client.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border inline-flex items-center gap-1.5 ${
                                  client.paid 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                }`}
                                title="Haz clic para alternar pagado/pendiente"
                              >
                                {client.paid ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Pagado
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5" /> Pendiente
                                  </>
                                )}
                              </button>
                            </td>

                            <td className="px-5 py-4 text-right space-x-2">
                              <button
                                onClick={() => handleResetClientQuota(client)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 rounded-lg border border-slate-700 text-xs font-semibold transition-all"
                                title="Renovar y recargar bono"
                              >
                                Renovar
                              </button>
                              <button
                                onClick={() => handleOpenEditClient(client)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                                title="Editar deportista"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClient(client.id)}
                                className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 transition-colors"
                                title="Borrar deportista"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: AJUSTES & CAMBIO DE CONTRASEÑA */}
        {}
        {activeTab === 'settings' && isAdminLoggedIn && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Change Password Card */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-700 pb-4">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Cambiar Contraseña de Administrador</h3>
                  <p className="text-xs text-slate-400">Actualiza la clave secreta de acceso al panel privado.</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña Actual:</label>
                  <input
                    type="password"
                    required
                    value={currentPwForm}
                    onChange={(e) => setCurrentPwForm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nueva Contraseña:</label>
                    <input
                      type="password"
                      required
                      value={newPwForm}
                      onChange={(e) => setNewPwForm(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Nueva Contraseña:</label>
                    <input
                      type="password"
                      required
                      value={confirmPwForm}
                      onChange={(e) => setConfirmPwForm(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {pwChangeMessage.text && (
                  <div className={`p-3 rounded-xl border text-xs font-medium ${
                    pwChangeMessage.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {pwChangeMessage.text}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md"
                  >
                    Guardar Nueva Contraseña
                  </button>
                </div>
              </form>
            </div>

            {/* Clear All Data Reset */}
            <div className="bg-rose-950/20 border border-rose-500/30 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-rose-300">Borrado de Información / Reset Total</h3>
                  <p className="text-xs text-rose-200/70">Limpia toda la base de datos de deportistas y sesiones agendadas.</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Esta acción eliminará todos los registros almacenados en esta aplicación. Úsalo con precaución si deseas reiniciar el centro de entrenamiento completamente desde cero.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleResetAllData}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Borrar Todo y Dejar App Limpia</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODALS SECTION */}
      {}

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{confirmModal.title}</h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-5 py-2 font-bold rounded-xl text-sm transition-all shadow-md ${
                  confirmModal.isDanger 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN ACCESS */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Acceso Administrador</h3>
                <p className="text-xs text-slate-400">Ingresa tu contraseña para gestionar pagos y ajustes.</p>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña Máster:</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Introduce contraseña..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  autoFocus
                />
              </div>

              {passwordError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">{passwordError}</p>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-md"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT SESSION */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                {editingSession ? 'Modificar Clase Programada' : `Agendar Entrenamiento (${sessionForm.time})`}
              </h3>
              <button onClick={() => setShowSessionModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deportista:</label>
                <select
                  value={sessionForm.clientId}
                  onChange={(e) => setSessionForm({ ...sessionForm, clientId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — ({c.remainingClasses} clases rest.) {c.paid ? '✅' : '⚠️ No pagado'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Entrenador Asignado:</label>
                <select
                  value={sessionForm.trainer}
                  onChange={(e) => setSessionForm({ ...sessionForm, trainer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                >
                  {trainers.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Día:</label>
                  <input
                    type="date"
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hora:</label>
                  <select
                    value={sessionForm.time}
                    onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {HOURS.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm"
                >
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT ATHLETE */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">
                {editingClient ? 'Editar Datos del Deportista' : 'Nuevo Deportista'}
              </h3>
              <button onClick={() => setShowClientModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email:</label>
                  <input
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    placeholder="juan@ejemplo.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono:</label>
                  <input
                    type="text"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    placeholder="600112233"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bono / Cuota:</label>
                  <select
                    value={clientForm.plan}
                    onChange={(e) => {
                      const newPlan = e.target.value === 'Indefinido' ? 'Indefinido' : Number(e.target.value);
                      setClientForm({ 
                        ...clientForm, 
                        plan: newPlan,
                        remainingClasses: newPlan === 'Indefinido' ? '∞' : newPlan
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  >
                    <option value={4}>4 Clases / mes</option>
                    <option value={8}>8 Clases / mes</option>
                    <option value="Indefinido">Indefinido / Ilimitado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Clases Restantes (Ajuste manual):</label>
                  <input
                    type="text"
                    disabled={clientForm.plan === 'Indefinido'}
                    value={clientForm.remainingClasses}
                    onChange={(e) => setClientForm({ ...clientForm, remainingClasses: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Entrenador asignado:</label>
                  <select
                    value={clientForm.assignedTrainer}
                    onChange={(e) => setClientForm({ ...clientForm, assignedTrainer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  >
                    {trainers.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estado de Pago:</label>
                  <select
                    value={clientForm.paid ? 'true' : 'false'}
                    onChange={(e) => setClientForm({ ...clientForm, paid: e.target.value === 'true' })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  >
                    <option value="true">Pagado ✅</option>
                    <option value="false">Pendiente ⚠️</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Observaciones / Notas:</label>
                <textarea
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  placeholder="Detalles sobre lesiones o condiciones especiales..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm"
                >
                  Guardar Deportista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Ruben Marquez Alberca — Centro de Rendimiento Deportivo.</p>
      </footer>

    </div>
  );
}