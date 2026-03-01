import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Gift, Trash2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import EventModal from '../../components/EventModal'
import { calendarService, CalendarEvent } from '../../services/calendar.service'
import { toast } from 'react-hot-toast'

export default function Calendar() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string>('')

    const fetchEvents = async () => {
        try {
            // Fetch events for the whole year for simplicity, or calculate start/end of month
            // For now, let's fetch all (or backend filters by default range if not provided)
            const data = await calendarService.getEvents()
            setEvents(data)
        } catch (error) {
            console.error('Failed to fetch events:', error)
            toast.error('Tadbirlarni yuklashda xatolik yuz berdi')
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [currentDate]) // Re-fetch if needed when changing months (if we implement range filtering)

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year: number, month: number) => {
        // 0 = Sunday, 1 = Monday... but we want Monday start (0=Monday, 6=Sunday)
        const day = new Date(year, month, 1).getDay()
        return day === 0 ? 6 : day - 1
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const handleAddEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
        try {
            await calendarService.createEvent(eventData)
            toast.success('Tadbir muvaffaqiyatli qo\'shildi')
            fetchEvents() // Refresh list
        } catch (error) {
            console.error('Failed to create event:', error)
            toast.error('Tadbir qo\'shishda xatolik')
        }
    }

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return
        try {
            await calendarService.deleteEvent(id)
            toast.success('Tadbir o\'chirildi')
            fetchEvents() // Refresh list
        } catch (error) {
            console.error('Failed to delete event:', error)
            toast.error('Tadbirni o\'chirishda xatolik')
        }
    }

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    // Uzbek month names (uz-UZ locale not supported in all browsers)
    const uzMonths = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
    const monthName = uzMonths[month]

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    // Dynamic empty slots
    const emptySlots = Array.from({ length: firstDay }, (_, i) => i)

    const getEventsForDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return events.filter(e => e.date === dateStr)
    }

    // Get upcoming events (sorted by date, only future)
    const upcomingEvents = events
        .filter(e => new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)

    const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => t(`calendar.weekDays.${day}`))

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-gray-900">{t('calendar.title')}</h1>
                            <p className="text-gray-500 text-sm">{t('calendar.subtitle')}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" icon={<ChevronLeft size={20} />} onClick={prevMonth}>
                            {t('calendar.prev')}
                        </Button>
                        <div className="flex items-center px-4 font-semibold text-gray-900 bg-white border border-gray-200 rounded-xl min-w-[150px] justify-center capitalize">
                            {monthName} {year}
                        </div>
                        <Button variant="secondary" icon={<ChevronRight size={20} />} onClick={nextMonth}>
                            {t('calendar.next')}
                        </Button>
                        <Button
                            icon={<CalendarIcon size={20} />}
                            onClick={() => {
                                setSelectedDate(new Date().toISOString().split('T')[0])
                                setIsModalOpen(true)
                            }}
                        >
                            {t('calendar.add')}
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Calendar Grid */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                            {weekDays.map(day => (
                                <div key={day} className="text-sm font-medium text-gray-400 uppercase">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2 sm:gap-4">
                            {emptySlots.map(i => <div key={`empty-${i}`} className="aspect-square" />)}

                            {days.map(day => {
                                const dayEvents = getEventsForDay(day)
                                const isToday =
                                    new Date().getDate() === day &&
                                    new Date().getMonth() === month &&
                                    new Date().getFullYear() === year

                                return (
                                    <div
                                        key={day}
                                        onClick={() => {
                                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                            setSelectedDate(dateStr)
                                            setIsModalOpen(true)
                                        }}
                                        className={`
                                            aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary-500 hover:shadow-md relative overflow-hidden group
                                            ${isToday ? 'bg-primary-50 border-primary-500 text-primary-700 font-bold' : 'bg-white border-gray-100 text-gray-700'}
                                        `}
                                    >
                                        <span className={`text-lg ${dayEvents.length > 0 ? 'mb-4' : ''}`}>{day}</span>

                                        {/* Event Dots */}
                                        {dayEvents.length > 0 && (
                                            <div className="absolute bottom-2 flex gap-1">
                                                {dayEvents.map((ev, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-1.5 h-1.5 rounded-full ${ev.type === 'holiday' ? 'bg-green-500' :
                                                            ev.type === 'birthday' ? 'bg-pink-500' :
                                                                ev.type === 'deadline' ? 'bg-red-500' : 'bg-blue-500'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {isToday && <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Sidebar Events */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="text-primary-500" size={20} />
                                {t('calendar.upcoming')}
                            </h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {upcomingEvents.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center py-4">Tadbirlar yo'q</p>
                                ) : (
                                    upcomingEvents.map(event => (
                                        <div key={event.id} className="group relative flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 
                                                ${event.type === 'holiday' ? 'bg-green-100 text-green-600' :
                                                    event.type === 'birthday' ? 'bg-pink-100 text-pink-600' :
                                                        event.type === 'deadline' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {event.type === 'birthday' ? <Gift size={20} /> :
                                                    event.type === 'holiday' ? <CalendarIcon size={20} /> :
                                                        <Clock size={20} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 text-sm truncate">{event.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Today's Highlight (First upcoming event or generic) */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">
                                        {`${new Date().getDate()} ${uzMonths[new Date().getMonth()]}`}
                                    </h3>
                                    <p className="text-indigo-100 text-sm">Bugungi kun</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <CalendarIcon size={20} />
                                </div>
                            </div>

                            {upcomingEvents.find(e => e.date === new Date().toISOString().split('T')[0]) ? (
                                <div>
                                    <p className="font-medium">
                                        {upcomingEvents.find(e => e.date === new Date().toISOString().split('T')[0])?.title}
                                    </p>
                                    <span className="inline-block mt-2 text-xs bg-white/20 px-2 py-1 rounded">Bugungi tadbir</span>
                                </div>
                            ) : (
                                <p className="text-sm opacity-90">Bugun rejalashtirilgan tadbirlar yo'q.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddEvent}
                initialDate={selectedDate}
            />
        </Layout>
    )
}
