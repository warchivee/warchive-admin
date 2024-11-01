import { l as get_store_value, s as setContext, p as getContext, c as create_ssr_component, h as compute_rest_props, a as subscribe, i as spread, k as escape_object, b as add_attribute, g as escape, v as validate_component, j as escape_attribute_value, e as each } from "../../../chunks/ssr.js";
import { w as withGet, i as isBrowser, a as isHTMLElement, s as styleToString, o as omit, m as makeElement, e as executeCallbacks, d as addMeltEventListener, f as createElHelpers, k as kbd, g as effect, h as createBitAttrs, j as createDispatcher, c as cn, b as buttonVariants, B as Button, I as Input } from "../../../chunks/input.js";
import { a as chunk, o as overridable, b as toWritableStores, g as generateIds, i as isValidIndex, d as tick, r as removeUndefined, e as getOptionUpdater, I as Icon } from "../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { d as derived, a as readonly, w as writable } from "../../../chunks/index2.js";
import { C as Chevron_right } from "../../../chunks/chevron-right.js";
import { b as Drawer, T as Trigger$1, c as Drawer_content, d as Drawer_header, e as Drawer_title, C as Close, f as Drawer_footer, D as DataCard } from "../../../chunks/DataCard.js";
import { L as Label } from "../../../chunks/label.js";
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from "date-fns";
import { CalendarDateTime, CalendarDate, ZonedDateTime, parseZonedDateTime, parseDateTime, parseDate, toCalendar, getLocalTimeZone, getDayOfWeek, DateFormatter, startOfMonth, endOfMonth, isSameMonth, isSameDay, isToday } from "@internationalized/date";
import { R as Root, T as Trigger, P as Popover_content } from "../../../chunks/index3.js";
import { d as axiosInstance } from "../../../chunks/axios.js";
const defaultDateDefaults = {
  defaultValue: void 0,
  defaultPlaceholder: void 0,
  granularity: "day"
};
function getDefaultDate(props) {
  const withDefaults = { ...defaultDateDefaults, ...props };
  const { defaultValue, defaultPlaceholder, granularity } = withDefaults;
  if (Array.isArray(defaultValue) && defaultValue.length) {
    return defaultValue[defaultValue.length - 1];
  }
  if (defaultValue && !Array.isArray(defaultValue)) {
    return defaultValue;
  } else if (defaultPlaceholder) {
    return defaultPlaceholder;
  } else {
    const date = /* @__PURE__ */ new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const calendarDateTimeGranularities = ["hour", "minute", "second"];
    if (calendarDateTimeGranularities.includes(granularity ?? "day")) {
      return new CalendarDateTime(year, month, day, 0, 0, 0);
    }
    return new CalendarDate(year, month, day);
  }
}
function parseStringToDateValue(dateStr, referenceVal) {
  let dateValue;
  if (referenceVal instanceof ZonedDateTime) {
    dateValue = parseZonedDateTime(dateStr);
  } else if (referenceVal instanceof CalendarDateTime) {
    dateValue = parseDateTime(dateStr);
  } else {
    dateValue = parseDate(dateStr);
  }
  return dateValue.calendar !== referenceVal.calendar ? toCalendar(dateValue, referenceVal.calendar) : dateValue;
}
function toDate(dateValue, tz = getLocalTimeZone()) {
  if (dateValue instanceof ZonedDateTime) {
    return dateValue.toDate();
  } else {
    return dateValue.toDate(tz);
  }
}
function isCalendarDateTime(dateValue) {
  return dateValue instanceof CalendarDateTime;
}
function isZonedDateTime(dateValue) {
  return dateValue instanceof ZonedDateTime;
}
function hasTime(dateValue) {
  return isCalendarDateTime(dateValue) || isZonedDateTime(dateValue);
}
function getDaysInMonth(date) {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  } else {
    return date.set({ day: 100 }).day;
  }
}
function isBefore(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) < 0;
}
function isAfter(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) > 0;
}
function isBeforeOrSame(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) <= 0;
}
function isAfterOrSame(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) >= 0;
}
function isBetweenInclusive(date, start, end) {
  return isAfterOrSame(date, start) && isBeforeOrSame(date, end);
}
function getLastFirstDayOfWeek(date, firstDayOfWeek, locale) {
  const day = getDayOfWeek(date, locale);
  if (firstDayOfWeek > day) {
    return date.subtract({ days: day + 7 - firstDayOfWeek });
  }
  if (firstDayOfWeek === day) {
    return date;
  }
  return date.subtract({ days: day - firstDayOfWeek });
}
function getNextLastDayOfWeek(date, firstDayOfWeek, locale) {
  const day = getDayOfWeek(date, locale);
  const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  if (day === lastDayOfWeek) {
    return date;
  }
  if (day > lastDayOfWeek) {
    return date.add({ days: 7 - day + lastDayOfWeek });
  }
  return date.add({ days: lastDayOfWeek - day });
}
function areAllDaysBetweenValid(start, end, isUnavailable, isDisabled) {
  if (isUnavailable === void 0 && isDisabled === void 0) {
    return true;
  }
  let dCurrent = start.add({ days: 1 });
  if (isDisabled?.(dCurrent) || isUnavailable?.(dCurrent)) {
    return false;
  }
  const dEnd = end;
  while (dCurrent.compare(dEnd) < 0) {
    dCurrent = dCurrent.add({ days: 1 });
    if (isDisabled?.(dCurrent) || isUnavailable?.(dCurrent)) {
      return false;
    }
  }
  return true;
}
function createFormatter(initialLocale) {
  let locale = initialLocale;
  function setLocale(newLocale) {
    locale = newLocale;
  }
  function getLocale() {
    return locale;
  }
  function custom(date, options) {
    return new DateFormatter(locale, options).format(date);
  }
  function selectedDate(date, includeTime = true) {
    if (hasTime(date) && includeTime) {
      return custom(toDate(date), {
        dateStyle: "long",
        timeStyle: "long"
      });
    } else {
      return custom(toDate(date), {
        dateStyle: "long"
      });
    }
  }
  function fullMonthAndYear(date) {
    return new DateFormatter(locale, { month: "long", year: "numeric" }).format(date);
  }
  function fullMonth(date) {
    return new DateFormatter(locale, { month: "long" }).format(date);
  }
  function fullYear(date) {
    return new DateFormatter(locale, { year: "numeric" }).format(date);
  }
  function toParts(date, options) {
    if (isZonedDateTime(date)) {
      return new DateFormatter(locale, {
        ...options,
        timeZone: date.timeZone
      }).formatToParts(toDate(date));
    } else {
      return new DateFormatter(locale, options).formatToParts(toDate(date));
    }
  }
  function dayOfWeek(date, length = "narrow") {
    return new DateFormatter(locale, { weekday: length }).format(date);
  }
  function dayPeriod(date) {
    const parts = new DateFormatter(locale, {
      hour: "numeric",
      minute: "numeric"
    }).formatToParts(date);
    const value = parts.find((p) => p.type === "dayPeriod")?.value;
    if (value === "PM") {
      return "PM";
    }
    return "AM";
  }
  const defaultPartOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  function part(dateObj, type, options = {}) {
    const opts = { ...defaultPartOptions, ...options };
    const parts = toParts(dateObj, opts);
    const part2 = parts.find((p) => p.type === type);
    return part2 ? part2.value : "";
  }
  return {
    setLocale,
    getLocale,
    fullMonth,
    fullYear,
    fullMonthAndYear,
    toParts,
    custom,
    part,
    dayPeriod,
    selectedDate,
    dayOfWeek
  };
}
function dateStore(store, defaultValue) {
  const { set, update, subscribe: subscribe2, get } = withGet(store);
  function add(duration) {
    update((d) => {
      return d.add(duration);
    });
  }
  function nextPage(amount) {
    update((d) => {
      return d.set({ day: 1 }).add({ months: amount });
    });
  }
  function prevPage(amount) {
    update((d) => {
      return d.set({ day: 1 }).subtract({ months: amount });
    });
  }
  function subtract(duration) {
    update((d) => {
      return d.subtract(duration);
    });
  }
  function setDate(fields, disambiguation) {
    if (disambiguation) {
      update((d) => {
        return d.set(fields, disambiguation);
      });
      return;
    }
    update((d) => {
      return d.set(fields);
    });
  }
  function reset() {
    update(() => {
      return defaultValue;
    });
  }
  function toWritable() {
    return {
      set,
      subscribe: subscribe2,
      update,
      get
    };
  }
  return {
    get,
    set,
    update,
    subscribe: subscribe2,
    add,
    subtract,
    setDate,
    reset,
    toWritable,
    nextPage,
    prevPage
  };
}
function initAnnouncer() {
  if (!isBrowser)
    return null;
  let el = document.querySelector("[data-melt-announcer]");
  if (!isHTMLElement(el)) {
    const div = document.createElement("div");
    div.style.cssText = styleToString({
      border: "0px",
      clip: "rect(0px, 0px, 0px, 0px)",
      "clip-path": "inset(50%)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: "0px",
      position: "absolute",
      "white-space": "nowrap",
      width: "1px"
    });
    div.setAttribute("data-melt-announcer", "");
    div.appendChild(createLog("assertive"));
    div.appendChild(createLog("polite"));
    el = div;
    document.body.insertBefore(el, document.body.firstChild);
  }
  function createLog(kind) {
    const log = document.createElement("div");
    log.role = "log";
    log.ariaLive = kind;
    log.setAttribute("aria-relevant", "additions");
    return log;
  }
  function getLog(kind) {
    if (!isHTMLElement(el))
      return null;
    const log = el.querySelector(`[aria-live="${kind}"]`);
    if (!isHTMLElement(log))
      return null;
    return log;
  }
  return {
    getLog
  };
}
function getAnnouncer() {
  const announcer = initAnnouncer();
  function announce(value, kind = "assertive", timeout = 7500) {
    if (!announcer || !isBrowser)
      return;
    const log = announcer.getLog(kind);
    const content = document.createElement("div");
    if (typeof value === "number") {
      value = value.toString();
    } else if (value === null) {
      value = "Empty";
    } else {
      value = value.trim();
    }
    content.innerText = value;
    if (kind === "assertive") {
      log?.replaceChildren(content);
    } else {
      log?.appendChild(content);
    }
    return setTimeout(() => {
      content.remove();
    }, timeout);
  }
  return {
    announce
  };
}
function isCalendarCell(node) {
  if (!isHTMLElement(node))
    return false;
  if (!node.hasAttribute("data-melt-calendar-cell"))
    return false;
  return true;
}
function getDaysBetween(start, end) {
  const days = [];
  let dCurrent = start.add({ days: 1 });
  const dEnd = end;
  while (dCurrent.compare(dEnd) < 0) {
    days.push(dCurrent);
    dCurrent = dCurrent.add({ days: 1 });
  }
  return days;
}
function createMonth(props) {
  const { dateObj, weekStartsOn, fixedWeeks, locale } = props;
  const daysInMonth = getDaysInMonth(dateObj);
  const datesArray = Array.from({ length: daysInMonth }, (_, i) => dateObj.set({ day: i + 1 }));
  const firstDayOfMonth = startOfMonth(dateObj);
  const lastDayOfMonth = endOfMonth(dateObj);
  const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth, weekStartsOn, locale);
  const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth, weekStartsOn, locale);
  const lastMonthDays = getDaysBetween(lastSunday.subtract({ days: 1 }), firstDayOfMonth);
  const nextMonthDays = getDaysBetween(lastDayOfMonth, nextSaturday.add({ days: 1 }));
  const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;
  if (fixedWeeks && totalDays < 42) {
    const extraDays = 42 - totalDays;
    let startFrom = nextMonthDays[nextMonthDays.length - 1];
    if (!startFrom) {
      startFrom = dateObj.add({ months: 1 }).set({ day: 1 });
    }
    const extraDaysArray = Array.from({ length: extraDays }, (_, i) => {
      const incr = i + 1;
      return startFrom.add({ days: incr });
    });
    nextMonthDays.push(...extraDaysArray);
  }
  const allDays = lastMonthDays.concat(datesArray, nextMonthDays);
  const weeks = chunk(allDays, 7);
  return {
    value: dateObj,
    dates: allDays,
    weeks
  };
}
function createMonths(props) {
  const { numberOfMonths, dateObj, ...monthProps } = props;
  const months = [];
  if (!numberOfMonths || numberOfMonths === 1) {
    months.push(createMonth({
      ...monthProps,
      dateObj
    }));
    return months;
  }
  months.push(createMonth({
    ...monthProps,
    dateObj
  }));
  for (let i = 1; i < numberOfMonths; i++) {
    const nextMonth = dateObj.add({ months: i });
    months.push(createMonth({
      ...monthProps,
      dateObj: nextMonth
    }));
  }
  return months;
}
function getSelectableCells(calendarId) {
  const node = document.getElementById(calendarId);
  if (!node)
    return [];
  const selectableSelector = `[data-melt-calendar-cell]:not([data-disabled]):not([data-outside-visible-months])`;
  return Array.from(node.querySelectorAll(selectableSelector)).filter((el) => isHTMLElement(el));
}
function setPlaceholderToNodeValue(node, placeholder) {
  const cellValue = node.getAttribute("data-value");
  if (!cellValue)
    return;
  placeholder.set(parseStringToDateValue(cellValue, get_store_value(placeholder)));
}
function getPageItems({ page = 1, totalPages, siblingCount = 1 }) {
  const pageItems = [];
  const pagesToShow = /* @__PURE__ */ new Set([1, totalPages]);
  const firstItemWithSiblings = 3 + siblingCount;
  const lastItemWithSiblings = totalPages - 2 - siblingCount;
  if (firstItemWithSiblings > lastItemWithSiblings) {
    for (let p = 2; p <= totalPages - 1; p++) {
      pagesToShow.add(p);
    }
  } else if (page < firstItemWithSiblings) {
    for (let p = 2; p <= Math.min(firstItemWithSiblings, totalPages); p++) {
      pagesToShow.add(p);
    }
  } else if (page > lastItemWithSiblings) {
    for (let p = totalPages - 1; p >= Math.max(lastItemWithSiblings, 2); p--) {
      pagesToShow.add(p);
    }
  } else {
    for (let p = Math.max(page - siblingCount, 2); p <= Math.min(page + siblingCount, totalPages); p++) {
      pagesToShow.add(p);
    }
  }
  const addPage = (value) => {
    pageItems.push({ type: "page", value, key: `page-${value}` });
  };
  const addEllipsis = () => {
    pageItems.push({ type: "ellipsis", key: `ellipsis-${pageItems.length}` });
  };
  let lastNumber = 0;
  for (const page2 of Array.from(pagesToShow).sort((a, b) => a - b)) {
    if (page2 - lastNumber > 1) {
      addEllipsis();
    }
    addPage(page2);
    lastNumber = page2;
  }
  return pageItems;
}
const defaults$1 = {
  perPage: 1,
  siblingCount: 1,
  defaultPage: 1
};
const { name: name$1, selector } = createElHelpers("pagination");
function createPagination(props) {
  const withDefaults = { ...defaults$1, ...props };
  const pageWritable = withDefaults.page ?? writable(withDefaults.defaultPage);
  const page = overridable(pageWritable, withDefaults?.onPageChange);
  const options = toWritableStores(omit(withDefaults, "page", "onPageChange", "defaultPage"));
  const { perPage, siblingCount, count } = options;
  const totalPages = withGet.derived([count, perPage], ([$count, $perPage]) => {
    return Math.ceil($count / $perPage);
  });
  const range = derived([page, perPage, count], ([$page, $perPage, $count]) => {
    const start = ($page - 1) * $perPage;
    const end = Math.min(start + $perPage, $count);
    return { start, end };
  });
  const root = makeElement(name$1(), {
    returned: () => ({
      "data-scope": "pagination"
    })
  });
  const pages = derived([page, totalPages, siblingCount], ([$page, $totalPages, $siblingCount]) => {
    return getPageItems({ page: $page, totalPages: $totalPages, siblingCount: $siblingCount });
  });
  const keydown = (e) => {
    const thisEl = e.target;
    if (!isHTMLElement(thisEl))
      return;
    const rootEl = thisEl.closest('[data-scope="pagination"]');
    if (!isHTMLElement(rootEl))
      return;
    const triggers = Array.from(rootEl.querySelectorAll(selector("page"))).filter((el) => isHTMLElement(el));
    const prevButton2 = rootEl.querySelector(selector("prev"));
    const nextButton2 = rootEl.querySelector(selector("next"));
    if (isHTMLElement(prevButton2)) {
      triggers.unshift(prevButton2);
    }
    if (isHTMLElement(nextButton2)) {
      triggers.push(nextButton2);
    }
    const index = triggers.indexOf(thisEl);
    if (e.key === kbd.ARROW_LEFT && index !== 0) {
      e.preventDefault();
      triggers[index - 1].focus();
    } else if (e.key === kbd.ARROW_RIGHT && index !== triggers.length - 1) {
      e.preventDefault();
      triggers[index + 1].focus();
    } else if (e.key === kbd.HOME) {
      e.preventDefault();
      triggers[0].focus();
    } else if (e.key === kbd.END) {
      e.preventDefault();
      triggers[triggers.length - 1].focus();
    }
  };
  const pageTrigger = makeElement(name$1("page"), {
    stores: page,
    returned: ($page) => {
      return (pageItem) => {
        return {
          "aria-label": `Page ${pageItem.value}`,
          "data-value": pageItem.value,
          "data-selected": pageItem.value === $page ? "" : void 0
        };
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        const value = node.dataset.value;
        if (!value || Number.isNaN(+value))
          return;
        page.set(Number(value));
      }), addMeltEventListener(node, "keydown", keydown));
      return {
        destroy: unsub
      };
    }
  });
  const prevButton = makeElement(name$1("prev"), {
    stores: page,
    returned: ($page) => {
      return {
        "aria-label": "Previous",
        disabled: $page <= 1
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        page.update((p) => Math.max(p - 1, 1));
      }), addMeltEventListener(node, "keydown", keydown));
      return {
        destroy: unsub
      };
    }
  });
  const nextButton = makeElement(name$1("next"), {
    stores: [page, totalPages],
    returned: ([$page, $totalPages]) => {
      return {
        "aria-label": "Next",
        disabled: $page >= $totalPages
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        const $totalPages = totalPages.get();
        page.update((p) => Math.min(p + 1, $totalPages));
      }), addMeltEventListener(node, "keydown", keydown));
      return {
        destroy: unsub
      };
    }
  });
  return {
    elements: {
      root,
      pageTrigger,
      prevButton,
      nextButton
    },
    states: {
      range: readonly(range),
      page,
      pages: readonly(pages),
      totalPages: readonly(totalPages)
    },
    options
  };
}
const defaults = {
  isDateDisabled: void 0,
  isDateUnavailable: void 0,
  value: void 0,
  defaultValue: {
    start: void 0,
    end: void 0
  },
  preventDeselect: false,
  numberOfMonths: 1,
  pagedNavigation: false,
  weekStartsOn: 0,
  fixedWeeks: false,
  calendarLabel: "Event Date",
  locale: "en",
  minValue: void 0,
  maxValue: void 0,
  disabled: false,
  readonly: false,
  weekdayFormat: "narrow"
};
const { name } = createElHelpers("calendar");
const rangeCalendarIdParts = ["calendar", "accessibleHeading"];
function createRangeCalendar(props) {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores({
    ...omit(withDefaults, "value", "placeholder")
  });
  const { preventDeselect, numberOfMonths, pagedNavigation, weekStartsOn, fixedWeeks, calendarLabel, locale, minValue, maxValue, disabled, readonly: readonly2, weekdayFormat } = options;
  const ids = toWritableStores({ ...generateIds(rangeCalendarIdParts), ...withDefaults.ids });
  const defaultDate = getDefaultDate({
    defaultValue: withDefaults.defaultValue?.start,
    defaultPlaceholder: withDefaults.defaultPlaceholder
  });
  const formatter = createFormatter(locale.get());
  const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
  const value = overridable(valueWritable, withDefaults.onValueChange);
  if (!value.get()) {
    value.set(withDefaults.defaultValue);
  }
  const startValue = withGet(writable(value.get().start ?? withDefaults.defaultValue?.start));
  const endValue = withGet(writable(value.get().end ?? withDefaults.defaultValue?.end));
  const placeholderWritable = withDefaults.placeholder ?? writable(withDefaults.defaultPlaceholder ?? defaultDate);
  const placeholder = dateStore(overridable(placeholderWritable, withDefaults.onPlaceholderChange), withDefaults.defaultPlaceholder ?? defaultDate);
  const focusedValue = withGet(writable(null));
  const lastPressedDateValue = withGet(writable(null));
  const months = withGet(writable(createMonths({
    dateObj: placeholder.get(),
    weekStartsOn: withDefaults.weekStartsOn,
    locale: withDefaults.locale,
    fixedWeeks: withDefaults.fixedWeeks,
    numberOfMonths: withDefaults.numberOfMonths
  })));
  const visibleMonths = withGet(derived([months], ([$months]) => {
    return $months.map((month) => {
      return month.value;
    });
  }));
  const isOutsideVisibleMonths = withGet(derived([visibleMonths], ([$visibleMonths]) => {
    return (date) => {
      return !$visibleMonths.some((month) => isSameMonth(date, month));
    };
  }));
  const isDateDisabled = withGet(derived([options.isDateDisabled, minValue, maxValue], ([$isDateDisabled, $minValue, $maxValue]) => {
    return (date) => {
      if ($isDateDisabled?.(date))
        return true;
      if ($minValue && isBefore(date, $minValue))
        return true;
      if ($maxValue && isAfter(date, $maxValue))
        return true;
      return false;
    };
  }));
  const isDateUnavailable = withGet(derived([options.isDateUnavailable], ([$isDateUnavailable]) => {
    return (date) => {
      if ($isDateUnavailable?.(date))
        return true;
      return false;
    };
  }));
  const isStartInvalid = derived([startValue, isDateUnavailable, isDateDisabled], ([$startValue, $isDateUnavailable, $isDateDisabled]) => {
    if (!$startValue)
      return false;
    return $isDateUnavailable($startValue) || $isDateDisabled($startValue);
  });
  const isEndInvalid = derived([endValue, isDateUnavailable, isDateDisabled], ([$endValue, $isDateUnavailable, $isDateDisabled]) => {
    if (!$endValue)
      return false;
    return $isDateUnavailable($endValue) || $isDateDisabled($endValue);
  });
  const isInvalid = derived([startValue, endValue, isEndInvalid, isStartInvalid], ([$startValue, $endValue, $isEndInvalid, $isStartInvalid]) => {
    if ($isStartInvalid || $isEndInvalid) {
      return true;
    }
    if ($endValue && $startValue && isBefore($endValue, $startValue)) {
      return true;
    }
    return false;
  });
  const isNextButtonDisabled = withGet.derived([months, maxValue, disabled], ([$months, $maxValue, $disabled]) => {
    if (!$maxValue || !$months.length)
      return false;
    if ($disabled)
      return true;
    const lastMonthInView = $months[$months.length - 1].value;
    const firstMonthOfNextPage = lastMonthInView.add({ months: 1 }).set({ day: 1 });
    return isAfter(firstMonthOfNextPage, $maxValue);
  });
  const isPrevButtonDisabled = withGet.derived([months, minValue, disabled], ([$months, $minValue, $disabled]) => {
    if (!$minValue || !$months.length)
      return false;
    if ($disabled)
      return true;
    const firstMonthInView = $months[0].value;
    const lastMonthOfPrevPage = firstMonthInView.subtract({ months: 1 }).set({ day: 35 });
    return isBefore(lastMonthOfPrevPage, $minValue);
  });
  let announcer = getAnnouncer();
  const headingValue = withGet.derived([months, locale], ([$months, $locale]) => {
    if (!$months.length)
      return "";
    if ($locale !== formatter.getLocale()) {
      formatter.setLocale($locale);
    }
    if ($months.length === 1) {
      const month = toDate($months[0].value);
      return `${formatter.fullMonthAndYear(month)}`;
    }
    const startMonth = toDate($months[0].value);
    const endMonth = toDate($months[$months.length - 1].value);
    const startMonthName = formatter.fullMonth(startMonth);
    const endMonthName = formatter.fullMonth(endMonth);
    const startMonthYear = formatter.fullYear(startMonth);
    const endMonthYear = formatter.fullYear(endMonth);
    const content = startMonthYear === endMonthYear ? `${startMonthName} - ${endMonthName} ${endMonthYear}` : `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`;
    return content;
  });
  const fullCalendarLabel = withGet.derived([headingValue, calendarLabel], ([$headingValue, $calendarLabel]) => {
    return `${$calendarLabel}, ${$headingValue}`;
  });
  const calendar = makeElement(name(), {
    stores: [fullCalendarLabel, isInvalid, ids.calendar, disabled, readonly2],
    returned: ([$fullCalendarLabel, $isInvalid, $calendarId, $disabled, $readonly]) => {
      return {
        id: $calendarId,
        role: "application",
        "aria-label": $fullCalendarLabel,
        "data-invalid": $isInvalid ? "" : void 0,
        "data-disabled": $disabled ? "" : void 0,
        "data-readonly": $readonly ? "" : void 0
      };
    },
    action: (node) => {
      createAccessibleHeading(node, fullCalendarLabel.get());
      announcer = getAnnouncer();
      const unsubKb = addMeltEventListener(node, "keydown", handleCalendarKeydown);
      return {
        destroy() {
          unsubKb();
        }
      };
    }
  });
  const heading = makeElement(name("heading"), {
    stores: [disabled],
    returned: ([$disabled]) => {
      return {
        "aria-hidden": true,
        "data-disabled": $disabled ? "" : void 0
      };
    }
  });
  const grid = makeElement(name("grid"), {
    stores: [readonly2, disabled],
    returned: ([$readonly, $disabled]) => ({
      tabindex: -1,
      role: "grid",
      "aria-readonly": $readonly ? "true" : void 0,
      "aria-disabled": $disabled ? "true" : void 0,
      "data-readonly": $readonly ? "" : void 0,
      "data-disabled": $disabled ? "" : void 0
    })
  });
  const prevButton = makeElement(name("prevButton"), {
    stores: [isPrevButtonDisabled],
    returned: ([$isPrevButtonDisabled]) => {
      const disabled2 = $isPrevButtonDisabled;
      return {
        role: "button",
        type: "button",
        "aria-label": "Previous",
        "aria-disabled": disabled2 ? "true" : void 0,
        disabled: disabled2 ? true : void 0,
        "data-disabled": disabled2 ? "" : void 0
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        prevPage();
      }));
      return {
        destroy: unsub
      };
    }
  });
  const nextButton = makeElement(name("nextButton"), {
    stores: [isNextButtonDisabled],
    returned: ([$isNextButtonDisabled]) => {
      const disabled2 = $isNextButtonDisabled;
      return {
        role: "button",
        type: "button",
        "aria-label": "Next",
        "aria-disabled": disabled2 ? "true" : void 0,
        disabled: disabled2 ? true : void 0,
        "data-disabled": disabled2 ? "" : void 0
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        nextPage();
      }));
      return {
        destroy: unsub
      };
    }
  });
  const isSelectionStart = derived([startValue], ([$startValue]) => {
    return (date) => {
      if (!$startValue)
        return false;
      return isSameDay($startValue, date);
    };
  });
  const isSelectionEnd = derived([endValue], ([$endValue]) => {
    return (date) => {
      if (!$endValue)
        return false;
      return isSameDay($endValue, date);
    };
  });
  const isSelected = derived([startValue, endValue], ([$startValue, $endValue]) => {
    return (date) => {
      if ($startValue && isSameDay($startValue, date))
        return true;
      if ($endValue && isSameDay($endValue, date))
        return true;
      if ($endValue && $startValue) {
        return isBetweenInclusive(date, $startValue, $endValue);
      }
      return false;
    };
  });
  const highlightedRange = withGet.derived([startValue, endValue, focusedValue, isDateDisabled, isDateUnavailable], ([$startValue, $endValue, $focusedValue, $isDateDisabled, $isDateUnavailable]) => {
    if ($startValue && $endValue)
      return null;
    if (!$startValue || !$focusedValue)
      return null;
    const isStartBeforeFocused = isBefore($startValue, $focusedValue);
    const start = isStartBeforeFocused ? $startValue : $focusedValue;
    const end = isStartBeforeFocused ? $focusedValue : $startValue;
    if (isSameDay(start.add({ days: 1 }), end)) {
      return {
        start,
        end
      };
    }
    const isValid = areAllDaysBetweenValid(start, end, $isDateUnavailable, $isDateDisabled);
    if (isValid) {
      return {
        start,
        end
      };
    }
    return null;
  });
  const cell = makeElement(name("cell"), {
    stores: [
      isSelected,
      isSelectionEnd,
      isSelectionStart,
      highlightedRange,
      isDateDisabled,
      isDateUnavailable,
      placeholder,
      isOutsideVisibleMonths
    ],
    returned: ([$isSelected, $isSelectionEnd, $isSelectionStart, $highlightedRange, $isDateDisabled, $isDateUnavailable, $placeholder, $isOutsideVisibleMonths]) => {
      return (cellValue, monthValue) => {
        const cellDate = toDate(cellValue);
        const isDisabled = $isDateDisabled(cellValue);
        const isUnavailable = $isDateUnavailable(cellValue);
        const isDateToday = isToday(cellValue, getLocalTimeZone());
        const isOutsideMonth = !isSameMonth(cellValue, monthValue);
        const isFocusedDate = isSameDay(cellValue, $placeholder);
        const isOutsideVisibleMonths2 = $isOutsideVisibleMonths(cellValue);
        const isSelectedDate = $isSelected(cellValue);
        const isSelectionStart2 = $isSelectionStart(cellValue);
        const isSelectionEnd2 = $isSelectionEnd(cellValue);
        const isHighlighted = $highlightedRange ? isBetweenInclusive(cellValue, $highlightedRange.start, $highlightedRange.end) : false;
        const labelText = formatter.custom(cellDate, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        });
        return {
          role: "button",
          "aria-label": labelText,
          "aria-selected": isSelectedDate ? true : void 0,
          "aria-disabled": isOutsideMonth || isDisabled || isUnavailable ? true : void 0,
          "data-selected": isSelectedDate ? true : void 0,
          "data-selection-start": isSelectionStart2 ? true : void 0,
          "data-selection-end": isSelectionEnd2 ? true : void 0,
          "data-value": cellValue.toString(),
          "data-disabled": isDisabled || isOutsideMonth ? "" : void 0,
          "data-unavailable": isUnavailable ? "" : void 0,
          "data-today": isDateToday ? "" : void 0,
          "data-outside-month": isOutsideMonth ? "" : void 0,
          "data-outside-visible-months": isOutsideVisibleMonths2 ? "" : void 0,
          "data-focused": isFocusedDate ? "" : void 0,
          "data-highlighted": isHighlighted ? "" : void 0,
          tabindex: isFocusedDate ? 0 : isOutsideMonth || isDisabled ? void 0 : -1
        };
      };
    },
    action: (node) => {
      const getElArgs = () => {
        const value2 = node.getAttribute("data-value");
        const label = node.getAttribute("data-label");
        const disabled2 = node.hasAttribute("data-disabled");
        return {
          value: value2,
          label: label ?? node.textContent ?? null,
          disabled: disabled2 ? true : false
        };
      };
      const unsub = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        const args = getElArgs();
        if (args.disabled)
          return;
        if (!args.value)
          return;
        handleCellClick(e, parseStringToDateValue(args.value, placeholder.get()));
      }), addMeltEventListener(node, "mouseenter", () => {
        const args = getElArgs();
        if (args.disabled)
          return;
        if (!args.value)
          return;
        focusedValue.set(parseStringToDateValue(args.value, placeholder.get()));
      }), addMeltEventListener(node, "focusin", () => {
        const args = getElArgs();
        if (args.disabled)
          return;
        if (!args.value)
          return;
        focusedValue.set(parseStringToDateValue(args.value, placeholder.get()));
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect([locale], ([$locale]) => {
    if (formatter.getLocale() === $locale)
      return;
    formatter.setLocale($locale);
  });
  effect([placeholder], ([$placeholder]) => {
    if (!isBrowser || !$placeholder)
      return;
    const $visibleMonths = visibleMonths.get();
    if ($visibleMonths.some((month) => isSameMonth(month, $placeholder))) {
      return;
    }
    const $weekStartsOn = weekStartsOn.get();
    const $locale = locale.get();
    const $fixedWeeks = fixedWeeks.get();
    const $numberOfMonths = numberOfMonths.get();
    const defaultMonthProps = {
      weekStartsOn: $weekStartsOn,
      locale: $locale,
      fixedWeeks: $fixedWeeks,
      numberOfMonths: $numberOfMonths
    };
    months.set(createMonths({
      ...defaultMonthProps,
      dateObj: $placeholder
    }));
  });
  effect([weekStartsOn, locale, fixedWeeks, numberOfMonths], ([$weekStartsOn, $locale, $fixedWeeks, $numberOfMonths]) => {
    const $placeholder = placeholder.get();
    if (!isBrowser || !$placeholder)
      return;
    const defaultMonthProps = {
      weekStartsOn: $weekStartsOn,
      locale: $locale,
      fixedWeeks: $fixedWeeks,
      numberOfMonths: $numberOfMonths
    };
    months.set(createMonths({
      ...defaultMonthProps,
      dateObj: $placeholder
    }));
  });
  effect([fullCalendarLabel], ([$fullCalendarLabel]) => {
    if (!isBrowser)
      return;
    const node = document.getElementById(ids.accessibleHeading.get());
    if (!isHTMLElement(node))
      return;
    node.textContent = $fullCalendarLabel;
  });
  effect([startValue], ([$startValue]) => {
    if ($startValue && placeholder.get() !== $startValue) {
      placeholder.set($startValue);
    }
  });
  const weekdays = derived([months, weekdayFormat, locale], ([$months, $weekdayFormat, _]) => {
    if (!$months.length)
      return [];
    return $months[0].weeks[0].map((date) => {
      return formatter.dayOfWeek(toDate(date), $weekdayFormat);
    });
  });
  function createAccessibleHeading(node, label) {
    if (!isBrowser)
      return;
    const div = document.createElement("div");
    div.style.cssText = styleToString({
      border: "0px",
      clip: "rect(0px, 0px, 0px, 0px)",
      "clip-path": "inset(50%)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: "0px",
      position: "absolute",
      "white-space": "nowrap",
      width: "1px"
    });
    const h2 = document.createElement("div");
    h2.textContent = label;
    h2.id = ids.accessibleHeading.get();
    h2.role = "heading";
    h2.ariaLevel = "2";
    node.insertBefore(div, node.firstChild);
    div.appendChild(h2);
  }
  function nextPage() {
    const $months = months.get();
    const $numberOfMonths = numberOfMonths.get();
    if (pagedNavigation.get()) {
      const firstMonth = $months[0].value;
      placeholder.set(firstMonth.add({ months: $numberOfMonths }));
    } else {
      const firstMonth = $months[0].value;
      const newMonths = createMonths({
        dateObj: firstMonth.add({ months: 1 }),
        weekStartsOn: weekStartsOn.get(),
        locale: locale.get(),
        fixedWeeks: fixedWeeks.get(),
        numberOfMonths: $numberOfMonths
      });
      months.set(newMonths);
      placeholder.set(newMonths[0].value.set({ day: 1 }));
    }
  }
  function prevPage() {
    const $months = months.get();
    const $numberOfMonths = numberOfMonths.get();
    if (pagedNavigation.get()) {
      const firstMonth = $months[0].value;
      placeholder.set(firstMonth.subtract({ months: $numberOfMonths }));
    } else {
      const firstMonth = $months[0].value;
      const newMonths = createMonths({
        dateObj: firstMonth.subtract({ months: 1 }),
        weekStartsOn: weekStartsOn.get(),
        locale: locale.get(),
        fixedWeeks: fixedWeeks.get(),
        numberOfMonths: $numberOfMonths
      });
      months.set(newMonths);
      placeholder.set(newMonths[0].value.set({ day: 1 }));
    }
  }
  function nextYear() {
    placeholder.add({ years: 1 });
  }
  function prevYear() {
    placeholder.subtract({ years: 1 });
  }
  const ARROW_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT];
  function setYear(year) {
    placeholder.setDate({ year });
  }
  function setMonth(month) {
    if (month < 0 || month > 11)
      throw new Error("Month must be between 0 and 11");
    placeholder.setDate({ month });
  }
  function handleCellClick(e, date) {
    const $isDateDisabled = isDateDisabled.get();
    const $isDateUnavailable = isDateUnavailable.get();
    if ($isDateDisabled(date) || $isDateUnavailable(date))
      return;
    const $lastPressedDate = lastPressedDateValue.get();
    lastPressedDateValue.set(date);
    const $startValue = startValue.get();
    const $endValue = endValue.get();
    const $highlightedRange = highlightedRange.get();
    if ($startValue && $highlightedRange === null) {
      if (isSameDay($startValue, date) && !preventDeselect.get() && !$endValue) {
        startValue.set(void 0);
        placeholder.set(date);
        announcer.announce("Selected date is now empty.", "polite");
        return;
      } else if (!$endValue) {
        e.preventDefault();
        if ($lastPressedDate && isSameDay($lastPressedDate, date)) {
          startValue.set(date);
          announcer.announce(`Selected Date: ${formatter.selectedDate(date, false)}`, "polite");
        }
        return;
      }
    }
    if ($startValue && $endValue && isSameDay($endValue, date) && !preventDeselect.get()) {
      startValue.set(void 0);
      endValue.set(void 0);
      placeholder.set(date);
      announcer.announce("Selected date is now empty.", "polite");
      return;
    }
    if (!$startValue) {
      startValue.update(() => {
        announcer.announce(`Selected Date: ${formatter.selectedDate(date, false)}`, "polite");
        return date;
      });
    } else if (!$endValue) {
      endValue.update(() => {
        announcer.announce(`Selected Dates: ${formatter.selectedDate($startValue, false)} to ${formatter.selectedDate(date, false)}`, "polite");
        return date;
      });
    } else if ($endValue && $startValue) {
      endValue.set(void 0);
      startValue.update(() => {
        announcer.announce(`Selected Date: ${formatter.selectedDate(date, false)}`, "polite");
        return date;
      });
    }
  }
  const SELECT_KEYS = [kbd.ENTER, kbd.SPACE];
  function handleCalendarKeydown(e) {
    const currentCell = e.target;
    if (!isCalendarCell(currentCell))
      return;
    if (!ARROW_KEYS.includes(e.key) && !SELECT_KEYS.includes(e.key))
      return;
    e.preventDefault();
    if (e.key === kbd.ARROW_DOWN) {
      shiftFocus(currentCell, 7);
    }
    if (e.key === kbd.ARROW_UP) {
      shiftFocus(currentCell, -7);
    }
    if (e.key === kbd.ARROW_LEFT) {
      shiftFocus(currentCell, -1);
    }
    if (e.key === kbd.ARROW_RIGHT) {
      shiftFocus(currentCell, 1);
    }
    if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
      const cellValue = currentCell.getAttribute("data-value");
      if (!cellValue)
        return;
      handleCellClick(e, parseStringToDateValue(cellValue, placeholder.get()));
    }
  }
  function shiftFocus(node, add) {
    const $calendarId = ids.calendar.get();
    const candidateCells = getSelectableCells($calendarId);
    if (!candidateCells.length) {
      return;
    }
    const index = candidateCells.indexOf(node);
    const nextIndex = index + add;
    if (isValidIndex(nextIndex, candidateCells)) {
      const nextCell = candidateCells[nextIndex];
      setPlaceholderToNodeValue(nextCell, placeholder);
      return nextCell.focus();
    }
    if (nextIndex < 0) {
      if (isPrevButtonDisabled.get())
        return;
      const $months = months.get();
      const firstMonth = $months[0].value;
      const $numberOfMonths = numberOfMonths.get();
      placeholder.set(firstMonth.subtract({ months: $numberOfMonths }));
      tick().then(() => {
        const newCandidateCells = getSelectableCells($calendarId);
        if (!newCandidateCells.length) {
          return;
        }
        const newIndex = newCandidateCells.length - Math.abs(nextIndex);
        if (isValidIndex(newIndex, newCandidateCells)) {
          const newCell = newCandidateCells[newIndex];
          setPlaceholderToNodeValue(newCell, placeholder);
          return newCell.focus();
        }
      });
    }
    if (nextIndex >= candidateCells.length) {
      if (isNextButtonDisabled.get())
        return;
      const $months = months.get();
      const firstMonth = $months[0].value;
      const $numberOfMonths = numberOfMonths.get();
      placeholder.set(firstMonth.add({ months: $numberOfMonths }));
      tick().then(() => {
        const newCandidateCells = getSelectableCells($calendarId);
        if (!newCandidateCells.length) {
          return;
        }
        const newIndex = nextIndex - candidateCells.length;
        if (isValidIndex(newIndex, newCandidateCells)) {
          const nextCell = newCandidateCells[newIndex];
          return nextCell.focus();
        }
      });
    }
  }
  const _isDateDisabled = derived([isDateDisabled, placeholder, minValue, maxValue], ([$isDateDisabled, $placeholder, $minValue, $maxValue]) => {
    return (date) => {
      if ($isDateDisabled(date))
        return true;
      if ($minValue && isBefore(date, $minValue))
        return true;
      if ($maxValue && isAfter(date, $maxValue))
        return true;
      if (!isSameMonth(date, $placeholder))
        return true;
      return false;
    };
  });
  effect([value], ([$value]) => {
    const $startValue = startValue.get();
    const $endValue = endValue.get();
    if ($value?.start && $value?.end) {
      if ($value.start !== $startValue) {
        startValue.set($value.start);
      }
      if ($value.end !== $endValue) {
        endValue.set($value.end);
      }
      return;
    }
  });
  effect([startValue, endValue], ([$startValue, $endValue]) => {
    const $value = value.get();
    if ($value && $value?.start === $startValue && $value?.end === $endValue)
      return;
    if ($startValue && $endValue) {
      value.update((prev) => {
        if (prev?.start === $startValue && prev?.end === $endValue) {
          return prev;
        }
        if (isBefore($endValue, $startValue)) {
          return {
            start: $endValue,
            end: $startValue
          };
        } else {
          return {
            start: $startValue,
            end: $endValue
          };
        }
      });
    } else if ($value && $value.start && $value.end) {
      value.set({
        start: void 0,
        end: void 0
      });
    }
  });
  return {
    elements: {
      calendar,
      heading,
      grid,
      cell,
      nextButton,
      prevButton
    },
    states: {
      placeholder: placeholder.toWritable(),
      months,
      weekdays,
      headingValue,
      value,
      startValue,
      endValue
    },
    helpers: {
      nextPage,
      prevPage,
      nextYear,
      prevYear,
      setYear,
      setMonth,
      isDateDisabled: _isDateDisabled,
      isDateUnavailable
    },
    options,
    ids
  };
}
function getPaginationData() {
  const NAME = "pagination";
  const PARTS = ["root", "prev-button", "next-button", "page"];
  return {
    NAME,
    PARTS
  };
}
function setCtx$1(props) {
  const { NAME, PARTS } = getPaginationData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const pagination = { ...createPagination(removeUndefined(props)), getAttrs };
  setContext(NAME, pagination);
  return {
    ...pagination,
    updateOption: getOptionUpdater(pagination.options)
  };
}
function getCtx$1() {
  const { NAME } = getPaginationData();
  return getContext(NAME);
}
const Pagination$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["count", "page", "onPageChange", "perPage", "siblingCount", "asChild", "el"]);
  let $root, $$unsubscribe_root;
  let $pages, $$unsubscribe_pages;
  let $range, $$unsubscribe_range;
  let { count } = $$props;
  let { page = void 0 } = $$props;
  let { onPageChange = void 0 } = $$props;
  let { perPage = void 0 } = $$props;
  let { siblingCount = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, states: { pages, range, page: localPage }, getAttrs, updateOption } = setCtx$1({
    count,
    perPage,
    siblingCount,
    defaultPage: page,
    onPageChange: ({ next }) => {
      if (page !== next) {
        page = next;
        onPageChange?.(next);
      }
      return next;
    }
  });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_pages = subscribe(pages, (value) => $pages = value);
  $$unsubscribe_range = subscribe(range, (value) => $range = value);
  const attrs = getAttrs("root");
  if ($$props.count === void 0 && $$bindings.count && count !== void 0) $$bindings.count(count);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0) $$bindings.page(page);
  if ($$props.onPageChange === void 0 && $$bindings.onPageChange && onPageChange !== void 0) $$bindings.onPageChange(onPageChange);
  if ($$props.perPage === void 0 && $$bindings.perPage && perPage !== void 0) $$bindings.perPage(perPage);
  if ($$props.siblingCount === void 0 && $$bindings.siblingCount && siblingCount !== void 0) $$bindings.siblingCount(siblingCount);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  page !== void 0 && localPage.set(page);
  builder = $root;
  {
    Object.assign(builder, attrs);
  }
  {
    updateOption("count", count);
  }
  {
    updateOption("perPage", perPage);
  }
  {
    updateOption("siblingCount", siblingCount);
  }
  $$unsubscribe_root();
  $$unsubscribe_pages();
  $$unsubscribe_range();
  return `${asChild ? `${slots.default ? slots.default({ builder, pages: $pages, range: $range }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, pages: $pages, range: $range }) : ``}</div>`}`;
});
const Pagination_prev_button$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $prevButton, $$unsubscribe_prevButton;
  let { asChild = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { prevButton }, getAttrs } = getCtx$1();
  $$unsubscribe_prevButton = subscribe(prevButton, (value) => $prevButton = value);
  const attrs = getAttrs("prev-button");
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $prevButton;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_prevButton();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Pagination_next_button$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $nextButton, $$unsubscribe_nextButton;
  let { asChild = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { nextButton }, getAttrs } = getCtx$1();
  $$unsubscribe_nextButton = subscribe(nextButton, (value) => $nextButton = value);
  const attrs = getAttrs("next-button");
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $nextButton;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_nextButton();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Pagination_page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "page", "el"]);
  let $pageTrigger, $$unsubscribe_pageTrigger;
  let { asChild = void 0 } = $$props;
  let { page } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { pageTrigger }, getAttrs } = getCtx$1();
  $$unsubscribe_pageTrigger = subscribe(pageTrigger, (value) => $pageTrigger = value);
  const attrs = getAttrs("page");
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0) $$bindings.page(page);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $pageTrigger(page);
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_pageTrigger();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([{ type: "button" }, escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ` ${escape(page.value)} `}</button>`}`;
});
function getRangeCalendarData() {
  const NAME = "calendar";
  const PARTS = [
    "root",
    "prev-button",
    "next-button",
    "heading",
    "grid",
    "day",
    "header",
    "grid-head",
    "head-cell",
    "grid-body",
    "cell",
    "grid-row"
  ];
  return { NAME, PARTS };
}
function setCtx(props) {
  const { NAME, PARTS } = getRangeCalendarData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const rangeCalendar = { ...createRangeCalendar(removeUndefined(props)), getAttrs };
  setContext(NAME, rangeCalendar);
  return {
    ...rangeCalendar,
    updateOption: getOptionUpdater(rangeCalendar.options)
  };
}
function getCtx() {
  const { NAME } = getRangeCalendarData();
  return getContext(NAME);
}
const Range_calendar$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "placeholder",
    "onPlaceholderChange",
    "value",
    "onValueChange",
    "preventDeselect",
    "minValue",
    "maxValue",
    "pagedNavigation",
    "weekStartsOn",
    "locale",
    "isDateUnavailable",
    "isDateDisabled",
    "disabled",
    "readonly",
    "fixedWeeks",
    "calendarLabel",
    "asChild",
    "id",
    "weekdayFormat",
    "initialFocus",
    "startValue",
    "numberOfMonths",
    "el"
  ]);
  let $localMonths, $$unsubscribe_localMonths;
  let $calendar, $$unsubscribe_calendar;
  let $localStartValue, $$unsubscribe_localStartValue;
  let $weekdays, $$unsubscribe_weekdays;
  let $endValue, $$unsubscribe_endValue;
  let { placeholder = void 0 } = $$props;
  let { onPlaceholderChange = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { onValueChange = void 0 } = $$props;
  let { preventDeselect = void 0 } = $$props;
  let { minValue = void 0 } = $$props;
  let { maxValue = void 0 } = $$props;
  let { pagedNavigation = void 0 } = $$props;
  let { weekStartsOn = void 0 } = $$props;
  let { locale = void 0 } = $$props;
  let { isDateUnavailable = void 0 } = $$props;
  let { isDateDisabled = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { readonly: readonly2 = void 0 } = $$props;
  let { fixedWeeks = void 0 } = $$props;
  let { calendarLabel = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { weekdayFormat = void 0 } = $$props;
  let { initialFocus = false } = $$props;
  let { startValue = void 0 } = $$props;
  let { numberOfMonths = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { calendar }, states: { value: localValue, placeholder: localPlaceholder, months: localMonths, weekdays, startValue: localStartValue, endValue }, updateOption, ids, getAttrs } = setCtx({
    defaultPlaceholder: placeholder,
    defaultValue: value,
    preventDeselect,
    minValue,
    maxValue,
    pagedNavigation,
    weekStartsOn,
    locale,
    isDateUnavailable,
    isDateDisabled,
    disabled,
    readonly: readonly2,
    fixedWeeks,
    calendarLabel,
    weekdayFormat,
    numberOfMonths,
    onPlaceholderChange: ({ next }) => {
      if (placeholder !== next) {
        onPlaceholderChange?.(next);
        placeholder = next;
      }
      return next;
    },
    onValueChange: ({ next }) => {
      if (value !== next) {
        onValueChange?.(next);
        value = next;
      }
      return next;
    }
  });
  $$unsubscribe_calendar = subscribe(calendar, (value2) => $calendar = value2);
  $$unsubscribe_localMonths = subscribe(localMonths, (value2) => $localMonths = value2);
  $$unsubscribe_weekdays = subscribe(weekdays, (value2) => $weekdays = value2);
  $$unsubscribe_localStartValue = subscribe(localStartValue, (value2) => $localStartValue = value2);
  $$unsubscribe_endValue = subscribe(endValue, (value2) => $endValue = value2);
  const attrs = getAttrs("root");
  createDispatcher();
  let months = $localMonths;
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.onPlaceholderChange === void 0 && $$bindings.onPlaceholderChange && onPlaceholderChange !== void 0) $$bindings.onPlaceholderChange(onPlaceholderChange);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0) $$bindings.onValueChange(onValueChange);
  if ($$props.preventDeselect === void 0 && $$bindings.preventDeselect && preventDeselect !== void 0) $$bindings.preventDeselect(preventDeselect);
  if ($$props.minValue === void 0 && $$bindings.minValue && minValue !== void 0) $$bindings.minValue(minValue);
  if ($$props.maxValue === void 0 && $$bindings.maxValue && maxValue !== void 0) $$bindings.maxValue(maxValue);
  if ($$props.pagedNavigation === void 0 && $$bindings.pagedNavigation && pagedNavigation !== void 0) $$bindings.pagedNavigation(pagedNavigation);
  if ($$props.weekStartsOn === void 0 && $$bindings.weekStartsOn && weekStartsOn !== void 0) $$bindings.weekStartsOn(weekStartsOn);
  if ($$props.locale === void 0 && $$bindings.locale && locale !== void 0) $$bindings.locale(locale);
  if ($$props.isDateUnavailable === void 0 && $$bindings.isDateUnavailable && isDateUnavailable !== void 0) $$bindings.isDateUnavailable(isDateUnavailable);
  if ($$props.isDateDisabled === void 0 && $$bindings.isDateDisabled && isDateDisabled !== void 0) $$bindings.isDateDisabled(isDateDisabled);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly2 !== void 0) $$bindings.readonly(readonly2);
  if ($$props.fixedWeeks === void 0 && $$bindings.fixedWeeks && fixedWeeks !== void 0) $$bindings.fixedWeeks(fixedWeeks);
  if ($$props.calendarLabel === void 0 && $$bindings.calendarLabel && calendarLabel !== void 0) $$bindings.calendarLabel(calendarLabel);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.weekdayFormat === void 0 && $$bindings.weekdayFormat && weekdayFormat !== void 0) $$bindings.weekdayFormat(weekdayFormat);
  if ($$props.initialFocus === void 0 && $$bindings.initialFocus && initialFocus !== void 0) $$bindings.initialFocus(initialFocus);
  if ($$props.startValue === void 0 && $$bindings.startValue && startValue !== void 0) $$bindings.startValue(startValue);
  if ($$props.numberOfMonths === void 0 && $$bindings.numberOfMonths && numberOfMonths !== void 0) $$bindings.numberOfMonths(numberOfMonths);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.calendar.set(id);
    }
  }
  startValue = $localStartValue;
  value !== void 0 && localValue.set(value);
  placeholder !== void 0 && localPlaceholder.set(placeholder);
  {
    updateOption("preventDeselect", preventDeselect);
  }
  {
    updateOption("minValue", minValue);
  }
  {
    updateOption("maxValue", maxValue);
  }
  {
    updateOption("pagedNavigation", pagedNavigation);
  }
  {
    updateOption("weekStartsOn", weekStartsOn);
  }
  {
    updateOption("locale", locale);
  }
  {
    updateOption("isDateUnavailable", isDateUnavailable);
  }
  {
    updateOption("isDateDisabled", isDateDisabled);
  }
  {
    updateOption("disabled", disabled);
  }
  {
    updateOption("readonly", readonly2);
  }
  {
    updateOption("fixedWeeks", fixedWeeks);
  }
  {
    updateOption("calendarLabel", calendarLabel);
  }
  {
    updateOption("weekdayFormat", weekdayFormat);
  }
  {
    updateOption("numberOfMonths", numberOfMonths);
  }
  builder = $calendar;
  {
    Object.assign(builder, attrs);
  }
  months = $localMonths;
  $$unsubscribe_localMonths();
  $$unsubscribe_calendar();
  $$unsubscribe_localStartValue();
  $$unsubscribe_weekdays();
  $$unsubscribe_endValue();
  return `${asChild ? `${slots.default ? slots.default({
    builder,
    months,
    weekdays: $weekdays,
    startValue: $localStartValue,
    endValue: $endValue
  }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({
    builder,
    months,
    weekdays: $weekdays,
    startValue: $localStartValue,
    endValue: $endValue
  }) : ``}</div>`}`;
});
const Range_calendar_day$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let disabled;
  let unavailable;
  let $$restProps = compute_rest_props($$props, ["date", "month", "asChild", "el"]);
  let $isDateUnavailable, $$unsubscribe_isDateUnavailable;
  let $isDateDisabled, $$unsubscribe_isDateDisabled;
  let $cell, $$unsubscribe_cell;
  let { date } = $$props;
  let { month } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { cell }, helpers: { isDateDisabled, isDateUnavailable }, getAttrs } = getCtx();
  $$unsubscribe_cell = subscribe(cell, (value) => $cell = value);
  $$unsubscribe_isDateDisabled = subscribe(isDateDisabled, (value) => $isDateDisabled = value);
  $$unsubscribe_isDateUnavailable = subscribe(isDateUnavailable, (value) => $isDateUnavailable = value);
  const attrs = getAttrs("day");
  createDispatcher();
  if ($$props.date === void 0 && $$bindings.date && date !== void 0) $$bindings.date(date);
  if ($$props.month === void 0 && $$bindings.month && month !== void 0) $$bindings.month(month);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $cell(date, month);
  {
    Object.assign(builder, attrs);
  }
  disabled = $isDateDisabled(date);
  unavailable = $isDateUnavailable(date);
  $$unsubscribe_isDateUnavailable();
  $$unsubscribe_isDateDisabled();
  $$unsubscribe_cell();
  return `${asChild ? `${slots.default ? slots.default({ builder, disabled, unavailable }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, disabled, unavailable }) : ` ${escape(date.day)} `}</div>`}`;
});
const Range_calendar_grid$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $grid, $$unsubscribe_grid;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { grid }, getAttrs } = getCtx();
  $$unsubscribe_grid = subscribe(grid, (value) => $grid = value);
  const attrs = getAttrs("grid");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $grid;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_grid();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<table${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</table>`}`;
});
const Range_calendar_grid_body$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getAttrs } = getCtx();
  const attrs = getAttrs("grid-body");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<tbody${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</tbody>`}`;
});
const Range_calendar_cell$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let $$restProps = compute_rest_props($$props, ["date", "asChild", "el"]);
  let $isDateUnavailable, $$unsubscribe_isDateUnavailable;
  let $isDateDisabled, $$unsubscribe_isDateDisabled;
  let { date } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { helpers: { isDateDisabled, isDateUnavailable }, getAttrs } = getCtx();
  $$unsubscribe_isDateDisabled = subscribe(isDateDisabled, (value) => $isDateDisabled = value);
  $$unsubscribe_isDateUnavailable = subscribe(isDateUnavailable, (value) => $isDateUnavailable = value);
  if ($$props.date === void 0 && $$bindings.date && date !== void 0) $$bindings.date(date);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = {
    ...getAttrs("cell"),
    "aria-disabled": $isDateDisabled(date) || $isDateUnavailable(date),
    role: "gridcell"
  };
  $$unsubscribe_isDateUnavailable();
  $$unsubscribe_isDateDisabled();
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<td${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</td>`}`;
});
const Range_calendar_grid_head$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getAttrs } = getCtx();
  const attrs = {
    ...getAttrs("grid-head"),
    "aria-hidden": true
  };
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<thead${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</thead>`}`;
});
const Range_calendar_head_cell$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getAttrs } = getCtx();
  const attrs = getAttrs("head-cell");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<th${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</th>`}`;
});
const Range_calendar_grid_row$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getAttrs } = getCtx();
  const attrs = getAttrs("grid-row");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<tr${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</tr>`}`;
});
const Range_calendar_header$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getAttrs } = getCtx();
  const attrs = getAttrs("header");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<header${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</header>`}`;
});
const Range_calendar_heading$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $heading, $$unsubscribe_heading;
  let $headingValue, $$unsubscribe_headingValue;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { heading }, states: { headingValue }, getAttrs } = getCtx();
  $$unsubscribe_heading = subscribe(heading, (value) => $heading = value);
  $$unsubscribe_headingValue = subscribe(headingValue, (value) => $headingValue = value);
  const attrs = getAttrs("heading");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $heading;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_heading();
  $$unsubscribe_headingValue();
  return `${asChild ? `${slots.default ? slots.default({ builder, headingValue: $headingValue }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, headingValue: $headingValue }) : ` ${escape($headingValue)} `}</div>`}`;
});
const Range_calendar_next_button$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $nextButton, $$unsubscribe_nextButton;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { nextButton }, getAttrs } = getCtx();
  $$unsubscribe_nextButton = subscribe(nextButton, (value) => $nextButton = value);
  const attrs = getAttrs("next-button");
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $nextButton;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_nextButton();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Range_calendar_prev_button$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $prevButton, $$unsubscribe_prevButton;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { prevButton }, getAttrs } = getCtx();
  $$unsubscribe_prevButton = subscribe(prevButton, (value) => $prevButton = value);
  const attrs = getAttrs("prev-button");
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $prevButton;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_prevButton();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Calendar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M8 2v4" }],
    ["path", { "d": "M16 2v4" }],
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "4",
        "rx": "2"
      }
    ],
    ["path", { "d": "M3 10h18" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "calendar" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Chevron_left = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "chevron-left" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Ellipsis = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "1" }],
    ["circle", { "cx": "19", "cy": "12", "r": "1" }],
    ["circle", { "cx": "5", "cy": "12", "r": "1" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "ellipsis" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Filter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "polygon",
      {
        "points": "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "filter" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const watas = writable([]);
const Pagination = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentPage;
  let $$restProps = compute_rest_props($$props, ["class", "count", "perPage", "page", "siblingCount"]);
  let { class: className = void 0 } = $$props;
  let { count = 0 } = $$props;
  let { perPage = 10 } = $$props;
  let { page = 1 } = $$props;
  let { siblingCount = 1 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.count === void 0 && $$bindings.count && count !== void 0) $$bindings.count(count);
  if ($$props.perPage === void 0 && $$bindings.perPage && perPage !== void 0) $$bindings.perPage(perPage);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0) $$bindings.page(page);
  if ($$props.siblingCount === void 0 && $$bindings.siblingCount && siblingCount !== void 0) $$bindings.siblingCount(siblingCount);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    currentPage = page;
    $$rendered = `${validate_component(Pagination$1, "PaginationPrimitive.Root").$$render(
      $$result,
      Object.assign({}, { count }, { perPage }, { siblingCount }, { asChild: true }, $$restProps, { page }),
      {
        page: ($$value) => {
          page = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ builder, pages, range }) => {
          return `<nav${spread(
            [
              escape_object(builder),
              {
                class: escape_attribute_value(cn("mx-auto flex w-full flex-col items-center", className))
              }
            ],
            {}
          )}>${slots.default ? slots.default({ pages, range, currentPage }) : ``}</nav>`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Pagination_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<ul${spread(
    [
      {
        class: escape_attribute_value(cn("flex flex-row items-center gap-1", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</ul>`;
});
const Pagination_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<li${spread(
    [
      {
        class: escape_attribute_value(cn("", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</li>`;
});
const Pagination_link = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "page", "size", "isActive"]);
  let { class: className = void 0 } = $$props;
  let { page } = $$props;
  let { size = "icon" } = $$props;
  let { isActive = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0) $$bindings.page(page);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.isActive === void 0 && $$bindings.isActive && isActive !== void 0) $$bindings.isActive(isActive);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Pagination_page, "PaginationPrimitive.Page").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn(
            buttonVariants({
              variant: isActive ? "outline" : "ghost",
              size
            }),
            className
          )
        },
        $$restProps,
        { page }
      ),
      {
        page: ($$value) => {
          page = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : `${escape(page.value)}`}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Pagination_prev_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Pagination_prev_button$1, "PaginationPrimitive.PrevButton").$$render($$result, { asChild: true }, {}, {
    default: ({ builder }) => {
      return `${validate_component(Button, "Button").$$render($$result, Object.assign({}, { variant: "ghost" }, { class: cn("gap-1 pl-2.5", className) }, { builders: [builder] }, $$restProps), {}, {
        default: () => {
          return `${slots.default ? slots.default({}) : ` ${validate_component(Chevron_left, "ChevronLeft").$$render($$result, { class: "h-4 w-4" }, {}, {})} `}`;
        }
      })}`;
    }
  })}`;
});
const Pagination_next_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Pagination_next_button$1, "PaginationPrimitive.NextButton").$$render($$result, { asChild: true }, {}, {
    default: ({ builder }) => {
      return `${validate_component(Button, "Button").$$render($$result, Object.assign({}, { variant: "ghost" }, { class: cn("gap-1 pr-2.5", className) }, { builders: [builder] }, $$restProps), {}, {
        default: () => {
          return `${slots.default ? slots.default({}) : ` ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { class: "h-4 w-4" }, {}, {})} `}`;
        }
      })}`;
    }
  })}`;
});
const Pagination_ellipsis = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<span${spread(
    [
      { "aria-hidden": true },
      {
        class: escape_attribute_value(cn("flex h-9 w-9 items-center justify-center", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${validate_component(Ellipsis, "Ellipsis").$$render($$result, { class: "h-4 w-4" }, {}, {})} <span class="sr-only" data-svelte-h="svelte-1krwd1q">More pages</span></span>`;
});
const Range_calendar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["value", "placeholder", "weekdayFormat", "startValue", "class"]);
  let { value = void 0 } = $$props;
  let { placeholder = void 0 } = $$props;
  let { weekdayFormat = "short" } = $$props;
  let { startValue = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.weekdayFormat === void 0 && $$bindings.weekdayFormat && weekdayFormat !== void 0) $$bindings.weekdayFormat(weekdayFormat);
  if ($$props.startValue === void 0 && $$bindings.startValue && startValue !== void 0) $$bindings.startValue(startValue);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Range_calendar$1, "RangeCalendarPrimitive.Root").$$render(
      $$result,
      Object.assign({}, { weekdayFormat }, { class: cn("p-3", className) }, $$restProps, { value }, { placeholder }, { startValue }),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        },
        placeholder: ($$value) => {
          placeholder = $$value;
          $$settled = false;
        },
        startValue: ($$value) => {
          startValue = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ months, weekdays }) => {
          return `${validate_component(Range_calendar_header, "RangeCalendar.Header").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Range_calendar_prev_button, "RangeCalendar.PrevButton").$$render($$result, {}, {}, {})} ${validate_component(Range_calendar_heading, "RangeCalendar.Heading").$$render($$result, {}, {}, {})} ${validate_component(Range_calendar_next_button, "RangeCalendar.NextButton").$$render($$result, {}, {}, {})}`;
            }
          })} ${validate_component(Range_calendar_months, "RangeCalendar.Months").$$render($$result, {}, {}, {
            default: () => {
              return `${each(months, (month) => {
                return `${validate_component(Range_calendar_grid, "RangeCalendar.Grid").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(Range_calendar_grid_head, "RangeCalendar.GridHead").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(Range_calendar_grid_row, "RangeCalendar.GridRow").$$render($$result, { class: "flex" }, {}, {
                          default: () => {
                            return `${each(weekdays, (weekday) => {
                              return `${validate_component(Range_calendar_head_cell, "RangeCalendar.HeadCell").$$render($$result, {}, {}, {
                                default: () => {
                                  return `${escape(weekday.slice(0, 2))} `;
                                }
                              })}`;
                            })} `;
                          }
                        })} `;
                      }
                    })} ${validate_component(Range_calendar_grid_body, "RangeCalendar.GridBody").$$render($$result, {}, {}, {
                      default: () => {
                        return `${each(month.weeks, (weekDates) => {
                          return `${validate_component(Range_calendar_grid_row, "RangeCalendar.GridRow").$$render($$result, { class: "mt-2 w-full" }, {}, {
                            default: () => {
                              return `${each(weekDates, (date) => {
                                return `${validate_component(Range_calendar_cell, "RangeCalendar.Cell").$$render($$result, { date }, {}, {
                                  default: () => {
                                    return `${validate_component(Range_calendar_day, "RangeCalendar.Day").$$render($$result, { date, month: month.value }, {}, {})} `;
                                  }
                                })}`;
                              })} `;
                            }
                          })}`;
                        })} `;
                      }
                    })} `;
                  }
                })}`;
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Range_calendar_cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["date", "class"]);
  let { date } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.date === void 0 && $$bindings.date && date !== void 0) $$bindings.date(date);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_cell$1, "RangeCalendarPrimitive.Cell").$$render(
    $$result,
    Object.assign(
      {},
      { date },
      {
        class: cn("[&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50 relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md [&:has([data-selected][data-selection-end])]:rounded-r-md [&:has([data-selected][data-selection-start])]:rounded-l-md", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Range_calendar_day = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["date", "month", "class"]);
  let { date } = $$props;
  let { month } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.date === void 0 && $$bindings.date && date !== void 0) $$bindings.date(date);
  if ($$props.month === void 0 && $$bindings.month && month !== void 0) $$bindings.month(month);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_day$1, "RangeCalendarPrimitive.Day").$$render(
    $$result,
    Object.assign(
      {},
      { date },
      { month },
      {
        class: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal data-[selected]:opacity-100",
          "[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground",
          // Selection Start
          "data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground data-[selection-start]:hover:bg-primary data-[selection-start]:hover:text-primary-foreground data-[selection-start]:focus:bg-primary data-[selection-start]:focus:text-primary-foreground",
          // Selection End
          "data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[selection-end]:hover:bg-primary data-[selection-end]:hover:text-primary-foreground data-[selection-end]:focus:bg-primary data-[selection-end]:focus:text-primary-foreground",
          // Outside months
          "data-[outside-month]:text-muted-foreground [&[data-outside-month][data-selected]]:bg-accent/50 [&[data-outside-month][data-selected]]:text-muted-foreground data-[outside-month]:pointer-events-none data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:opacity-30",
          // Disabled
          "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
          // Unavailable
          "data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through",
          className
        )
      },
      $$restProps
    ),
    {},
    {
      default: ({ disabled, unavailable, builder }) => {
        return `${slots.default ? slots.default({ disabled, unavailable, builder }) : ` ${escape(date.day)} `}`;
      }
    }
  )}`;
});
const Range_calendar_grid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_grid$1, "RangeCalendarPrimitive.Grid").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("w-full border-collapse space-y-1", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Range_calendar_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_header$1, "RangeCalendarPrimitive.Header").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("relative flex w-full items-center justify-between pt-1", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Range_calendar_months = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Range_calendar_grid_row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_grid_row$1, "RangeCalendarPrimitive.GridRow").$$render($$result, Object.assign({}, { class: cn("flex", className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Range_calendar_heading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_heading$1, "RangeCalendarPrimitive.Heading").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-sm font-medium", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ headingValue }) => {
        return `${slots.default ? slots.default({ headingValue }) : ` ${escape(headingValue)} `}`;
      }
    }
  )}`;
});
const Range_calendar_grid_body = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_grid_body$1, "RangeCalendarPrimitive.GridBody").$$render($$result, Object.assign({}, { class: cn(className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Range_calendar_grid_head = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_grid_head$1, "RangeCalendarPrimitive.GridHead").$$render($$result, Object.assign({}, { class: cn(className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Range_calendar_head_cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_head_cell$1, "RangeCalendarPrimitive.HeadCell").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-muted-foreground w-9 rounded-md text-[0.8rem] font-normal", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Range_calendar_next_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_next_button$1, "RangeCalendarPrimitive.NextButton").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ builder }) => {
        return `${slots.default ? slots.default({ builder }) : ` ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { class: "h-4 w-4" }, {}, {})} `}`;
      }
    }
  )}`;
});
const Range_calendar_prev_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Range_calendar_prev_button$1, "RangeCalendarPrimitive.PrevButton").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ builder }) => {
        return `${slots.default ? slots.default({ builder }) : ` ${validate_component(Chevron_left, "ChevronLeft").$$render($$result, { class: "h-4 w-4" }, {}, {})} `}`;
      }
    }
  )}`;
});
const Range_date_picker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const df = new DateFormatter("ko-KR", { dateStyle: "short" });
  let { value = { start: void 0, end: void 0 } } = $$props;
  let startValue = void 0;
  function formatDateRange(startDate, endDate) {
    if (!endDate || !startDate) {
      return "1일";
    }
    const days = differenceInDays(endDate, startDate);
    const weeks = differenceInWeeks(endDate, startDate);
    const months = differenceInMonths(endDate, startDate);
    const years = differenceInYears(endDate, startDate);
    if (years > 0) {
      return `약 ${years} 년`;
    } else if (months > 0) {
      return `약 ${months} 개월`;
    } else if (weeks > 0) {
      return `약 ${weeks} 주`;
    } else {
      return `약 ${days + 1} 일`;
    }
  }
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (!value) {
        value = { start: void 0, end: void 0 };
        startValue = void 0;
      }
    }
    $$rendered = `<div class="grid gap-2">${validate_component(Root, "Popover.Root").$$render($$result, { openFocus: true }, {}, {
      default: () => {
        return `${validate_component(Trigger, "Popover.Trigger").$$render($$result, { asChild: true }, {}, {
          default: ({ builder }) => {
            return `${validate_component(Button, "Button").$$render(
              $$result,
              {
                variant: "outline",
                class: cn("w-[300px] justify-start text-left font-normal", !value && "text-muted-foreground"),
                builders: [builder]
              },
              {},
              {
                default: () => {
                  return `${validate_component(Calendar, "CalendarIcon").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})} ${value && value?.start ? `${value?.end ? `${escape(df.format(value?.start.toDate(getLocalTimeZone())))} - ${escape(df.format(value?.end.toDate(getLocalTimeZone())))}

            (${escape(formatDateRange(value?.start.toDate(getLocalTimeZone()), value.end.toDate(getLocalTimeZone())))})` : `${escape(df.format(value?.start.toDate(getLocalTimeZone())))}

            (${escape(formatDateRange(value?.start.toDate(getLocalTimeZone()), void 0))})`}` : `${startValue ? `${escape(df.format(startValue.toDate(getLocalTimeZone())))}

          (${escape(formatDateRange(startValue.toDate(getLocalTimeZone()), void 0))})` : `Pick a date`}`}`;
                }
              }
            )}`;
          }
        })} ${validate_component(Popover_content, "Popover.Content").$$render($$result, { class: "w-auto p-0", align: "start" }, {}, {
          default: () => {
            return `${validate_component(Range_calendar, "RangeCalendar").$$render(
              $$result,
              {
                initialFocus: true,
                numberOfMonths: 2,
                placeholder: value?.start,
                value,
                startValue
              },
              {
                value: ($$value) => {
                  value = $$value;
                  $$settled = false;
                },
                startValue: ($$value) => {
                  startValue = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}`;
      }
    })}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const DataFilterForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { handleSubmit = (searchConditions) => {
  } } = $$props;
  let open = false;
  const filterValues = {
    categories: {
      name: "카테고리",
      values: [
        { id: "1", name: "게임" },
        {
          id: "2",
          name: "공연/전시"
        },
        { id: "3", name: "만화" },
        { id: "4", name: "서적" },
        { id: "5", name: "영상" }
      ]
    },
    label: {
      name: "라벨",
      values: [
        {
          name: "검수전",
          id: "NEED_CHECK"
        },
        {
          name: "검수중",
          id: "CHECKING"
        },
        {
          name: "검수완료",
          id: "CHECKED"
        },
        { name: "보류", id: "HOLD" },
        {
          name: "컨택필요",
          id: "NEED_CONTACT"
        },
        { name: "탈락", id: "CENSOR" }
      ]
    },
    needWriteItems: {
      name: "미입력항목",
      values: [
        {
          id: "creator",
          name: "작가/감독"
        },
        { id: "genre", name: "장르" },
        {
          id: "keywords",
          name: "키워드"
        },
        {
          id: "platforms",
          name: "플랫폼"
        },
        {
          id: "thumbnail",
          name: "썸네일"
        }
      ]
    }
  };
  const formData = {
    title: "",
    label: [],
    categories: [],
    updateDate: null,
    isPublished: null,
    needWriteItems: []
  };
  if ($$props.handleSubmit === void 0 && $$bindings.handleSubmit && handleSubmit !== void 0) $$bindings.handleSubmit(handleSubmit);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Drawer, "Drawer.Root").$$render(
      $$result,
      { shouldScaleBackground: false, open },
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Trigger$1, "Drawer.Trigger").$$render($$result, {}, {}, {
            default: ({ builder }) => {
              return `<div class="fixed end-6 bottom-6">${validate_component(Button, "Button").$$render(
                $$result,
                {
                  builders: [builder],
                  class: "w-14 h-14 rounded-full shadow-lg"
                },
                {},
                {
                  default: () => {
                    return `${validate_component(Filter, "FilterIcon").$$render($$result, {}, {}, {})}`;
                  }
                }
              )}</div>`;
            }
          })} ${validate_component(Drawer_content, "Drawer.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Drawer_header, "Drawer.Header").$$render($$result, { class: "flex flex-row justify-between" }, {}, {
                default: () => {
                  return `${validate_component(Drawer_title, "Drawer.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `데이터 검색`;
                    }
                  })} ${validate_component(Close, "Drawer.Close").$$render($$result, {}, {}, {
                    default: () => {
                      return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${add_attribute("stroke-width", 1.5, 0)} stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg>`;
                    }
                  })}`;
                }
              })} <div class="p-8"><div class="space-y-3">${each(Object.keys(filterValues), (filterKey) => {
                return `<div class="space-y-2"><div class="flex gap-2"><h6 class="font-bold text-sm">${escape(filterValues[filterKey].name)}</h6> ${validate_component(Button, "Button").$$render(
                  $$result,
                  {
                    variant: "ghost",
                    class: "text-gray-400 h-[20px] w-[40px] text-xs"
                  },
                  {},
                  {
                    default: () => {
                      return `초기화`;
                    }
                  }
                )}</div> <ul class="grid grid-cols-3 items-center w-full bg-white rounded-md overflow-hidden">${each(filterValues[filterKey].values, (value) => {
                  let checked = formData[filterKey].includes(value.id);
                  return ` <li class="${"w-full " + escape(checked ? "bg-gray-200" : "", true) + " hover:bg-gray-300"}">${validate_component(Label, "Label").$$render(
                    $$result,
                    {
                      class: "text-[13px] cursor-pointer flex w-full p-2 truncate",
                      for: `${filterKey}-${value.id}`
                    },
                    {},
                    {
                      default: () => {
                        return `${escape(value.name)}`;
                      }
                    }
                  )} <input hidden type="checkbox"${add_attribute("id", `${filterKey}-${value.id}`, 0)}${add_attribute("name", filterKey, 0)}${add_attribute("value", value.id, 0)} ${checked ? "checked" : ""}> </li>`;
                })} </ul></div> <hr>`;
              })} <div class="space-y-2"><div class="flex gap-2"><h6 class="font-bold text-sm" data-svelte-h="svelte-1elea8q">마지막 수정일</h6> ${validate_component(Button, "Button").$$render(
                $$result,
                {
                  variant: "ghost",
                  class: "text-gray-400 h-[20px] w-[40px] text-xs"
                },
                {},
                {
                  default: () => {
                    return `초기화`;
                  }
                }
              )}</div> ${validate_component(Range_date_picker, "RangeDatePicker").$$render(
                $$result,
                { value: formData.updateDate },
                {
                  value: ($$value) => {
                    formData.updateDate = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div></div></div> ${validate_component(Drawer_footer, "Drawer.Footer").$$render($$result, { class: "flex flex-row-reverse" }, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, { class: "w-[120px]" }, {}, {
                    default: () => {
                      return `검색`;
                    }
                  })} ${validate_component(Button, "Button").$$render($$result, { class: "w-[120px]", variant: "ghost" }, {}, {
                    default: () => {
                      return `전체 초기화`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
let pageSize = 10;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $watas, $$unsubscribe_watas;
  $$unsubscribe_watas = subscribe(watas, (value) => $watas = value);
  let inputPage = "";
  let currentPage = 1;
  let searchConditions = {};
  let totalCount = 0;
  async function fetchData() {
    try {
      const { title, categories, label, updateDate, isPublished, needWriteItems } = searchConditions;
      const params = {
        page: currentPage,
        pageSize,
        ...title && { title },
        ...categories && categories.length > 0 && { categories },
        ...label && label.length > 0 && { label: label.join(",") },
        ...updateDate?.start && {
          updateStartDate: new Date(updateDate.start)?.toLocaleDateString("en-CA")
        },
        ...updateDate?.end && {
          updateEndDate: new Date(updateDate?.end)?.toLocaleDateString("en-CA")
        },
        ...isPublished && { isPublished },
        ...needWriteItems && needWriteItems.length > 0 && { needWriteItems: needWriteItems.join(",") }
      };
      let queryString = "";
      if (params) {
        queryString += Object.keys(params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
      }
      const response = await axiosInstance.get(`/watas?${queryString}`);
      const newData = response.data;
      totalCount = newData.totalCount;
      watas.set(newData.watas);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      fetchData();
    }
    {
      fetchData();
    }
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-x99id9_START -->${$$result.title = `<title>데이터 관리</title>`, ""}<!-- HEAD_svelte-x99id9_END -->`, ""} <div class="text-lg my-4 font-bold" data-svelte-h="svelte-1ur49jh"><h1>데이터 관리</h1></div> <section class="mt-4"><article class="space-y-10"><div class="space-y-4">${each($watas, (wata) => {
      return `${validate_component(DataCard, "DataCard").$$render($$result, { data: wata }, {}, {})}`;
    })}</div> <div class="flex flex-col items-center gap-5">${validate_component(Pagination, "Pagination.Root").$$render(
      $$result,
      {
        count: totalCount,
        perPage: pageSize,
        siblingCount: 1,
        page: currentPage
      },
      {},
      {
        default: ({ pages }) => {
          return `${validate_component(Pagination_content, "Pagination.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Pagination_item, "Pagination.Item").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Pagination_prev_button, "Pagination.PrevButton").$$render($$result, {}, {}, {})}`;
                }
              })} ${each(pages, (page) => {
                return `${page.type === "ellipsis" ? `${validate_component(Pagination_item, "Pagination.Item").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(Pagination_ellipsis, "Pagination.Ellipsis").$$render($$result, {}, {}, {})} `;
                  }
                })}` : `${validate_component(Pagination_item, "Pagination.Item").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(Pagination_link, "Pagination.Link").$$render(
                      $$result,
                      {
                        page,
                        isActive: currentPage == page.value,
                        class: "text-xs w-[35px] h-[35px]"
                      },
                      {},
                      {
                        default: () => {
                          return `${escape(page.value)} `;
                        }
                      }
                    )} `;
                  }
                })}`}`;
              })} ${validate_component(Pagination_item, "Pagination.Item").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Pagination_next_button, "Pagination.NextButton").$$render($$result, {}, {}, {})}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}  <div class="flex items-center space-x-2 ml-4"><p class="text-xs" data-svelte-h="svelte-fj0lx0">Move to ...</p> ${validate_component(Input, "Input").$$render(
      $$result,
      {
        type: "number",
        placeholder: "Page No",
        class: "text-xs w-24",
        value: inputPage
      },
      {
        value: ($$value) => {
          inputPage = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Button, "Button").$$render($$result, { class: "text-xs rounded-md" }, {}, {
      default: () => {
        return `이동`;
      }
    })}</div></div></article></section> ${validate_component(DataFilterForm, "DataFilterForm").$$render(
      $$result,
      {
        handleSubmit: async (formData) => {
          searchConditions = formData;
          {
            await fetchData();
          }
        }
      },
      {},
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_watas();
  return $$rendered;
});
export {
  Page as default
};
