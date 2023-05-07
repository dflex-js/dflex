import { eventDebounce } from "../src";

jest.useFakeTimers();

describe("eventDebounce", () => {
  let listener: jest.Mock;
  let debounceControl: ReturnType<typeof eventDebounce>;

  beforeEach(() => {
    listener = jest.fn();
    debounceControl = eventDebounce(listener);
  });

  afterEach(() => {
    debounceControl.pause();
    jest.clearAllTimers();
  });

  test("Executes the listener immediately if immediate flag is set", () => {
    debounceControl = eventDebounce(listener, true);
    debounceControl();
    expect(listener).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("Executes the listener after the throttle period", () => {
    debounceControl();
    expect(listener).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("Executes the last call one time", () => {
    debounceControl();
    debounceControl();
    debounceControl();
    debounceControl();
    debounceControl();
    jest.runAllTimers();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("Pauses and resumes the debounce control", () => {
    debounceControl();
    debounceControl.pause();
    jest.runAllTimers();
    expect(listener).not.toHaveBeenCalled();
    debounceControl.resume();
    jest.runAllTimers();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
