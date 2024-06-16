import { getQuickJS, getQuickJSSync } from "quickjs-emscripten";

// export async function setupCodeRunnerEnvironment() {
//   await getQuickJS().catch((err) => {
//     console.log(err);
//   });
// }

export async function runScript(code: string, values: Record<string, any>) {
  try {
    const wrappedCode = `
        async function run() {
            ${code}
        }
        try {
          run();
        } catch (err) {
          console.log("Error running script:", err);
        }
      `;
    // getQuickJS()
    // .then(async (QuickJs) => {
    const QuickJs = await getQuickJS();

    console.log("Creating script runner...");
    const vm = QuickJs.newContext();

    let interruptCycles = 0;
    vm.runtime.setMemoryLimit(1024 * 640);
    vm.runtime.setMaxStackSize(1024 * 640);
    vm.runtime.setInterruptHandler(() => ++interruptCycles > 1024);

    const setVariableValueHandle = vm.newFunction(
      "setVariableValue",
      (...args) => {
        const nativeArgs = args.map(vm.dump);
        const [name, value] = nativeArgs;

        if (typeof value !== "string" && typeof value !== "number") return;

        // check if value is a promise

        if (values[name]) {
          values[name].value = value;
        } else {
          values[name] = { type: "variable", value };
        }
      },
    );

    const fetchHandle = vm.newFunction("fetch", (...args) => {
      const [input, init] = args.map(vm.dump);
      const deferred = vm.newPromise();

      fetch(input, init).then((result) => {
        result.text().then((text) => {
          deferred.resolve(vm.newString(text));
        });
      });

      deferred.settled.then(vm.runtime.executePendingJobs);
      return deferred.handle;
    });

    fetchHandle.consume((handle) => vm.setProp(vm.global, "fetch", handle));

    vm.setProp(vm.global, "setVariableValue", setVariableValueHandle);

    // vm.runtime.setMemoryLimit(1024 * 1024 * 20); // 2 MB;

    const result = vm.unwrapResult(vm.evalCode(wrappedCode));
    console.log("Has pending job?", vm.getPromiseState(result).type);

    // check if output is a promise
    const promiseState = vm.getPromiseState(result);

    if (promiseState.type === "pending") {
      const resultPromise = await vm.resolvePromise(result);

      // console.log({ result });
      if (resultPromise.error) {
        console.log("Execution failed:", vm.dump(resultPromise.error));
        resultPromise.error.dispose();
      } else {
        console.log("Success:", vm.dump(resultPromise.value));
        resultPromise.value.dispose();
      }
    }

    result.dispose();

    setVariableValueHandle.dispose();
    // fetchHandle.dispose();

    // console.log(vm.runtime.dumpMemoryUsage());
    vm.dispose();

    // .catch((err) => {
    //   console.log(err);
    // });
  } catch (err) {
    console.log(err);
  }
}
