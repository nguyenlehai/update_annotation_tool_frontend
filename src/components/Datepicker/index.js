import { DatePicker } from "antd";
import moment from "moment";

/**
 *
 * @param {import("antd/lib/date-picker").MonthPickerProps} props
 * @returns
 */
export const MonthPicker = (props) => (
  <DatePicker.MonthPicker
    {...props}
    value={moment.isMoment(props.value) ? props.value : moment(props.value)}
  />
);
/**
 *
 * @param {import("antd/lib/date-picker/generatePicker").PickerTimeProps} props
 * @returns
 */
export const QuarterPicker = (props) => (
  <DatePicker.QuarterPicker
    {...props}
    value={moment.isMoment(props.value) ? props.value : moment(props.value)}
  />
);
/**
 *
 * @param {import("antd/lib/date-picker").RangePickerProps} props
 * @returns
 */
export const RangePicker = (props) => (
  <DatePicker.RangePicker
    {...props}
    value={
      Array.isArray(props.value)
        ? props.value.map((value) => (value ? moment(value) : null))
        : null
    }
  />
);
/**
 *
 * @param {import("antd").TimePickerProps} props
 * @returns
 */
export const TimePicker = (props) => (
  <DatePicker.TimePicker
    {...props}
    value={moment.isMoment(props.value) ? props.value : moment(props.value)}
  />
);
/**
 *
 * @param {import("antd/lib/date-picker").WeekPickerProps} props
 * @returns
 */
export const WeekPicker = (props) => (
  <DatePicker.WeekPicker
    {...props}
    value={moment.isMoment(props.value) ? props.value : moment(props.value)}
  />
);
/**
 *
 * @param {import("antd/lib/date-picker/generatePicker").PickerDateProps} props
 * @returns
 */
export const YearPicker = (props) => (
  <DatePicker.YearPicker
    {...props}
    value={moment.isMoment(props.value) ? props.value : moment(props.value)}
  />
);
