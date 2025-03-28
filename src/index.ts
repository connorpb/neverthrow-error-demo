import { Err, err, errAsync, Ok, ok, okAsync, Result, ResultAsync } from "neverthrow";

function sync1(bool: boolean) {
    if (bool) return ok(true)
    return err("bad");
} // return type Ok<boolean, never> | Err<never, "bad">

function sync2(bool2: boolean) {
    if (bool2) return ok(100)
    return err("terrible")
}

function async1(bool: boolean) {
    if (bool) return okAsync(true)
    return errAsync("bad");
} // return type OkAsync<boolean, never> | ErrAsync<never, string>

function async2(bool2: boolean) {
    if (bool2) return okAsync(100)
    return errAsync("terrible")
}

const test1 = (bool: boolean) => sync1(bool).andThen(result => sync2(result)) // not callable
const test2 = (bool: boolean) => (sync1(bool) as Result<boolean, "bad">).andThen(result => sync2(result)) // succeeds on assertion
const test3 = (bool: boolean) => sync1(bool).andThen<Result<boolean, "bad">>(result => sync2(result)) // not callable
const test4 = (bool: boolean) => sync1(bool).andThen<boolean, "bad">(result => sync2(result)) // not callable

const sync1withResultTypeAnnotation: (bool: boolean) => Result<boolean, "bad"> = (bool: boolean) => sync1(bool)
const test5 = (bool: boolean) => sync1withResultTypeAnnotation(bool).andThen(result => sync2(result)) // succeeds when annotated

const asyncTest1 = (bool: boolean) => async1(bool).andThen(bool2 => async2(bool2)) // not callable
const asyncTest2 = (bool: boolean) => (async1(bool) as ResultAsync<boolean, "bad">).andThen(bool2 => async2(bool2)) // succeeds
const asyncTest3 = (bool: boolean) => async1(bool).andThen<ResultAsync<boolean, "bad">>(result => sync2(result)) // not callable
const asyncTest4 = (bool: boolean) => async1(bool).andThen<boolean, "bad">(result => sync2(result)) // not callable

const async1withResultTypeAnnotation: (bool: boolean) => ResultAsync<boolean, string> = (bool: boolean) => async1(bool)
const asyncTest5 = (bool: boolean) => async1withResultTypeAnnotation(bool).andThen(result => sync2(result)) // succeeds when annotated