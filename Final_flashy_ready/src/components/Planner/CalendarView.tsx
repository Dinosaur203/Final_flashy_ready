import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import { CalendarEvent } from '../../types';
import { storage } from '../../utils/storage';
import { demoCalendarEvents } from '../../utils/demo-data';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Form states
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventTags, setEventTags] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [eventRepeat, setEventRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const savedEvents = storage.getEvents();
    if (savedEvents.length === 0) {
      storage.saveEvents(demoCalendarEvents);
      setEvents(demoCalendarEvents);
    } else {
      setEvents(savedEvents);
    }
  };

  const createEvent = () => {
    if (!eventTitle.trim() || !eventDate) return;

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      date: new Date(eventDate),
      time: eventTime || '12:00',
      tags: eventTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      notes: eventNotes || undefined,
      repeat: eventRepeat
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    storage.saveEvents(updatedEvents);
    resetForm();
    setIsCreating(false);
  };

  const updateEvent = () => {
    if (!editingEvent || !eventTitle.trim() || !eventDate) return;

    const updatedEvent: CalendarEvent = {
      ...editingEvent,
      title: eventTitle,
      date: new Date(eventDate),
      time: eventTime || '12:00',
      tags: eventTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      notes: eventNotes || undefined,
      repeat: eventRepeat
    };

    const updatedEvents = events.map(event => 
      event.id === editingEvent.id ? updatedEvent : event
    );

    setEvents(updatedEvents);
    storage.saveEvents(updatedEvents);
    resetForm();
    setEditingEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    storage.saveEvents(updatedEvents);
  };

  const resetForm = () => {
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventTags('');
    setEventNotes('');
    setEventRepeat('none');
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventDate(format(new Date(event.date), 'yyyy-MM-dd'));
    setEventTime(event.time);
    setEventTags(event.tags.join(', '));
    setEventNotes(event.notes || '');
    setEventRepeat(event.repeat || 'none');
  };

  const exportToICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//StudySync//StudySync Calendar//EN',
      ...events.map(event => [
        'BEGIN:VEVENT',
        `DTSTART:${format(new Date(event.date), 'yyyyMMdd')}T${event.time.replace(':', '')}00`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.notes || ''}`,
        `UID:${event.id}@studysync.com`,
        'END:VEVENT'
      ]).flat(),
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'studysync-calendar.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fill in days from previous/next month to complete the grid
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  if (view === 'month') {
    return (
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="font-poppins font-semibold text-2xl text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                icon={ChevronLeft}
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              />
              <Button
                variant="outline"
                size="sm"
                icon={ChevronRight}
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={exportToICS}
            >
              Export .ics
            </Button>
            <Button
              icon={Plus}
              onClick={() => {
                setSelectedDate(new Date());
                setEventDate(format(new Date(), 'yyyy-MM-dd'));
                setIsCreating(true);
              }}
            >
              Add Event
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <div className="grid grid-cols-7 gap-0">
            {/* Days of week header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="p-4 text-center font-inter font-medium text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 border-r border-b border-gray-200 dark:border-gray-700 ${
                    !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-inter text-sm mb-1 ${
                      isToday
                        ? 'bg-primary-500 text-white'
                        : isCurrentMonth
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <button
                        key={event.id}
                        onClick={() => openEditModal(event)}
                        className="w-full text-left p-1 rounded text-xs font-inter bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                      >
                        {event.time} {event.title}
                      </button>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-inter font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </h4>
                    <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                      {format(new Date(event.date), 'MMM dd, yyyy')} at {event.time}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Edit}
                      onClick={() => openEditModal(event)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Trash2}
                      onClick={() => deleteEvent(event.id)}
                    />
                  </div>
                </div>
              ))}
            {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
              <p className="font-inter text-gray-500 dark:text-gray-400 text-center py-4">
                No upcoming events
              </p>
            )}
          </div>
        </Card>

        {/* Create Event Modal */}
        <Modal
          isOpen={isCreating}
          onClose={() => {
            setIsCreating(false);
            resetForm();
          }}
          title="Create New Event"
        >
          <div className="space-y-4">
            <Input
              label="Event Title"
              value={eventTitle}
              onChange={setEventTitle}
              placeholder="Enter event title"
              required
            />
            
            <Input
              label="Date"
              type="date"
              value={eventDate}
              onChange={setEventDate}
              required
            />
            
            <Input
              label="Time"
              type="time"
              value={eventTime}
              onChange={setEventTime}
            />
            
            <Input
              label="Tags (comma-separated)"
              value={eventTags}
              onChange={setEventTags}
              placeholder="e.g. Study, Meeting, Assignment"
            />
            
            <Input
              label="Notes"
              value={eventNotes}
              onChange={setEventNotes}
              placeholder="Additional notes..."
              rows={3}
            />

            <div>
              <label className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                Repeat
              </label>
              <select
                value={eventRepeat}
                onChange={(e) => setEventRepeat(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="none">Don't repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  resetForm();
                }} 
                fullWidth
              >
                Cancel
              </Button>
              <Button onClick={createEvent} fullWidth>
                Create Event
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Event Modal */}
        <Modal
          isOpen={!!editingEvent}
          onClose={() => {
            setEditingEvent(null);
            resetForm();
          }}
          title="Edit Event"
        >
          <div className="space-y-4">
            <Input
              label="Event Title"
              value={eventTitle}
              onChange={setEventTitle}
              placeholder="Enter event title"
              required
            />
            
            <Input
              label="Date"
              type="date"
              value={eventDate}
              onChange={setEventDate}
              required
            />
            
            <Input
              label="Time"
              type="time"
              value={eventTime}
              onChange={setEventTime}
            />
            
            <Input
              label="Tags (comma-separated)"
              value={eventTags}
              onChange={setEventTags}
              placeholder="e.g. Study, Meeting, Assignment"
            />
            
            <Input
              label="Notes"
              value={eventNotes}
              onChange={setEventNotes}
              placeholder="Additional notes..."
              rows={3}
            />

            <div>
              <label className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                Repeat
              </label>
              <select
                value={eventRepeat}
                onChange={(e) => setEventRepeat(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="none">Don't repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingEvent(null);
                  resetForm();
                }} 
                fullWidth
              >
                Cancel
              </Button>
              <Button onClick={updateEvent} fullWidth>
                Update Event
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return <div>Week and Day views coming soon!</div>;
};

export default CalendarView;