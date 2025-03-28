import { Err, err, errAsync, Ok, ok, okAsync, Result, ResultAsync } from "neverthrow";

const sync1 = (bool: boolean) => bool ? ok(true) : err("bad");
// return type Ok<boolean, never> | Err<never, "bad">

const sync2 = (bool2: boolean) => bool2 ? ok(100) : err("terrible")
// return type Ok<number, never> | Err<never, "terrible">

const sync1Annotated = (bool: boolean): Result<boolean, "bad"> => bool ? ok(true) : err("bad");
// return type collapsed by manual annotation to Result<boolean, "bad">

const test1 = (bool: boolean) => sync1(bool).andThen(result => sync2(result)) // this expression is not callable - ts(2349)
const test2 = (bool: boolean) => (sync1(bool) as Result<boolean, "bad">).andThen(result => sync2(result)) // succeeds on assertion
const test3 = (bool: boolean) => sync1(bool).andThen<Result<boolean, "bad">>(result => sync2(result)) // this expression is not callable - ts(2349)
const test4 = (bool: boolean) => sync1(bool).andThen<boolean, "bad">(result => sync2(result)) // this expression is not callable - ts(2349)
const test5 = (bool: boolean) => sync1Annotated(bool).andThen(result => sync2(result)) // succeeds when manually annotated

const async1 = (bool: boolean) => bool ? okAsync(true) : errAsync("bad")
// return type ResultAsync<boolean, never> | ResultAsync<never, string>

const async2 = (bool2: boolean) => bool2 ? okAsync(100) : errAsync("terrible")
// return type ResultAsync<number, never> | ResultAsync<never, string>

const async1Annotated = (bool: boolean): ResultAsync<boolean, string> => bool ? okAsync(true) : errAsync("bad")
// return type collased by manual annotation to ResultAsync<boolean, string>

const asyncAndThenTest1 = (bool: boolean) => sync1(bool).asyncAndThen(result => async2(result)) // callable, but result is "any". Async inferred type is correct, ResultAsync<number, string>
const asyncAndThenTest2 = (bool: boolean) => sync1(bool).asyncAndThen<number, string>(result => async2(result)) // callable, but result is "any". Annotated type matches inferred type above.

const asyncTest1 = (bool: boolean) => async1(bool).andThen(bool2 => async2(bool2)) // this expression is not callable - ts(2349)
const asyncTest2 = (bool: boolean) => (async1(bool) as ResultAsync<boolean, "bad">).andThen(bool2 => async2(bool2)) // succeeds
const asyncTest3 = (bool: boolean) => async1(bool).andThen<ResultAsync<boolean, "bad">>(result => sync2(result)) // this expression is not callable - ts(2349)
const asyncTest4 = (bool: boolean) => async1(bool).andThen<boolean, "bad">(result => sync2(result)) // this expression is not callable - ts(2349)
const asyncTest5 = (bool: boolean) => async1Annotated(bool).andThen(result => sync2(result)) // succeeds when annotated