import {IEvent} from "../models/event.model";

export async function getHomeComponent() {
  const c = await import('../pages/home/home.component');
  return c.HomeComponent;
}

export function formatDate(dateInput: Date | null) {
  if(!dateInput){
    return ''
  }
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = days[dateInput.getDay()];
  const date = dateInput.getDate();
  const month = months[dateInput.getMonth()];
  const year = dateInput.getFullYear();

  const offset = dateInput.getTimezoneOffset();
  const gmtSign = offset <= 0 ? '+' : '-';
  const gmtHours = Math.abs(offset) / 60;

  return `${month} ${date}/${year} ${day} (GMT ${gmtSign}${gmtHours})`;
}

export function generateTimeBlockObjects(startTime: Date, endTime: Date, interval: number) {
  let timeBlocks = [];
  let currentTime = new Date(startTime);

  while (currentTime <= endTime) {
    let hours = currentTime.getHours().toString().padStart(2, '0');
    let minutes = currentTime.getMinutes().toString().padStart(2, '0');

    timeBlocks.push({
      time: `${hours}:${minutes}`,
      show: minutes === '00' // `true` only for full hours (e.g., 12:00, 13:00, etc.)
    });

    currentTime.setMinutes(currentTime.getMinutes() + interval);
  }

  return timeBlocks;
}

export function formatDateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${day}-${month}`;
}

// Set event data in local storage
export function setEvent(dateKey: string, timeKey: string, eventData: IEvent): void {
  const calendarData = JSON.parse(localStorage.getItem('alienCalendar') || '{}');

  // Ensure the dateKey exists in calendarData
  if (!calendarData[dateKey]) {
    calendarData[dateKey] = {};
  }

  // Set the event data for the specific timeKey
  calendarData[dateKey][timeKey] = eventData;

  // Store updated calendar data back to localStorage
  localStorage.setItem('alienCalendar', JSON.stringify(calendarData));
}

export function deleteEvent(dateKey: string, timeKey: string): void {
  const calendarData = JSON.parse(localStorage.getItem('alienCalendar') || '{}');

  // Ensure the dateKey exists in calendarData
  if (!calendarData[dateKey]) {
    calendarData[dateKey] = {};
  }

  // Set the event data for the specific timeKey
  delete calendarData[dateKey][timeKey];

  // Store updated calendar data back to localStorage
  localStorage.setItem('alienCalendar', JSON.stringify(calendarData));
}

// Get event data from local storage
export function getEvent(dateKey: string, timeKey: string): { title: string, description: string } | null {
  const calendarData = JSON.parse(localStorage.getItem('alienCalendar') || '{}');

  // Retrieve the event data for the specific dateKey and timeKey
  return calendarData[dateKey]?.[timeKey] || null;
}

// Get all events for a specific date
export function getEventsForDate(dateKey: string): { [timeKey: string]: IEvent } | null {
  const calendarData = JSON.parse(localStorage.getItem('alienCalendar') || '{}');

  // Return all events for the specified date
  return calendarData[dateKey] || null;
}

export function getAvailableTimeKeys(dateKey: string, startTime: Date, endTime: Date, interval: number) {
  const calendarData = JSON.parse(localStorage.getItem('alienCalendar') || '{}');
  const occupiedTimes = new Set(Object.keys(calendarData[dateKey] || {}));

  const allTimeKeys = generateTimeBlockObjects(startTime,endTime,interval); // Generate all possible time keys

  const availableTimeKeys = allTimeKeys.filter((timeKey: any) => !occupiedTimes.has(timeKey.time));
  availableTimeKeys.pop();
  return availableTimeKeys;
}

export function convertToEventArray(eventObject: { [timeKey: string]: IEvent } | null): any[] {
  if(!eventObject){
    return []
  }

  return Object.keys(eventObject).map(key => ({
    ...eventObject[key]
  }));
}
