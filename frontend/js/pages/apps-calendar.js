/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Apps Calendar
 */

import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min';
import { Calendar } from '@fullcalendar/core';
import  interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

class CalendarSchedule {

    constructor() {
        this.body = document.body;
        this.modal = new Modal(document.getElementById('event-modal'), {backdrop: 'static'});
        this.calendar = document.getElementById('calendar');
        this.formEvent = document.getElementById('forms-event');
        this.btnNewEvent = document.querySelectorAll('.btn-new-event');
        this.btnDeleteEvent = document.getElementById('btn-delete-event');
        this.btnSaveEvent = document.getElementById('btn-save-event');
        this.modalTitle = document.getElementById('modal-title');
        this.calendarObj = null;
        this.selectedEvent = null;
        this.newEventData = null;
    }

    onEventClick(info) {
        this.formEvent?.reset();
        this.formEvent.classList.remove('was-validated');
        this.newEventData = null;
        this.btnDeleteEvent.style.display = "block";
        this.modalTitle.text = ('Edit Event');
        this.modal.show();
        this.selectedEvent = info.event;
        document.getElementById('event-title').value = this.selectedEvent.title;
        const categoryInput = document.getElementById('event-category');
        if (categoryInput) {
            const {classNames} = this.selectedEvent;
            categoryInput.value = Array.isArray(classNames) ? classNames.join(' ') : classNames || '';
        }
    }

    onSelect(info) {
        this.formEvent?.reset();
        this.formEvent?.classList.remove('was-validated');
        this.selectedEvent = null;
        this.newEventData = info;
        this.btnDeleteEvent.style.display = "none";
        this.modalTitle.text = ('Add New Event');
        this.modal.show();
        this.calendarObj.unselect();
    }

    init() {
        /*  Initialize the calendar  */
        const today = new Date();
        const self = this;
        const externalEventContainerEl = document.getElementById('external-events');

        new Draggable(externalEventContainerEl, {
            itemSelector: '.external-event',
            eventData: function (eventEl) {
                return {
                    title: eventEl.innerText,
                    classNames: eventEl.getAttribute('data-class')
                };
            }
        });

        const defaultEvents = [
            {
                title: 'Design Review',
                start: today,
                end: today,
                className: 'bg-primary-subtle text-primary'
            },
            {
                title: 'Marketing Strategy',
                start: new Date(Date.now() + 16000000),
                end: new Date(Date.now() + 20000000),
                className: 'bg-secondary-subtle text-secondary'
            },
            {
                title: 'Sales Demo',
                start: new Date(Date.now() + 40000000),
                end: new Date(Date.now() + 80000000),
                className: 'bg-success-subtle text-success'
            },
            {
                title: 'Deadline Submission',
                start: new Date(Date.now() + 120000000),
                end: new Date(Date.now() + 180000000),
                className: 'bg-danger-subtle text-danger'
            },
            {
                title: 'Training Session',
                start: new Date(Date.now() + 250000000),
                end: new Date(Date.now() + 290000000),
                className: 'bg-info-subtle text-info'
            },
            {
                title: 'Budget Review',
                start: new Date(Date.now() + 400000000),
                end: new Date(Date.now() + 450000000),
                className: 'bg-warning-subtle text-warning'
            },
            {
                title: 'Board Meeting',
                start: new Date(Date.now() + 600000000),
                end: new Date(Date.now() + 620000000),
                className: 'bg-dark-subtle text-dark'
            }
        ];

        // cal - init
        self.calendarObj = new Calendar(self.calendar, {

            plugins: [ dayGridPlugin, timeGridPlugin, listPlugin , interactionPlugin ],
            slotDuration: '00:30:00', /* If we want to split day time each 15minutes */
            slotMinTime: '07:00:00',
            slotMaxTime: '19:00:00',
            themeSystem: 'bootstrap',
            bootstrapFontAwesome: false,
            buttonText: {
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
                list: 'List',
                prev: 'Prev',
                next: 'Next'
            },
            initialView: 'dayGridMonth',
            handleWindowResize: true,
            height: window.innerHeight - 240,
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },
            initialEvents: defaultEvents,
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            // dayMaxEventRows: false, // allow "more" link when too many events
            selectable: true,
            dateClick: function (info) {
                self.onSelect(info);
            },
            eventClick: function (info) {
                self.onEventClick(info);
            }
        });

        self.calendarObj.render();

        // on new event button click
        self.btnNewEvent.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                self.onSelect({
                    date: new Date(),
                    allDay: true
                });
            });
        });

        // save event
        self.formEvent?.addEventListener('submit', function (e) {
            e.preventDefault();
            const form = self.formEvent;

            // validation
            if (form.checkValidity()) {
                if (self.selectedEvent) {
                    self.selectedEvent.setProp('title', document.getElementById('event-title').value);
                    self.selectedEvent.setProp('classNames', document.getElementById('event-category').value)

                } else {
                    const eventData = {
                        title: document.getElementById('event-title').value,
                        start: self.newEventData.date,
                        allDay: self.newEventData.allDay,
                        className: document.getElementById('event-category').value
                    };
                    self.calendarObj.addEvent(eventData);
                }
                self.modal.hide();
            } else {
                e.stopPropagation();
                form.classList.add('was-validated');
            }
        });

        // delete event
        self.btnDeleteEvent.addEventListener('click', function (e) {
            if (self.selectedEvent) {
                self.selectedEvent.remove();
                self.selectedEvent = null;
                self.modal.hide();
            }
        });
    }

}

document.addEventListener('DOMContentLoaded', function (e) {
    new CalendarSchedule().init();
});